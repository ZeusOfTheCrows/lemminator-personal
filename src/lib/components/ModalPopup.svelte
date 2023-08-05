<script lang="ts">
	import { onMount } from 'svelte';

	export let minWidth: string | undefined = undefined;
	export let width: string | undefined = undefined;
	let dialogElement: HTMLDialogElement;

	onMount(() => {
		dialogElement.showModal();
	});
</script>

<dialog class="modalPopup" bind:this={dialogElement} style:minWidth style:width><slot /></dialog>

<style lang="scss">
	@use '$lib/css/colors';

	.modalPopup {
		position: fixed;
		border-radius: 10px;
		overflow: hidden;
		padding: 0;
		max-width: 90%;
		animation: dim 0.05s ease-in forwards, fade 0.05s ease-in forwards;

		@include colors.themify() {
			border: solid 1px colors.themed('subtleBorder');
		}

		@include colors.defineModalDim;

		@keyframes fade {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
	}
</style>
