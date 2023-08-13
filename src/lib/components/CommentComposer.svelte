<script lang="ts">
	import { renderEnhancedMarkdown } from '$lib/js/markdown';
	import { createEventDispatcher, onMount } from 'svelte';
	import ThemedButton from './ThemedButton.svelte';
	import { getClient } from '$lib/js/client';
	import { keynav, session } from '$lib/js/globals';
	import LoadingSpinner from './LoadingSpinner.svelte';

	const dispatch = createEventDispatcher();

	export let context:
		| {
				mode: 'addPostReply';
				postId: number;
		  }
		| {
				mode: 'addCommentReply';
				postId: number;
				parentCommentId: number;
		  }
		| {
				mode: 'editComment';
				commentId: number;
				currentContent: string;
		  };
	let comment = '';
	let loading = false;

	onMount(() => {
		if (context.mode === 'editComment') {
			comment = context.currentContent;
		}
	});

	function ensureAuthenticated() {
		if ($session.state === 'unauthenticated') {
			$session = {
				state: 'authenticating',
				jwt: undefined,
				callback: () => {}
			};
		}
	}

	let textAreaElement: HTMLTextAreaElement;

	export function focusCommentField() {
		textAreaElement.focus();
	}

	async function save() {
		if ($session.state === 'authenticated') {
			const client = getClient();
			loading = true;

			if (context.mode === 'editComment') {
				const commentsResponse = await client.editComment({
					commentId: context.commentId,
					content: comment,
					jwt: $session.jwt
				});
				dispatch('commentEdit', commentsResponse.comment_view);
			} else {
				const commentsResponse = await client.postComment({
					postId: context.postId,
					parentId: context.mode === 'addCommentReply' ? context.parentCommentId : undefined,
					content: comment,
					jwt: $session.jwt
				});
				dispatch('commentSubmit', commentsResponse.comment_view);
			}
			loading = false;
			comment = '';
		}
	}

	function cancelSafely() {
		if (
			(context.mode !== 'editComment' && comment) ||
			(context.mode === 'editComment' && comment !== context.currentContent)
		) {
			const confirmation = confirm("You'll lose the comment you were writing. Are you sure?");
			if (!confirmation) return;
		}

		dispatch('dismiss');
	}
</script>

<div class="commentComposer">
	<div class="commentComposer__editor">
		<textarea
			bind:this={textAreaElement}
			bind:value={comment}
			on:click={ensureAuthenticated}
			on:focus={() => ($keynav.mode = 'typing')}
			on:blur={() => ($keynav.mode = 'normal')}
		/>
		{#if comment}
			<div class="commentComposer__preview">
				{@html renderEnhancedMarkdown(comment)}
			</div>
		{/if}
	</div>
	<div class="commentComposer__actions">
		{#if loading}
			<LoadingSpinner minHeight="1rem" />
		{:else}
			<ThemedButton
				icon={context.mode !== 'editComment' ? 'add_comment' : 'edit'}
				appearance="filled"
				on:click={() => save()}
				disabled={comment === ''}
				title={comment === '' ? 'Write your comment first.' : null}
				fontSize="0.85rem"
			>
				{#if context.mode === 'editComment'}
					Update
				{:else}
					Send
				{/if}
			</ThemedButton>
			{#if context.mode !== 'addPostReply'}
				<ThemedButton appearance="filled" on:click={cancelSafely} fontSize="0.85rem">
					Cancel
				</ThemedButton>
			{/if}
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
				background: none;

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
				line-height: 1.1rem;

				@include colors.themify() {
					color: rgba(colors.themed('themedMainText'), 0.4);
				}

				@include markdown.styleExternalContent($allowFontSizeIncreases: false);

				@include breakpoints.mediumAndUp {
					display: block;
				}
			}
		}

		.commentComposer__actions {
			display: flex;
			flex-direction: row;
			gap: 0.5rem;
		}
	}
</style>
