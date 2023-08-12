<script lang="ts">
	export let contentType: string;
	export let hostname: string;
</script>

<div class="federationHint">
	<div>
		This is a {contentType} from
		<strong class="federationHint__hostname">{hostname}</strong>.
	</div>
</div>

<style lang="scss">
	@use '$lib/css/colors';

	.federationHint {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		border-radius: 10px;
		padding: 1rem;

		@include colors.themify() {
			background: colors.themed('color2');
		}

		.federationHint__hostname {
			font-weight: bold;
		}
	}
</style>
