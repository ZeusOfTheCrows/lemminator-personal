<script lang="ts">
	import Comment from '$lib/components/Comment.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import ThemedButton from '$lib/components/ThemedButton.svelte';
	import TitledGraphic from '$lib/components/TitledGraphic.svelte';
	import { cachedCalls, refreshUnreadCount, session } from '$lib/js/globals';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	{#await $cachedCalls.siteResponse then siteResponse}
		<title>Inbox - {siteResponse.site_view.site.name}</title>
	{/await}
</svelte:head>

<PageHolder>
	<svelte:fragment slot="main">
		<div class="inboxPage">
			{#if data.repliesResponse}
				{#if data.repliesResponse.replies.length}
					<div class="replyList">
						{#each data.repliesResponse.replies as reply}
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
			{:else}
				<TitledGraphic
					icon="circle_notifications"
					title="Stay on top of the conversation"
					subtitle="Replies to your posts go to your inbox."
					iconStyle="prerounded"
				>
					<svelte:fragment slot="additionalActions">
						<ThemedButton
							icon="person"
							appearance="filled"
							on:click={() => ($session = { state: 'authenticating', jwt: undefined })}
						>
							Log in
						</ThemedButton>
					</svelte:fragment>
				</TitledGraphic>
			{/if}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="secondarySidebar">
		<SecondarySidebar />
	</svelte:fragment>
</PageHolder>

<style lang="scss">
	.inboxPage {
		.replyList {
			display: flex;
			flex-direction: column;
		}
	}
</style>
