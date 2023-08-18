<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ThemedButton from './ThemedButton.svelte';

	const dispatch = createEventDispatcher();

	export let title: string | null = null;
	export let checked: boolean;
	export let loading: boolean;

	let randomizedName = `checkbox${Math.round(Math.random() * 1_000_000_000)}`;

	$: {
		dispatch('change', checked);
	}
</script>

<div class="checkbox" title={loading ? 'Loading' : title} class:checkbox--loading={loading}>
	<ThemedButton
		disabled={loading}
		on:click={() => {
			if (!loading) {
				checked = !checked;
			}
		}}
	>
		<input
			class="checkbox__input"
			type="checkbox"
			id={randomizedName}
			name={randomizedName}
			bind:checked
			disabled={loading}
		/>
		<label class="checkbox__label" for={randomizedName}>
			<slot />
		</label>
	</ThemedButton>
</div>

<style lang="scss">
	@use '$lib/css/colors';

	.checkbox {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;

		&:not(.checkbox--loading) {
			&,
			.checkbox__input,
			.checkbox__label {
				cursor: pointer;
			}
		}

		&.checkbox--loading {
			&,
			.checkbox__input,
			.checkbox__label {
				cursor: not-allowed;
			}

			animation: pulse 0.5s ease-in alternate infinite;

			@keyframes pulse {
				0% {
					opacity: 0.8;
				}
				100% {
					opacity: 0.2;
				}
			}
		}

		.checkbox__input {
			@include colors.themify() {
				accent-color: colors.themed('themedShadow');
			}
		}

		.checkbox__label {
			font-size: 0.85rem;
		}
	}
</style>
