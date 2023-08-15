<script lang="ts">
	import Hint from './Hint.svelte';

	export let hostname: string;
</script>

<div class="federationHint">
	<Hint>
		<span class="material-icons">link</span>
		<div>
			External community from
			<strong class="federationHint__hostname">{hostname}</strong>
		</div>
	</Hint>
</div>

<style lang="scss">
	@use '$lib/css/colors';
	@use 'material-icons/iconfont/filled.css';

	.federationHint {
		.federationHint__hostname {
			font-weight: bold;
		}
	}
</style>
