<script lang="ts">
	import { renderEnhancedMarkdown } from '$lib/js/markdown';
	import EntityIcon from './EntityIcon.svelte';
	import ThemedButton from './ThemedButton.svelte';
	import type { CommentTreeNode } from '$lib/js/comments';
	import CommentList from './CommentList.svelte';
	import type { CommentView } from 'lemmy-js-client';
	import { formatRelativeTime, getClient } from '$lib/js/client';
	import { createEventDispatcher } from 'svelte';
	import { cachedCalls, getLocalPerson, session } from '$lib/js/globals';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import CommentComposer from './CommentComposer.svelte';

	const dispatch = createEventDispatcher();

	export let node: CommentTreeNode;
	export let flattenedTree: CommentView[];
	let isAlternate: boolean;
	$: {
		const index = flattenedTree.findIndex((item) => item == node.leaf);
		if (index === undefined) {
			throw 'could not find item in comment tree';
		} else {
			isAlternate = index % 2 != 0;
		}
	}

	let showReplyWriter = false;

	let commentElement: HTMLElement;
	export let focusedCommentId: number | null;
	$: {
		if (focusedCommentId === node.leaf.comment.id) {
			commentElement.scrollIntoView();
		}
	}
	async function sendToggledVote(valueToToggle: 1 | -1) {
		if (!$session.jwt) throw 'Token should have been present';
		const client = getClient();
		const commentResponse = await client.voteOnComment(
			node.leaf.comment.id,
			node.leaf.my_vote === valueToToggle ? 0 : valueToToggle,
			$session.jwt
		);

		node.leaf = commentResponse.comment_view;
	}

	async function toggleVote(vote: 1 | -1) {
		if ($session.state === 'unauthenticated') {
			$session = {
				state: 'authenticating',
				jwt: undefined,
				callback: () => sendToggledVote(vote)
			};
		} else if ($session.state === 'authenticated') {
			await sendToggledVote(vote);
		}
	}

	let deleteState: 'not_deleted' | 'deleting' | 'deleted' = 'not_deleted';
	async function deleteComment() {
		const isConfirmed = confirm('This comment will be deleted.');
		if (!isConfirmed) return;

		if ($session.state === 'authenticated') {
			const client = getClient();
			deleteState = 'deleting';
			try {
				await client.deleteComment({ commentId: node.leaf.comment.id, jwt: $session.jwt });
			} catch (e) {
				deleteState = 'not_deleted';
			}
			deleteState = 'deleted';
		}
	}

	function propagateReply(event: { detail: CommentView }) {
		const emptyChildren: CommentTreeNode[] = [];
		node.children = [
			{
				leaf: event.detail,
				children: emptyChildren,
				fullPath: node.fullPath.concat(event.detail.comment.id)
			}
		].concat(node.children);
		showReplyWriter = false;
	}

	let composerElement: CommentComposer | undefined;
	$: {
		if (composerElement) {
			composerElement.focusCommentField();
		}
	}
</script>

{#if deleteState === 'not_deleted'}
	<div
		class="comment"
		class:comment--alternate={isAlternate}
		class:comment--selected={focusedCommentId === node.leaf.comment.id}
		class:comment--deselected={focusedCommentId !== null &&
			focusedCommentId !== node.leaf.comment.id}
		bind:this={commentElement}
	>
		<div class="comment__metaLine">
			{#if node.leaf.creator.avatar}
				<EntityIcon src={node.leaf.creator.avatar} alt="Avatar" />
			{/if}
			{node.leaf.creator.name}
			<div class="comment__relativeTimePresep">&middot;</div>
			<div class="comment__relativeTime">
				{formatRelativeTime(node.leaf.comment.published)}
			</div>
		</div>
		<div class="comment__content">
			{@html renderEnhancedMarkdown(node.leaf.comment.content)}
		</div>
		<div class="comment__actionLine">
			<ThemedButton
				appearance={node.leaf.my_vote == 1 ? 'default' : 'dimmed'}
				icon="keyboard_arrow_up"
				title="Upvote"
				fontSize="0.875rem"
				toggled={!!$session.jwt && node.leaf.my_vote == 1}
				on:click={() => toggleVote(1)}
			>
				{node.leaf.counts.upvotes}
			</ThemedButton>
			<ThemedButton
				appearance={node.leaf.my_vote == -1 ? 'default' : 'dimmed'}
				icon="keyboard_arrow_down"
				title="Downvote"
				fontSize="0.875rem"
				toggled={!!$session.jwt && node.leaf.my_vote == -1}
				on:click={() => toggleVote(-1)}
			>
				{node.leaf.counts.downvotes}
			</ThemedButton>
			<ThemedButton icon="reply" title="Reply" on:click={() => (showReplyWriter = true)} />
			{#await $cachedCalls.siteResponse then siteResponse}
				{#if getLocalPerson(siteResponse)?.id === node.leaf.creator.id}
					<ThemedButton icon="delete" title="Delete" on:click={deleteComment} />
				{/if}
			{/await}
		</div>
		{#if showReplyWriter}
			<div class="comment__addReply">
				<CommentComposer
					bind:this={composerElement}
					context={{
						mode: 'addCommentReply',
						postId: node.leaf.post.id,
						parentCommentId: node.leaf.comment.id
					}}
					on:dismiss={() => (showReplyWriter = false)}
					on:commentSubmit={propagateReply}
				/>
			</div>
		{/if}
	</div>
	{#if node.children.length}
		<div class="commentDescendants">
			<!-- Event forwarding doesn't work here. We have to redispatch it. -->
			<CommentList
				nodes={node.children}
				{flattenedTree}
				{focusedCommentId}
				on:subtreeExpansionRequest={(item) => dispatch('subtreeExpansionRequest', item.detail)}
			/>
		</div>
	{/if}
{:else if deleteState === 'deleting'}
	<LoadingSpinner minHeight="2rem" />
{/if}

<style lang="scss">
	@use '$lib/css/colors';
	@use '$lib/css/markdown';
	@use '$lib/css/measurements';

	.comment {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem 0;
		scroll-margin: calc(measurements.$headerVSize + 1rem);

		@include colors.themify() {
			border-bottom: solid 1px colors.themed('subtleBorder');

			&.comment--alternate {
				background: rgba(colors.themed('elevatedBoxAccent'), 0.25);
			}

			&.comment--selected {
				box-shadow: inset 0 0 5px rgba(colors.themed('themedShadow'), 0.1);
			}

			&.comment--deselected {
				opacity: 0.4;
			}
		}

		.comment__metaLine,
		.comment__content {
			padding: 0 1rem;
		}

		.comment__metaLine {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.2rem;
			font-size: 0.75rem;

			@include colors.themify() {
				color: colors.themed('deemphColor');
			}
		}

		.comment__content {
			font-size: 0.9rem;
			line-height: 1.25rem;
			@include markdown.styleExternalContent($allowFontSizeIncreases: false);
		}

		.comment__actionLine {
			display: flex;
			flex-direction: row;
			gap: 1rem;
			padding: 0 0.5rem;
		}

		.comment__addReply {
			padding: 0.5rem 1rem;
		}
	}

	.commentDescendants {
		@include colors.themify() {
			border-left: solid 10px colors.themed('color2');
		}
	}
</style>
