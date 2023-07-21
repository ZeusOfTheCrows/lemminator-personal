<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import type { GetSiteResponse } from 'lemmy-js-client';
	import { getClient } from '$lib/js/client';

	let client = getClient();
	let siteResponse: Promise<GetSiteResponse> = new Promise(() => {});
	$: {
		siteResponse = client.getSite();
	}
</script>

<svelte:head>
	{#await siteResponse then siteResponse}
		<title>Frontpage - {siteResponse.site_view.site.name}</title>
	{/await}
</svelte:head>

<PageHolder>
	<svelte:fragment slot="main">
		<PostList />
	</svelte:fragment>
	<svelte:fragment slot="secondarySidebar">
		<SecondarySidebar {siteResponse} />
	</svelte:fragment>
</PageHolder>
