<script lang="ts">
	import { renderEnhancedMarkdown } from '$lib/js/markdown';
	import EntityIcon from './EntityIcon.svelte';
	import ThemedButton from './ThemedButton.svelte';
	import type { CommentTreeNode } from '$lib/js/comments';
	import CommentList from './CommentList.svelte';
	import type { CommentView } from 'lemmy-js-client';
	import { formatRelativeUtcTime, getClient } from '$lib/js/client';
	import { createEventDispatcher } from 'svelte';
	import { cachedCalls, getLocalPerson, session } from '$lib/js/globals';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import CommentComposer from './CommentComposer.svelte';
	import moment from 'moment-timezone';
	import UserTag from './UserTag.svelte';
	import { getDetailLinkForComment } from '$lib/js/navigation';

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

	let showEditComment = false;
	let showAddReply = false;

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
				deleteState = 'deleted';
			} catch (e) {
				deleteState = 'not_deleted';
			}
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
		showAddReply = false;
	}

	function propagateEdit(event: { detail: CommentView }) {
		node.leaf = event.detail;
		showEditComment = false;
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
			<UserTag person={node.leaf.creator} showAvatar={true} />
			&middot;
			<div title={`Published on ${moment.tz(node.leaf.comment.published, 'UTC').format('LLL')}`}>
				<a href={getDetailLinkForComment(node.leaf)}>
					{formatRelativeUtcTime(node.leaf.comment.published)}
				</a>
			</div>
			{#if node.leaf.comment.updated}
				<span
					class="comment__editedIndicator"
					title={`Edited on ${moment.tz(node.leaf.comment.updated, 'UTC').format('LLL')}`}
				>
					(edited)
				</span>
			{/if}
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
			<ThemedButton
				icon="reply"
				title="Reply"
				on:click={() => {
					showAddReply = true;
					showEditComment = false;
				}}
			/>
			{#await $cachedCalls.siteResponse then siteResponse}
				{#if getLocalPerson(siteResponse)?.id === node.leaf.creator.id}
					<ThemedButton
						icon="edit"
						title="Edit"
						on:click={() => {
							showEditComment = true;
							showAddReply = false;
						}}
					/>
					<ThemedButton icon="delete" title="Delete" on:click={deleteComment} />
				{/if}
			{/await}
		</div>
		{#if showEditComment}
			<div class="comment__addReply">
				<CommentComposer
					bind:this={composerElement}
					context={{
						mode: 'editComment',
						commentId: node.leaf.comment.id,
						currentContent: node.leaf.comment.content
					}}
					on:dismiss={() => (showEditComment = false)}
					on:commentEdit={propagateEdit}
				/>
			</div>
		{/if}
		{#if showAddReply}
			<div class="comment__addReply">
				<CommentComposer
					bind:this={composerElement}
					context={{
						mode: 'addCommentReply',
						postId: node.leaf.post.id,
						parentCommentId: node.leaf.comment.id
					}}
					on:dismiss={() => (showAddReply = false)}
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

			a {
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}
			}

			@include colors.themify() {
				color: colors.themed('deemphColor');
			}
		}

		.comment__editedIndicator {
			opacity: 0.5;
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
