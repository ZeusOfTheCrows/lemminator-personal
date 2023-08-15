<script lang="ts">
	import { page } from '$app/stores';
	import SecondarySidebar from '$lib/components/SecondarySidebar.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
	import type { PageData } from './$types';
	import Hint from '$lib/components/Hint.svelte';
	import { getPostDetailLinkFromCommentView } from '$lib/js/navigation';
	import ThemedButton from '$lib/components/ThemedButton.svelte';
	import type { CommentView } from 'lemmy-js-client';
	import CommentSection from '$lib/components/CommentSection.svelte';
	import Comment from '$lib/components/Comment.svelte';
	import { getCommentTree, type CommentTree } from '$lib/js/comments';

	export let data: PageData;
	let citedCommentView: CommentView;
	let commentTree: CommentTree;
	let parentTree: CommentTree | null = null;
	let showParent: boolean = false;

	$: {
		// People may hop from permalink to permalink. Due to how SvelteKit appears to work,
		// we explicitly have to re-evaluate the state.
		citedCommentView = data.commentsResponse.comments[0];
		commentTree = getCommentTree(data.commentsResponse.comments);

		if (data.parentCommentResponse) {
			parentTree = getCommentTree([data.parentCommentResponse.comment_view]);
			showParent = false;
		} else {
			parentTree = null;
		}
	}
</script>

<svelte:head>
	<title>
		{citedCommentView.post.name} -
		{citedCommentView.community.title}
	</title>
</svelte:head>

<PageHolder>
	<svelte:fragment slot="main">
		<div class="commentDetailPage">
			<Hint>
				<ThemedButton icon="arrow_back" href={getPostDetailLinkFromCommentView(citedCommentView)} />
				<div class="commentDetailPage__originalPost">
					<div class="commentDetailPage__originalPostPreface">Posted on</div>
					<div class="commentDetailPage__originalPostTitle">
						<a href={getPostDetailLinkFromCommentView(citedCommentView)}>
							{citedCommentView.post.name}
						</a>
					</div>
				</div>
			</Hint>
			{#if parentTree && parentTree.topNodes.length}
				{#if showParent}
					<Comment
						node={parentTree.topNodes[0]}
						flattenedTree={parentTree.flattenedTree}
						focusedCommentId={null}
						appearance="standalone"
					/>
				{:else}
					<div class="commentDetailPage__revealParent">
						<ThemedButton icon="arrow_upward" on:click={() => (showParent = true)}>
							Show context
						</ThemedButton>
					</div>
				{/if}
			{/if}
			<CommentSection tree={commentTree} focusedNode={null} />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="secondarySidebar">
		<SecondarySidebar communityName={$page.params.communityName} />
	</svelte:fragment>
</PageHolder>

<style lang="scss">
	.commentDetailPage {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.commentDetailPage__originalPost {
			display: flex;
			flex-direction: column;
			gap: 0.2rem;

			.commentDetailPage__originalPostPreface {
				font-size: 0.8rem;
			}

			.commentDetailPage__originalPostTitle {
				font-weight: bold;
				font-size: 1rem;

				a {
					text-decoration: none;

					&:hover {
						text-decoration: underline;
					}
				}
			}
		}

		.commentDetailPage__revealParent {
			display: flex;
			flex-direction: row;
			justify-content: center;
		}
	}
</style>
