<script lang="ts">
	import Comment from '$lib/components/Comment.svelte';
	import { refreshUnreadCount, session } from '$lib/js/globals';
	import type { CommentReplyView } from 'lemmy-js-client';
	import TitledGraphic from './TitledGraphic.svelte';

	export let replies: CommentReplyView[];
</script>

{#if replies.length}
	<div class="replyList">
		{#each replies as reply}
			<div class="reply">
				<Comment
					node={{ leaf: reply, children: [], fullPath: [] }}
					appearance="standalone"
					focusedCommentId={null}
					flattenedTree={[reply]}
					on:readStateChange={() => refreshUnreadCount($session)}
				/>
			</div>
		{/each}
	</div>
{:else}
	<TitledGraphic
		icon="circle_notifications"
		title="Stay on top of the conversation"
		subtitle="Replies to your posts will appear here."
		iconStyle="prerounded"
	/>
{/if}

<style lang="scss">
	.replyList {
		display: flex;
		flex-direction: column;
	}
</style>
