<script lang="ts">
	import { page } from '$app/stores';
	import PostList from '$lib/components/PostList.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
</script>

<PageHolder>
	<svelte:fragment slot="main">
		<PostList communityName={$page.params.communityName} />
	</svelte:fragment>
	<svelte:fragment slot="secondarySidebar">
		<SecondarySidebar />
	</svelte:fragment>
</PageHolder>
