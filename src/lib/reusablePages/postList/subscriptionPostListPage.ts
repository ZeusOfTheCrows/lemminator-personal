import { getClient } from "$lib/js/client";
import { error } from "@sveltejs/kit";
import type { GetPostsResponse } from "lemmy-js-client";

export interface LoadCommunityData {
    pageId: number,
    postsResponse?: Promise<GetPostsResponse>,
}

export const loadSubscriptionPostListPage = (pageId: string, jwt?: string): LoadCommunityData => {
    const client = getClient();

    const pageIdNum = parseInt(pageId);
    if (isNaN(pageIdNum)) throw error(400, 'Invalid ID');

    const result: LoadCommunityData = {
        pageId: pageIdNum,
    }

    if (jwt) {
        result.postsResponse = client.getSubscribedPosts({ pageId: pageIdNum, jwt });
        return result;
    }

    return result;
};