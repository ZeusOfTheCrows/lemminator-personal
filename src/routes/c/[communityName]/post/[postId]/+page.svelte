<script lang="ts">
	import { page } from '$app/stores';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import type { PageData } from './$types';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import PostOverviewCard from '$lib/components/PostOverviewCard.svelte';
	import CommentSection from '$lib/components/CommentSection.svelte';
	import { getCommentTree, expandCommentsForId } from '$lib/js/comments';
	import type { CommentView } from 'lemmy-js-client';
	import { getClient } from '$lib/js/client';
	import { session } from '$lib/js/globals';

	export let data: PageData;
	let commentViews: CommentView[] = data.commentsResponse.comments;

	async function loadCommentsForId(comment_id: number) {
		const newComments = await getClient().getComments(undefined, comment_id, $session.jwt);
		commentViews = expandCommentsForId(comment_id, commentViews, newComments.comments);
	}
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
				<CommentSection
					tree={getCommentTree(commentViews)}
					on:subtreeExpansionRequested={(item) => loadCommentsForId(item.detail)}
				/>
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
