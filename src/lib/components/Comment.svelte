<script lang="ts">
	import { renderEnhancedMarkdown } from '$lib/js/markdown';
	import EntityIcon from './EntityIcon.svelte';
	import ThemedButton from './ThemedButton.svelte';
	import type { CommentTreeNode } from '$lib/js/comments';
	import CommentList from './CommentList.svelte';
	import type { CommentView } from 'lemmy-js-client';
	import { formatRelativeTime } from '$lib/js/client';
	import { createEventDispatcher } from 'svelte';

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

	let commentElement: HTMLElement;
	export let focusedCommentId: number | null;
	$: {
		if (focusedCommentId === node.leaf.comment.id) {
			commentElement.scrollIntoView();
		}
	}
</script>

<div
	class="comment"
	class:comment--alternate={isAlternate}
	class:comment--selected={focusedCommentId === node.leaf.comment.id}
	class:comment--deselected={focusedCommentId !== null && focusedCommentId !== node.leaf.comment.id}
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
		<ThemedButton appearance="dimmed" icon="keyboard_arrow_up" title="Upvote" fontSize="0.875rem">
			{node.leaf.counts.upvotes}
		</ThemedButton>
		<ThemedButton
			appearance="dimmed"
			icon="keyboard_arrow_down"
			title="Downvote"
			fontSize="0.875rem"
		>
			{node.leaf.counts.downvotes}
		</ThemedButton>
	</div>
</div>
{#if node.children.length}
	<div class="commentDescendants">
		<!-- Event forwarding doesn't work here. We have to redispatch it. -->
		<CommentList
			nodes={node.children}
			{flattenedTree}
			{focusedCommentId}
			on:subtreeExpansionRequested={(item) => dispatch('subtreeExpansionRequested', item.detail)}
		/>
	</div>
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
	}

	.commentDescendants {
		@include colors.themify() {
			border-left: solid 10px colors.themed('color2');
		}
	}
</style>
