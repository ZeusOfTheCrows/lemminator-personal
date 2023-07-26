<script lang="ts">
	import { page } from '$app/stores';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import type { PageData } from './$types';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import PostOverviewCard from '$lib/components/PostOverviewCard.svelte';
	import CommentSection from '$lib/components/CommentSection.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>
		{data.postResponse.post_view.post.name} - {data.postResponse.community_view.community.title}
	</title>
</svelte:head>

<PageHolder>
	<svelte:fragment slot="main">
		{#await data.postResponse}
			<LoadingSpinner minHeight="10rem" />
		{:then postResponse}
			<div class="postDetailLayouter">
				<PostOverviewCard postView={postResponse.post_view} active={null} variant="detail" />
				<CommentSection commentsResponse={data.commentsResponse} />
			</div>
		{/await}
	</svelte:fragment>
	<svelte:fragment slot="secondarySidebar">
		<SecondarySidebar communityName={$page.params.communityName} />
	</svelte:fragment>
</PageHolder>

<style lang="scss">
	.postDetailLayouter {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
