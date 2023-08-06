import type { PageLoad } from "./$types";
import { loadPostListPage } from "$lib/reusablePages/postList/page";

export const load = (async ({ parent, params }) => {
    const { jwt } = await parent();
    return loadPostListPage(params.communityName, '1', jwt);
}) satisfies PageLoad;