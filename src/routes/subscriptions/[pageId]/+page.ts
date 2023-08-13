import type { PageLoad } from "./$types";
import { loadSubscriptionPostListPage } from "$lib/reusablePages/postList/subscriptionPostListPage";

export const load = (async ({ parent, params }) => {
    const { jwt } = await parent();
    return loadSubscriptionPostListPage(params.pageId, jwt);
}) satisfies PageLoad;