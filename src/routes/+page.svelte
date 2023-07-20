<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
</script>

<PageHolder>
	<svelte:fragment slot="main">
		<PostList />
	</svelte:fragment>
	<svelte:fragment slot="secondarySidebar">
		<SecondarySidebar />
	</svelte:fragment>
</PageHolder>
