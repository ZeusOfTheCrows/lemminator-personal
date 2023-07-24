<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import { cachedCalls } from '$lib/js/globals';
</script>

<svelte:head>
	{#await $cachedCalls.siteResponse then siteResponse}
		<title>Frontpage - {siteResponse.site_view.site.name}</title>
	{/await}
</svelte:head>

<PageHolder>
	<svelte:fragment slot="main">
		<PostList />
	</svelte:fragment>
	<svelte:fragment slot="secondarySidebar">
		<SecondarySidebar />
	</svelte:fragment>
</PageHolder>
