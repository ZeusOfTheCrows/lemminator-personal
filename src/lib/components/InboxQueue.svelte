<script lang="ts">
	import Comment from '$lib/components/Comment.svelte';
	import type { CommentReplyView, CommentView } from 'lemmy-js-client';
	import TitledGraphic from './TitledGraphic.svelte';
	import { onMount } from 'svelte';
	import ElevatedBox from './ElevatedBox.svelte';
	import ThemedButton from './ThemedButton.svelte';
	import { getClient } from '$lib/js/client';
	import { session } from '$lib/js/globals';
	import PostReference from './PostReference.svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';

	export let replies: CommentReplyView[];
	let currentReplyIndex: number | null;
	let currentReply: CommentReplyView | null;
	$: {
		if (currentReplyIndex !== null) {
			// Can happen when reading the last comment
			currentReplyIndex = Math.min(currentReplyIndex, replies.length - 1);

			currentReply = replies[currentReplyIndex];
		}
	}
	let parentComments: Record<number, Promise<CommentView>> = {};
	$: {
		for (const reply of replies) {
			acquireParent(reply);
		}
	}

	async function acquireParent(reply: CommentView) {
		const firstCommentPath = reply.comment.path.split('.').map((n) => parseInt(n));
		const parentCommentId = firstCommentPath.at(-2);
		if (parentCommentId && parentComments[reply.comment.id] === undefined) {
			const client = getClient();
			parentComments[reply.comment.id] = client
				.getComment({ commentId: parentCommentId, jwt: $session.jwt })
				.then((c) => c.comment_view);
		}
	}

	onMount(() => {
		currentReplyIndex = replies.length ? 0 : null;
	});
</script>

{#if currentReply && currentReplyIndex !== null}
	<div class="inboxQueue">
		<PostReference citedCommentView={currentReply} />
		<!-- This is quite verbose, but at least TypeScript compiler likes it -->
		{#if Object.keys(parentComments).includes(currentReply.comment.id.toString())}
			{#await parentComments[currentReply.comment.id]}
				<LoadingSpinner minHeight="4rem" />
			{:then commentResponse}
				<Comment
					node={{ leaf: commentResponse, children: [], fullPath: [] }}
					appearance="standalone"
					focusedCommentId={null}
					flattenedTree={[currentReply]}
					on:readStateChange
				/>
			{/await}
		{/if}
		<ElevatedBox stacking="vertical">
			<Comment
				node={{ leaf: currentReply, children: [], fullPath: [] }}
				appearance="thread"
				focusedCommentId={null}
				flattenedTree={[currentReply]}
				on:readStateChange
			/>
		</ElevatedBox>
		{#if replies.length > 1}
			<div class="inboxQueue__navigation">
				<div class="inboxQueue__loadPrevious">
					{#if currentReplyIndex > 0}
						<ThemedButton
							icon="keyboard_double_arrow_left"
							on:click={() => (currentReplyIndex = (currentReplyIndex ?? 0) - 1)}
						>
							Previous unread
						</ThemedButton>
					{/if}
				</div>
				<div class="inboxQueue__loadNext">
					{#if currentReplyIndex < replies.length - 1}
						<ThemedButton
							icon="keyboard_double_arrow_right"
							on:click={() => (currentReplyIndex = (currentReplyIndex ?? 0) + 1)}
						>
							Next unread
						</ThemedButton>
					{/if}
				</div>
			</div>
		{/if}
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
	.inboxQueue {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		gap: 1rem;

		.inboxQueue__navigation {
			display: flex;
			justify-content: space-between;
			gap: 1rem;
		}
	}
</style>
