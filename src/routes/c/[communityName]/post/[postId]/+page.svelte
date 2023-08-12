<script lang="ts">
	import { page } from '$app/stores';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import type { PageData } from './$types';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import PostOverviewCard from '$lib/components/PostOverviewCard.svelte';
	import CommentSection from '$lib/components/CommentSection.svelte';
	import {
		getCommentTree,
		expandCommentsForId,
		type CommentTree,
		expandTopLevelComments
	} from '$lib/js/comments';
	import type { CommentView } from 'lemmy-js-client';
	import { getClient } from '$lib/js/client';
	import { session } from '$lib/js/globals';
	import ThemedButton from '$lib/components/ThemedButton.svelte';
	import CommentComposer from '$lib/components/CommentComposer.svelte';
	import { invalidate } from '$app/navigation';
	import FederationHint from '$lib/components/FederationHint.svelte';

	export let data: PageData;
	let commentViews: CommentView[] = data.commentsResponse.comments;
	let commentTree: CommentTree;
	$: {
		commentTree = getCommentTree(commentViews);
	}

	let nextCommentPageToLoad = 2;
	let moreCommentsAvailable = true;
	let loadingMore = false;
	$: {
		const cumulativeChildCounts = commentTree.topNodes.reduce(
			(acc, cur) => acc + cur.leaf.counts.child_count,
			commentTree.topNodes.length
		);
		if (moreCommentsAvailable) {
			moreCommentsAvailable = cumulativeChildCounts < data.postResponse.post_view.counts.comments;
		}
	}

	async function loadCommentsForId(comment_id: number) {
		const newComments = await getClient().getComments(undefined, comment_id, $session.jwt);
		commentViews = expandCommentsForId(comment_id, commentViews, newComments.comments);
	}

	async function loadMoreComments() {
		const client = getClient();
		loadingMore = true;
		const commentResponse = await client.getComments(
			data.postResponse.post_view.post.id,
			undefined,
			$session.jwt,
			nextCommentPageToLoad
		);
		if (commentResponse.comments.length == 0) {
			moreCommentsAvailable = false;
		}
		loadingMore = false;
		nextCommentPageToLoad += 1;
		commentViews = expandTopLevelComments(commentViews, commentResponse.comments);
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
				{#if !data.postResponse.community_view.community.local}
					<FederationHint
						contentType="post"
						hostname={new URL(data.postResponse.post_view.community.actor_id).hostname}
					/>
				{/if}
				<PostOverviewCard postView={postResponse.post_view} active={null} variant="detail" />
				<CommentComposer
					postId={postResponse.post_view.post.id}
					parentCommentId={null}
					on:commentSubmit={(event) => {
						commentViews = [event.detail].concat(commentViews);
					}}
				/>
				<CommentSection
					tree={commentTree}
					on:subtreeExpansionRequested={(item) => loadCommentsForId(item.detail)}
				/>
				{#if moreCommentsAvailable}
					<div class="postDetailLayouter__loadMore">
						{#if loadingMore}
							<LoadingSpinner minHeight="1rem" />
						{:else}
							<ThemedButton icon="keyboard_double_arrow_down" on:click={loadMoreComments}>
								Load more
							</ThemedButton>
						{/if}
					</div>
				{/if}
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

		.postDetailLayouter__loadMore {
			display: flex;
			justify-content: center;
		}
	}
</style>
