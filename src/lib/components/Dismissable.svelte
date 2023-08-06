<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let dismissableElement: HTMLElement;

	let firstClick = true;

	function handleClick(event: MouseEvent) {
		if (firstClick) {
			firstClick = false;
			return;
		}

		const { left, top, width, height } = dismissableElement.getBoundingClientRect();
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
</script>

<svelte:body on:click={handleClick} on:keyup={handleKeyUp} />

<div class="dismissable" bind:this={dismissableElement}>
	<slot />
</div>
