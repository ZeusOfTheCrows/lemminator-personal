<script lang="ts">
	import { formatRelativeTime } from '$lib/js/client';
	import type { PostView } from 'lemmy-js-client';
	import ElevatedBox from './ElevatedBox.svelte';
	import TransparentButton from './TransparentButton.svelte';

	// null = shimmer
	export let postView: PostView | null;
	export let showCommunity: boolean = true;
	export let active: boolean | null = null;

	function isImageLink(link: string | undefined): boolean {
		if (!link) return false;
		return Boolean(link.match(/\.(png|jpe?g|gif)$/));
	}
</script>

<div
	class="postOverviewCard"
	class:postOverviewCard--active={active == true}
	class:postOverviewCard--inactive={active == false}
>
	<ElevatedBox stacking="horizontal">
		{#if postView}
			<div class="postOverviewCard__updown">
				<div class="postOverviewCard__up">
					<TransparentButton appearance="smallRound">
						<span class="material-icons">keyboard_arrow_up</span>
					</TransparentButton>
				</div>
				<div class="postOverviewCard__score">{postView.counts.score}</div>
				<div class="postOverviewCard__down material-icons">
					<TransparentButton appearance="smallRound">
						<span class="material-icons">keyboard_arrow_down</span>
					</TransparentButton>
				</div>
			</div>
			<div class="postOverviewCard__main">
				<div>
					<div class="postOverviewCard__metaLine">
						{#if showCommunity}
							<div class="postOverviewCard__community">
								{#if postView.community.icon}
									<img
										src={postView.community.icon}
										alt={postView.community.title}
										class="postOverviewCard__entityIcon"
									/>
								{/if}
								{postView.community.name}
							</div>
							&middot;
						{/if}
						<div class="postOverviewCard__user">
							{#if !showCommunity && postView.creator.avatar}
								<img
									src={postView.creator.avatar}
									alt="Avatar"
									class="postOverviewCard__entityIcon"
								/>
							{/if}
							{postView.creator.name}
						</div>
						<div class="postOverviewCard__relativeTimePresep">&middot;</div>
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
		{:else}
			<div class="postOverviewCard__updown">&nbsp;</div>
			<div class="postOverviewCard__main postOverviewCard__main--shimmer">&nbsp;</div>
		{/if}
	</ElevatedBox>
</div>

<style lang="scss">
	@use '$lib/css/colors';
	@use '$lib/css/breakpoints';
	@use 'material-icons/iconfont/filled.css';

	.postOverviewCard {
		background: white;
		border-radius: 10px;
		transition: opacity 0.1s;
		scroll-margin: 1rem; // Top padding of main content

		.postOverviewCard__updown {
			background: rgba(colors.$color2, 0.6);
			padding: 0.3rem 0.5rem;
			display: flex;
			flex-basis: 3.5rem;
			gap: 0.5rem;
			flex-shrink: 0;
			flex-direction: column;
			align-items: center;
			font-size: 1.2rem;

			@include breakpoints.mediumAndUp {
				flex-basis: 4rem;
			}

			.postOverviewCard__score {
				font-size: 0.75rem;
			}
		}

		.postOverviewCard__main {
			padding: 1rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;

			&.postOverviewCard__main--shimmer {
				animation: shimmer 2s infinite linear;
				background: linear-gradient(
					to right,
					rgba(colors.$color1, 0.1) 4%,
					colors.$color2 25%,
					rgba(colors.$color1, 0.1) 36%
				);
				background-size: 1000px 100%;
				width: 100%;
				height: 6rem;
				margin: 1rem;

				@keyframes shimmer {
					0% {
						background-position: -1000px 0;
					}
					100% {
						background-position: 1000px 0;
					}
				}
			}
		}

		.postOverviewCard__metaLine {
			color: colors.$deemphColor;
			font-size: 0.75rem;
			padding-bottom: 0.3rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.2rem;

			.postOverviewCard__community,
			.postOverviewCard__user {
				gap: 0.3rem;
				display: flex;
				flex-direction: row;
				align-items: center;
			}

			.postOverviewCard__relativeTimePresep,
			.postOverviewCard__relativeTime {
				display: none;

				@include breakpoints.mediumAndUp {
					display: block;
				}
			}

			.postOverviewCard__entityIcon {
				width: 20px;
				height: 20px;
				border-radius: 100%;
				object-fit: cover;

				// Fallbacks for load failures
				font-size: 0; // We have alt text for screen readers, regular users don't need it
				background: colors.$color1;
			}
		}

		.postOverviewCard__name {
			font-size: 1.2rem;
			font-weight: bold;
			line-height: 1.4rem;
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

		&.postOverviewCard--active {
			outline: solid 1px rgba(colors.$maxContrastShadow, 0.2);
		}

		&.postOverviewCard--inactive {
			opacity: 0.5;
		}
	}
</style>
