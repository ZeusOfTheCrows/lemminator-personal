<script lang="ts">
	let inputElement: HTMLInputElement;
</script>

<div class="searchBox" on:click={() => inputElement.focus()} role="none">
	<label for="search">
		<span class="material-icons">search</span>
	</label>
	<input type="search" name="search" placeholder="Search for posts" bind:this={inputElement} />
</div>

<style lang="scss">
	@use '$lib/css/colors';
	@use 'material-icons/iconfont/filled.css';

	.searchBox {
		padding: 0.3rem;
		font-size: 0.9rem;
		border-radius: 10px;
		border: solid 1px rgba(colors.$maxContrastShadow, 0.3);
		outline: solid 2px colors.$color1;
		background: colors.$maxContrastBgFill;
		display: flex;
		align-items: center;

		input {
			padding: 0.5rem 0.3rem;
			flex-grow: 1;
			border: none;
			outline: none;
		}
	}
</style>
