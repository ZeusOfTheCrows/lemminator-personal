<script lang="ts">
	import InboxQueue from '$lib/components/InboxQueue.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import ReplyListOrPlaceholder from '$lib/components/ReplyListOrPlaceholder.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import ThemedButton from '$lib/components/ThemedButton.svelte';
	import TitledGraphic from '$lib/components/TitledGraphic.svelte';
	import { getClient } from '$lib/js/client';
	import { cachedCalls, numOfUnreads, refreshUnreadCount, session } from '$lib/js/globals';
	import type { PageData } from './$types';

	export let data: PageData;
	export let activeView: 'detailedInbox' | 'compactInbox' | 'archive' = 'detailedInbox';

	let unreadsResponse = data.unreadsResponse ?? null;
	let archiveResponse = data.archiveResponse ?? null;
	let loading = false;

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

	async function refreshAll() {
		loading = true;
		await Promise.all([refreshUnreadCount($session), refreshUnreads(), refreshArchive()]);
		loading = false;
	}

	$: {
		if (!unreadsResponse && $session.state === 'authenticated') {
			refreshAll();
		}
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
						{#if activeView === 'detailedInbox' && unreadsResponse.replies.length}
							Detailed inbox
						{:else if activeView === 'compactInbox' && unreadsResponse.replies.length}
							Compact inbox
						{:else if activeView === 'archive' && archiveResponse.replies.length}
							Archive
						{/if}
					</h3>
					<div class="inboxPage__settings">
						{#if $numOfUnreads !== null && unreadsResponse.replies.length !== $numOfUnreads && !loading}
							<div class="inboxPage__refreshCue">
								<ThemedButton icon="refresh" title="Refresh data" on:click={refreshAll} />
							</div>
						{/if}
						<div class="inboxPage__views">
							<ThemedButton
								icon="zoom_in"
								title="Show detailed inbox"
								toggled={activeView === 'detailedInbox'}
								on:click={() => (activeView = 'detailedInbox')}
								fontSize="1.1rem"
							/>
							<ThemedButton
								icon="list"
								title="Show compact inbox"
								toggled={activeView === 'compactInbox'}
								on:click={() => (activeView = 'compactInbox')}
								fontSize="1.1rem"
							/>
							<ThemedButton
								icon="archive"
								title="Show archive"
								toggled={activeView === 'archive'}
								on:click={() => (activeView = 'archive')}
								fontSize="1.1rem"
							/>
						</div>
					</div>
				</div>
				{#if activeView === 'detailedInbox'}
					<InboxQueue replies={unreadsResponse.replies} on:readStateChange={refreshAll} />
				{:else if activeView === 'compactInbox'}
					<ReplyListOrPlaceholder
						replies={unreadsResponse.replies}
						on:readStateChange={refreshAll}
					/>
				{:else if activeView === 'archive'}
					{#if archiveResponse}
						<ReplyListOrPlaceholder
							replies={archiveResponse.replies}
							on:readStateChange={refreshAll}
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
			}

			.inboxPage__refreshCue {
				padding-right: 1rem;
				@include colors.themify() {
					border-right: solid 1px colors.themed('subtleBorder');
				}
			}

			.inboxPage__views {
				display: flex;
				align-items: center;
				padding-left: 1rem;
			}
		}
	}
</style>
