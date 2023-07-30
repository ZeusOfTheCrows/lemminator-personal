import type { PageLoad } from "./$types";
import { loadCommunityPage as loadPostListPage } from "$lib/reusablePages/postList/page";

export const load = (({ }) => {
    return loadPostListPage(undefined, '1');
}) satisfies PageLoad;