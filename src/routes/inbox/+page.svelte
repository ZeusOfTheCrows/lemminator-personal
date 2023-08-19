<script lang="ts">
	import PageHolder from '$lib/components/PageHolder.svelte';
	import ReplyListOrPlaceholder from '$lib/components/ReplyListOrPlaceholder.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import ThemedButton from '$lib/components/ThemedButton.svelte';
	import TitledGraphic from '$lib/components/TitledGraphic.svelte';
	import { getClient } from '$lib/js/client';
	import { cachedCalls, refreshUnreadCount, session } from '$lib/js/globals';
	import type { PageData } from './$types';

	export let data: PageData;
	export let activeView: 'listOfUnreads' | 'archive' = 'listOfUnreads';

	let unreadsResponse = data.unreadsResponse ?? null;
	let archiveResponse = data.archiveResponse ?? null;

	async function refreshUnreads() {
		if ($session.state !== 'authenticated') return;
		const client = getClient();
		unreadsResponse = await client.getReplies({ unreadOnly: true, jwt: $session.jwt });
	}

	async function refreshArchive() {
		if ($session.state !== 'authenticated') return;
		const client = getClient();
		archiveResponse = await client.getReplies({ unreadOnly: false, jwt: $session.jwt });
	}

	async function propagateReadStateChange() {
		await Promise.all([refreshUnreadCount($session), refreshUnreads(), refreshArchive()]);
	}
</script>

<svelte:head>
	{#await $cachedCalls.siteResponse then siteResponse}
		<title>Inbox - {siteResponse.site_view.site.name}</title>
	{/await}
</svelte:head>

<PageHolder>
	<svelte:fragment slot="main">
		<div class="inboxPage">
			<!-- Implicit login check -->
			{#if unreadsResponse && archiveResponse}
				<div class="inboxPage__top">
					<h3 class="inboxPage__title">
						{#if activeView === 'listOfUnreads' && unreadsResponse.replies.length}
							Unread list
						{:else if activeView === 'archive' && archiveResponse.replies.length}
							Inbox archive
						{/if}
					</h3>
					<div class="inboxPage__settings">
						<ThemedButton
							icon="list"
							title="Show unread list"
							toggled={activeView === 'listOfUnreads'}
							on:click={() => (activeView = 'listOfUnreads')}
						/>
						<ThemedButton
							icon="archive"
							title="Show inbox archive"
							toggled={activeView === 'archive'}
							on:click={() => (activeView = 'archive')}
						/>
					</div>
				</div>
				{#if activeView === 'listOfUnreads'}
					<ReplyListOrPlaceholder
						replies={unreadsResponse.replies}
						on:readStateChange={propagateReadStateChange}
					/>
				{:else if activeView === 'archive'}
					{#if archiveResponse}
						<ReplyListOrPlaceholder
							replies={archiveResponse.replies}
							on:readStateChange={propagateReadStateChange}
						/>
					{/if}
				{/if}
			{:else}
				<TitledGraphic
					icon="circle_notifications"
					title="Stay on top of the conversation"
					subtitle="Replies to your posts will appear here."
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
	@use '$lib/css/colors';

	.inboxPage {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.inboxPage__top {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			.inboxPage__title {
				font-weight: bold;
			}

			.inboxPage__settings {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: end;
				gap: 0.3rem;
			}
		}
	}
</style>
