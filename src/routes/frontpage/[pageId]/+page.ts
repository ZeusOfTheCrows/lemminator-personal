import type { PageLoad } from "./$types";
import { loadCommunityPage as loadPostListPage } from "$lib/reusablePages/postList/page";

export const load = (({ params }) => {
    return loadPostListPage(undefined, params.pageId);
}) satisfies PageLoad;