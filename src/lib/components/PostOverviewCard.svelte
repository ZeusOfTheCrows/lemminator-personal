<script lang="ts">
	import { formatRelativeUtcTime, getClient } from '$lib/js/client';
	import type { PostView } from 'lemmy-js-client';
	import ElevatedBox from './ElevatedBox.svelte';
	import ThemedButton from './ThemedButton.svelte';
	import { renderEnhancedMarkdown } from '$lib/js/markdown';
	import EntityIcon from './EntityIcon.svelte';
	import { getPostDetailLinkFromPostView, getNormalizedCommunityName } from '$lib/js/navigation';
	import { cachedCalls, session } from '$lib/js/globals';
	import { invalidate } from '$app/navigation';
	import UserTag from './UserTag.svelte';
	import { onMount } from 'svelte';

	// null = shimmer
	export let postView: PostView | null;
	export let showCommunity: boolean = true;
	export let active: boolean | null = null;
	export let variant: 'list' | 'detail' = 'list';

	let enableDownvotes = true;
	onMount(async () => {
		const siteResponse = await $cachedCalls.siteResponse;
		enableDownvotes = siteResponse.site_view.local_site.enable_downvotes;
	});

	function isImageLink(link: string | undefined): boolean {
		if (!link) return false;
		return Boolean(link.match(/\.(png|jpe?g|gif|webp)$/));
	}

	async function sendToggledVote(valueToToggle: 1 | -1) {
		if (!postView) return;
		if (!$session.jwt) throw 'Token should have been present';
		const client = getClient();
		const postResponse = await client.voteOnPost(
			postView.post.id,
			postView.my_vote === valueToToggle ? 0 : valueToToggle,
			$session.jwt
		);

		// Update UI and prefetched page
		postView = postResponse.post_view;
		invalidate(`/c/${postView.community.name}/post/${postView.post.id}`);
	}

	async function toggleVote(vote: 1 | -1) {
		if ($session.state === 'unauthenticated') {
			$session = {
				state: 'authenticating',
				jwt: undefined,
				callback: () => sendToggledVote(vote)
			};
		} else if ($session.state === 'authenticated') {
			await sendToggledVote(vote);
		}
	}
</script>

<div
	class="postOverviewCard"
	class:postOverviewCard--active={active == true}
	class:postOverviewCard--inactive={active == false}
