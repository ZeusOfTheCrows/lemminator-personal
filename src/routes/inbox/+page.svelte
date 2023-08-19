<script lang="ts">
	import Comment from '$lib/components/Comment.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import ReplyList from '$lib/components/ReplyList.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import ThemedButton from '$lib/components/ThemedButton.svelte';
	import TitledGraphic from '$lib/components/TitledGraphic.svelte';
	import { cachedCalls, session } from '$lib/js/globals';
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
				<ReplyList replies={data.repliesResponse.replies.filter((r) => !r.comment_reply.read)} />
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
</style>
