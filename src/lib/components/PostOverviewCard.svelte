<script lang="ts">
	import { formatRelativeTime } from '$lib/js/client';
	import type { PostView } from 'lemmy-js-client';
	import ElevatedBox from './ElevatedBox.svelte';

	export let postView: PostView;

	function isImageLink(link: string | undefined): boolean {
		if (!link) return false;
		return Boolean(link.match(/\.(png|jpe?g|gif)$/));
	}
</script>

<div class="postOverviewCard">
	<ElevatedBox stacking="horizontal">
		<div class="postOverviewCard__updown">
			<div class="postOverviewCard__up">⮝</div>
			<div class="postOverviewCard__score">{postView.counts.score}</div>
			<div class="postOverviewCard__down">⮟</div>
		</div>
		<div class="postOverviewCard__main">
			<div>
				<div class="postOverviewCard__metaLine">
					<div class="postOverviewCard__community">
						{#if postView.community.icon}
							<img
								src={postView.community.icon}
								alt={postView.community.title}
								class="postOverviewCard__communityIcon"
							/>
						{/if}
						{postView.community.name}
					</div>
					&middot;
					<div class="postOverviewCard__user">
						{postView.creator.name}
					</div>
					&middot;
					<div class="postOverviewCard__relativeTime">
						{formatRelativeTime(postView.post.published)}
					</div>
				</div>
				<div class="postOverviewCard__name">{postView.post.name}</div>
			</div>
			{#if isImageLink(postView.post.url)}
				<img class="postOverviewCard__image" src={postView.post.url} alt={postView.post.name} />
			{/if}
			<ul class="postOverviewCard__actionLine">
				<li>{postView.counts.comments} comments</li>
			</ul>
		</div>
	</ElevatedBox>
</div>

<style lang="scss">
	@use '$lib/css/colors';

	.postOverviewCard {
		background: white;
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 2px 2px 5px colors.$boxShadow;

		.postOverviewCard__updown {
			background: colors.$bgAccent2;
			padding: 1rem;
			display: flex;
			flex-basis: 3.5rem;
			flex-shrink: 0;
			flex-direction: column;
			align-items: center;
			font-size: 1.2rem;

			.postOverviewCard__score {
				font-size: 0.9rem;
			}
		}

		.postOverviewCard__main {
			padding: 1rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		.postOverviewCard__metaLine {
			color: colors.$deemphColor;
			font-size: 0.75rem;
			padding-bottom: 0.3rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.2rem;

			.postOverviewCard__community {
				gap: 0.3rem;
				display: flex;
				flex-direction: row;
				align-items: center;

				.postOverviewCard__communityIcon {
					width: 20px;
					height: 20px;
					border-radius: 100%;
				}
			}
		}

		.postOverviewCard__name {
			font-size: 1.2rem;
			font-weight: bold;
		}

		.postOverviewCard__image {
			max-width: 100%;
			border: solid 1px colors.$subtleBorder;
			border-radius: 10px;
			aspect-ratio: 16 / 9;
			object-fit: cover;
			object-position: center;
		}

		.postOverviewCard__actionLine {
			opacity: 0.8;
			font-size: 0.9rem;
		}
	}
</style>
