<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	let dispatch = createEventDispatcher();

	export let minWidth: string | undefined = undefined;
	export let width: string | undefined = undefined;
	let dialogElement: HTMLDialogElement;
	let firstClick = true;

	function handleClick(event: MouseEvent) {
		if (firstClick) {
			firstClick = false;
			return;
		}

		const { left, top, width, height } = dialogElement.getBoundingClientRect();
		const clickX = event.clientX;
		const clickY = event.clientY;
		if (!(clickX >= left && clickX <= left + width && clickY >= top && clickY <= top + height)) {
			dispatch('dismiss');
		}
	}

	function handleKeyUp(keyEvent: KeyboardEvent) {
		if (keyEvent.key == 'Escape') {
			dispatch('dismiss');
		}
	}

	onMount(() => {
		dialogElement.showModal();
	});
</script>

<svelte:body on:click={handleClick} on:keyup={handleKeyUp} />

<dialog class="modalPopup" bind:this={dialogElement} style:minWidth style:width>
	<slot />
</dialog>

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
