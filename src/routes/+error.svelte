<script lang="ts">
	import { page } from '$app/stores';
	import TitledGraphic from '$lib/components/TitledGraphic.svelte';
	import PageHolder from '$lib/components/PageHolder.svelte';
</script>

<svelte:head>
	<title>Oh snap</title>
</svelte:head>

<PageHolder>
	<svelte:fragment slot="main">
		<TitledGraphic
			title={$page?.error?.message ?? 'Error occurred'}
			subtitle="Sorry for the inconvenience."
			icon="error"
		/>
	</svelte:fragment>
</PageHolder>
