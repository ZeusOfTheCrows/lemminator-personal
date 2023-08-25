<script lang="ts">
	import { getPostDetailLinkFromCommentView } from '$lib/js/navigation';
	import Hint from './Hint.svelte';
	import type { CommentView } from 'lemmy-js-client';

	import ThemedButton from './ThemedButton.svelte';

	export let citedCommentView: CommentView;
</script>

<Hint>
	<ThemedButton icon="arrow_back" href={getPostDetailLinkFromCommentView(citedCommentView)} />
	<div class="postReference__originalPost">
		<div class="postReference__originalPostPreface">Posted on</div>
		<div class="postReference__originalPostTitle">
			<a href={getPostDetailLinkFromCommentView(citedCommentView)}>
				{citedCommentView.post.name}
			</a>
		</div>
	</div>
</Hint>

<style lang="scss">
	.postReference__originalPost {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;

		.postReference__originalPostPreface {
			font-size: 0.8rem;
		}

		.postReference__originalPostTitle {
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
</style>
