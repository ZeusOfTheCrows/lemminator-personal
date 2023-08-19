<script lang="ts">
	import Hint from './Hint.svelte';

	export let hostname: string;
</script>

<div class="federationHint">
	<Hint icon="link">
		<div>
			External community from
			<strong class="federationHint__hostname">{hostname}</strong>
		</div>
	</Hint>
</div>

<style lang="scss">
	@use '$lib/css/colors';

	.federationHint {
		.federationHint__hostname {
			font-weight: bold;
		}
	}
</style>
