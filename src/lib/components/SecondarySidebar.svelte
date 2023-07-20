<script>
	import snarkdown from 'snarkdown';
	import { getClient } from '$lib/js/client';
	import ElevatedBox from './ElevatedBox.svelte';

	let client = getClient();
	let site = client.getSite();
</script>

<div class="secondaryNavigation">
	{#await site}
		…
	{:then site}
		{#if site.site_view.site.description}
			<ElevatedBox title={`About ${site.site_view.site.name}`} stacking="vertical">
				<p class="secondaryNavigation__runningText">
					{@html snarkdown(site.site_view.site.description)}
				</p>
			</ElevatedBox>
		{/if}
	{/await}
</div>

<style lang="scss">
	.secondaryNavigation {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.secondaryNavigation__runningText {
			padding: 1rem;
			font-size: 0.9rem;
			line-height: 1.1rem;
		}
	}
</style>
