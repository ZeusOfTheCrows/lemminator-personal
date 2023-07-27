<script lang="ts">
	import { renderEnhancedMarkdown } from '$lib/js/markdown';
	import type { CommentView, GetCommentsResponse } from 'lemmy-js-client';
	import ElevatedBox from './ElevatedBox.svelte';
	import EntityIcon from './EntityIcon.svelte';
	import TransparentButton from './TransparentButton.svelte';

	export let commentsResponse: GetCommentsResponse;

	function getCommentViewsForPath(path: string): CommentView[] {
		return commentsResponse.comments.filter((c) => c.comment.path === `${path}.${c.comment.id}`);
	}
</script>

<ElevatedBox stacking="vertical">
	<div class="commentSection">
		{#if commentsResponse.comments.length == 0}
			<div class="commentSection__isEmpty">
				There are no comments yet. Early bird gets the worm!
			</div>
		{/if}
		{#each getCommentViewsForPath('0') as commentRecord}
			<div class="comment">
				<div class="comment__metaLine">
					{#if commentRecord.creator.avatar}
						<EntityIcon src={commentRecord.creator.avatar} alt="Avatar" />
					{/if}
					{commentRecord.creator.name}
				</div>
				<div class="comment__content">
					{@html renderEnhancedMarkdown(commentRecord.comment.content)}
				</div>
				<div class="comment__actionLine">
					<TransparentButton
						appearance="dimmed"
						icon="keyboard_arrow_up"
						title="Upvote"
						fontSize="0.875rem"
					>
						{commentRecord.counts.upvotes}
					</TransparentButton>
					<TransparentButton
						appearance="dimmed"
						icon="keyboard_arrow_down"
						title="Downvote"
						fontSize="0.875rem"
					>
						{commentRecord.counts.downvotes}
					</TransparentButton>
				</div>
			</div>
		{/each}
	</div>
</ElevatedBox>

<style lang="scss">
	@use '$lib/css/colors';
	@use '$lib/css/markdown';

	.commentSection {
		.commentSection__isEmpty {
			padding: 2rem 0;
			text-align: center;
			opacity: 0.5;
		}

		.comment {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			padding: 1rem 0;

			@include colors.themify() {
				border-bottom: solid 1px colors.themed('subtleBorder');

				&:nth-child(2n) {
					background: rgba(colors.themed('themedShadow'), 0.02);
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
				@include markdown.styleExternalContent;
			}

			.comment__actionLine {
				display: flex;
				flex-direction: row;
				gap: 1rem;
				padding: 0 0.5rem;
			}
		}
	}
</style>
