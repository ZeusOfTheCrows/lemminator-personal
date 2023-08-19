<script lang="ts">
	import Comment from '$lib/components/Comment.svelte';
	import type { CommentReplyView } from 'lemmy-js-client';
	import TitledGraphic from './TitledGraphic.svelte';
	import ElevatedBox from './ElevatedBox.svelte';

	export let replies: CommentReplyView[];
</script>

{#if replies.length}
	<ElevatedBox stacking="vertical">
		<div class="replyList">
			{#each replies as reply}
				<div class="reply">
					<Comment
						node={{ leaf: reply, children: [], fullPath: [] }}
						appearance="thread"
						focusedCommentId={null}
						flattenedTree={[reply]}
						on:readStateChange
					/>
				</div>
			{/each}
		</div>
	</ElevatedBox>
{:else}
	<TitledGraphic
		icon="circle_notifications"
		title="Stay on top of the conversation"
		subtitle="Replies to your posts will appear here."
		iconStyle="prerounded"
	/>
{/if}

<style lang="scss">
	@use '$lib/css/colors';

	.replyList {
		display: flex;
		flex-direction: column;

		@include colors.themify() {
			background-color: colors.themed('maxContrastTheme');
		}

		.reply {
			@include colors.themify() {
				&:nth-child(2n) {
					background: rgba(colors.themed('elevatedBoxAccent'), 0.25);
				}
			}
		}
	}
</style>
