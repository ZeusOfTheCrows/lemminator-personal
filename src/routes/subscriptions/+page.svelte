<script lang="ts">
	import type { PageData } from './$types';
	import SubscriptionPostListPage from '$lib/reusablePages/postList/SubscriptionPostListPage.svelte';

	export let data: PageData;
</script>

<SubscriptionPostListPage postsResponse={data.postsResponse} pageId={data.pageId} />