>
	<ElevatedBox stacking="horizontal">
		{#if postView}
			<div class="postOverviewCard__main">
				<div class="postOverviewCard__beforeImage">
					<div class="postOverviewCard__metaLine">
						{#if showCommunity}
							<div class="postOverviewCard__community">
								<a href={`/c/${getNormalizedCommunityName(postView.community)}`}>
									{#if postView.community.icon}
										<EntityIcon src={postView.community.icon} alt={postView.community.title} />
									{/if}
									{postView.community.name}
								</a>
							</div>
							&middot;
						{/if}
						<div class="postOverviewCard__user">
							<UserTag person={postView.creator} showAvatar={!showCommunity} />
						</div>
						&middot;
						<div class="postOverviewCard__relativeTime">
							{formatRelativeUtcTime(postView.post.published)}
						</div>
						{#if postView.post.featured_local || postView.post.featured_community}
							&nbsp;
							<span class="postOverviewCard__pinIndicator material-icons" title="Pinned post">
								push_pin
							</span>
						{/if}
					</div>
					<div class="postOverviewCard__name">
						<a href={getPostDetailLinkFromPostView(postView)}>
							{postView.post.name}
						</a>
					</div>
					{#if postView.post.url && !isImageLink(postView.post.url)}
						<div class="postOverviewCard__hostname">
							<a
								class="postOverviewCard__link"
								href={postView.post.url}
								target="_blank"
								title="Open post link"
							>
								<span class="material-icons">launch</span>
								<span class="postOverviewCard__link__hostname">
									{new URL(postView.post.url).hostname.replace(/^www\./, '')}
								</span>
							</a>
						</div>
					{/if}
					{#if postView.post.body && variant === 'detail'}
						<div class="postOverviewCard__textBody">
							{@html renderEnhancedMarkdown(postView.post.body)}
						</div>
					{/if}
				</div>
				{#if isImageLink(postView.post.url)}
					<a class="postOverviewCard__imageLink" href={getPostDetailLinkFromPostView(postView)}>
						<img
							class="postOverviewCard__image"
							class:postOverviewCard__image--list={variant === 'list'}
							class:postOverviewCard__image--detail={variant === 'detail'}
							src={postView.post.url}
							alt={postView.post.name}
						/>
					</a>
				{/if}
				<div class="postOverviewCard__actionLine">
					<ThemedButton
						appearance={postView.my_vote == 1 ? 'default' : 'dimmed'}
						icon="keyboard_arrow_up"
						title="Upvote"
						fontSize="0.875rem"
						toggled={postView.my_vote == 1}
						on:click={() => toggleVote(1)}
					>
						{postView.counts.upvotes}
					</ThemedButton>
					{#if enableDownvotes}
						<ThemedButton
							appearance="dimmed"
							icon="keyboard_arrow_down"
							title="Downvote"
							fontSize="0.875rem"
							toggled={postView.my_vote == -1}
							on:click={() => toggleVote(-1)}
						>
							{postView.counts.downvotes}
						</ThemedButton>
					{/if}
					<ThemedButton
						href={`${getPostDetailLinkFromPostView(postView)}#comments`}
						appearance="dimmed"
						icon={postView.post.locked ? 'lock' : 'comment'}
						title={postView.post.locked ? 'Comment section locked' : 'View comments'}
						fontSize="0.875rem"
					>
						{#if !postView.post.locked}
							{postView.counts.comments}
						{/if}
					</ThemedButton>
				</div>
			</div>
		{:else}
			<div class="postOverviewCard__updown">&nbsp;</div>
			<div class="postOverviewCard__main postOverviewCard__main--shimmer">&nbsp;</div>
		{/if}
	</ElevatedBox>
</div>

<style lang="scss">
	@use '$lib/css/colors';
	@use '$lib/css/markdown';
	@use '$lib/css/breakpoints';
	@use '$lib/css/measurements';
	@use 'material-icons/iconfont/filled.css';

	.postOverviewCard {
		border-radius: 10px;
		transition: opacity 0.1s;
		scroll-margin: calc(measurements.$headerVSize + 1rem); // Top padding of main content
		@include colors.themify() {
			outline: solid 1px rgba(colors.themed('maxContrastOnTheme'), 0.05);
		}

		.postOverviewCard__main {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			width: 100%;

			&.postOverviewCard__main--shimmer {
				animation: shimmer 1.25s infinite ease-in-out;
				@include colors.themify() {
					background-image: linear-gradient(
						to right,
						rgba(colors.themed('themedMainText'), 0) 4%,
						rgba(colors.themed('themedMainText'), 0.1) 25%,
						rgba(colors.themed('themedMainText'), 0) 36%
					);
				}
				background-size: 1000px 100%;
				width: 100%;
				height: 6rem;
				margin: 1rem;

				@keyframes shimmer {
					0% {
						background-position: -400px 0%;
					}
					40% {
						background-position: 600px 0%;
					}
					100% {
						background-position: 600px 0%;
					}
				}
			}
		}

		.postOverviewCard__beforeImage {
			display: flex;
			flex-direction: column;
			gap: 0.3rem;
			padding: 1rem;
			padding-bottom: 0;

			.postOverviewCard__metaLine {
				@include colors.themify() {
					color: colors.themed('deemphColor');
				}
				font-size: 0.75rem;
				display: flex;
				flex-direction: row;
				align-items: center;
				// A little hack to handle tiny screens. The subtraction is a
				// heuristic to avoid having to take all padding/border/margin sizes
				// of parents into account
				max-width: calc(100vw - 6rem);
				overflow: hidden;
				gap: 0.2rem;

				.postOverviewCard__community,
				.postOverviewCard__community > *,
				.postOverviewCard__user {
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: 0.3rem;

					a {
						text-decoration: none;

						&:hover {
							text-decoration: underline;
						}
					}
				}

				.postOverviewCard__community,
				.postOverviewCard__user,
				.postOverviewCard__relativeTime {
					flex-basis: 80px;
					flex-grow: 1;
					flex-shrink: 1;
					max-width: min-content;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}

				.postOverviewCard__pinIndicator {
					font-size: 0.9rem;
				}
			}

			.postOverviewCard__name {
				font-size: 1.2rem;
				font-weight: bold;
				line-height: 1.4rem;

				a {
					text-decoration: none;
				}
			}

			.postOverviewCard__hostname {
				padding: 0.3rem 0;
				.postOverviewCard__link {
					font-weight: normal;
					text-decoration: none;
					padding: 0.3rem 0.5rem;
					border-radius: 5px;

					&,
					.material-icons {
						font-size: 0.8rem;
					}

					@include colors.themify() {
						background: colors.themed('elevatedBoxAccent');
						color: rgba(colors.themed('themedMainText'), 0.6);

						&:hover {
							background: colors.themed('color2');
						}
					}

					> * {
						vertical-align: middle;
					}
				}
			}

			.postOverviewCard__textBody {
				margin-top: 0.5rem;
				line-height: 1.2rem;
				font-size: 0.9rem;

				@include markdown.styleExternalContent($allowFontSizeIncreases: true);
			}
		}

		.postOverviewCard__imageLink {
			margin: 0 1rem;

			.postOverviewCard__image {
				width: 100%;
				max-width: 900px;

				@include colors.themify() {
					border: solid 1px colors.themed('subtleBorder');
				}
				border-radius: 10px;
				object-fit: cover;
				object-position: center;

				&.postOverviewCard__image--list {
					aspect-ratio: 16 / 9;
				}
			}
		}

		.postOverviewCard__actionLine {
			padding: 0.25rem 0.5rem; // Padding is weird to make the button icon line up

			@include colors.themify() {
				color: rgba(colors.themed('maxContrastOnTheme'), 0.8);
				background: rgba(colors.themed('elevatedBoxAccent'), 0.6);
			}

			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 1rem;
		}

		&.postOverviewCard--active {
			@include colors.themify() {
				outline: solid 1px rgba(colors.themed('themedMainText'), 0.2);
			}
		}

		&.postOverviewCard--inactive {
			opacity: 0.5;
		}
	}
</style>
