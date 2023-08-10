<script lang="ts">
	import { renderEnhancedMarkdown } from '$lib/js/markdown';
	import { createEventDispatcher } from 'svelte';
	import ThemedButton from './ThemedButton.svelte';
	import { getClient } from '$lib/js/client';
	import { session } from '$lib/js/globals';
	import LoadingSpinner from './LoadingSpinner.svelte';

	const dispatch = createEventDispatcher();

	export let postId: number;
	export let parentCommentId: number | null;
	let comment = '';
	let loading = false;

	function ensureAuthenticated() {
		if ($session.state === 'unauthenticated') {
			$session = {
				state: 'authenticating',
				jwt: undefined,
				callback: () => {}
			};
		}
	}

	async function submit() {
		if ($session.state === 'authenticated') {
			const client = getClient();
			loading = true;
			const commentsResponse = await client.postComment({
				postId,
				parentId: parentCommentId ?? undefined,
				content: comment,
				jwt: $session.jwt
			});
			dispatch('commentSubmit', commentsResponse.comment_view);
			loading = false;
			comment = '';
		}
	}
</script>

<div class="commentComposer">
	<div class="commentComposer__editor">
		<textarea bind:value={comment} on:click={ensureAuthenticated} />
		{#if comment}
			<div class="commentComposer__preview">
				{@html renderEnhancedMarkdown(comment)}
			</div>
		{/if}
	</div>
	<div>
		{#if loading}
			<LoadingSpinner minHeight="1rem" />
		{:else}
			<ThemedButton
				icon="add_comment"
				appearance="filled"
				on:click={() => submit()}
				disabled={comment === ''}
				title={comment === '' ? 'Write your comment first.' : null}
				fontSize="0.85rem"
			>
				Submit
			</ThemedButton>
		{/if}
	</div>
</div>

<style lang="scss">
	@use '$lib/css/colors';
	@use '$lib/css/breakpoints';
	@use '$lib/css/markdown';

	.commentComposer {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		.commentComposer__editor {
			display: flex;
			flex-direction: row;
			flex-grow: 1;
			gap: 1rem;

			textarea {
				font-family: 'Roboto';
				border-radius: 5px;
				font-size: 0.85rem;
				margin: 0 2px; // Offset the outline
				padding: 0.5rem;
				flex-basis: 0;
				flex-grow: 1;
				min-height: 4rem;

				@include colors.themify() {
					border: solid 1px rgba(colors.themed('themedShadow'), 0.3);
					outline: solid 2px colors.themed('color1');

					&:focus-within {
						border: solid 1px rgba(colors.themed('themedShadow'), 0.4);
					}
				}
			}

			.commentComposer__preview {
				display: none;
				font-size: 0.85rem;
				flex-basis: 0;
				flex-grow: 1;
				padding: 0.2rem 0;

				@include colors.themify() {
					color: rgba(colors.themed('themedMainText'), 0.4);
				}

				@include markdown.styleExternalContent($allowFontSizeIncreases: false);

				@include breakpoints.mediumAndUp {
					display: block;
				}
			}
		}
	}
</style>
