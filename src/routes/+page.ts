import type { PageLoad } from "./$types";
import { loadPostListPage } from "$lib/reusablePages/postList/page";

export const load = (async ({ parent }) => {
    const { jwt } = await parent();
    return loadPostListPage(undefined, '1', jwt);
}) satisfies PageLoad;