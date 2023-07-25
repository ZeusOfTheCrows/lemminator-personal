<script lang="ts">
	import { page } from '$app/stores';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import type { PageData } from './$types';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import PostOverviewCard from '$lib/components/PostOverviewCard.svelte';

	export let data: PageData;
</script>

<PageHolder>
	<svelte:fragment slot="main">
		{#await data.postResponse}
			<LoadingSpinner minHeight="10rem" />
		{:then postResponse}
			<PostOverviewCard postView={postResponse.post_view} active={null} variant="detail" />
		{/await}
	</svelte:fragment>
	<svelte:fragment slot="secondarySidebar">
		<SecondarySidebar communityName={$page.params.communityName} />
	</svelte:fragment>
</PageHolder>
