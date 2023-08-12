<script lang="ts">
	export let hostname: string;
</script>

<div class="federationHint">
	<span class="material-icons">link</span>
	<div>
		External community from
		<strong class="federationHint__hostname">{hostname}</strong>
	</div>
</div>

<style lang="scss">
	@use '$lib/css/colors';
	@use 'material-icons/iconfont/filled.css';

	.federationHint {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		border-radius: 10px;
		padding: 0.7rem;

		@include colors.themify() {
			background: colors.themed('color2');
		}

		.federationHint__hostname {
			font-weight: bold;
		}
	}
</style>
