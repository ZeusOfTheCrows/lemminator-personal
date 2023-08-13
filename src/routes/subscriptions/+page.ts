import type { PageLoad } from "./$types";
import { loadSubscriptionPostListPage } from "$lib/reusablePages/postList/subscriptionPostListPage";

export const load = (async ({ parent }) => {
    const { jwt } = await parent();
    return loadSubscriptionPostListPage('1', jwt);
}) satisfies PageLoad;