<script lang="ts">
	import { keynav } from '$lib/js/globals';

	export let uniqueId: string;
	export let type: 'text' | 'password';
	export let label: string;
	export let placeholder: string = '';
	export let value: string;

	let inputElement: HTMLInputElement;
	export function focus() {
		inputElement.focus();
	}
</script>

<div class="inputField">
	<label for={uniqueId}>{label}</label>
	{#if type === 'text'}
		<input
			type="text"
			id={uniqueId}
			name={uniqueId}
			bind:value
			bind:this={inputElement}
			{placeholder}
			on:focus={() => ($keynav.mode = 'typing')}
			on:blur={() => ($keynav.mode = 'normal')}
		/>
	{:else if type === 'password'}
		<input
			type="password"
			id={uniqueId}
			name={uniqueId}
			bind:value
			bind:this={inputElement}
			{placeholder}
			on:focus={() => ($keynav.mode = 'typing')}
			on:blur={() => ($keynav.mode = 'normal')}
		/>
	{/if}
</div>

<style lang="scss">
	@use '$lib/css/colors';

	.inputField {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 0.5rem;

		label {
			text-align: right;
			font-size: 0.8rem;
		}

		input {
			padding: 0.8rem 0.75rem;
			border-radius: 5px;
			font-size: 0.9rem;
			margin: 0 2px; // Offset outline

			@include colors.themify() {
				border: solid 1px rgba(colors.themed('themedShadow'), 0.3);
				outline: solid 2px colors.themed('color1');

				&:focus-within {
					border: solid 1px rgba(colors.themed('themedShadow'), 0.4);
				}
			}
		}
	}
</style>
