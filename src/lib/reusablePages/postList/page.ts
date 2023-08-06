import { getClient } from "$lib/js/client";
import { error } from "@sveltejs/kit";
import type { CommunityResponse, GetPostsResponse } from "lemmy-js-client";

export interface LoadCommunityData {
    pageId: number,
    postsResponse: Promise<GetPostsResponse>,
    communityResponse?: Promise<CommunityResponse>,
}

export const loadPostListPage = (communityName: string | undefined, pageId: string, jwt?: string): LoadCommunityData => {
    const client = getClient();

    const pageIdNum = parseInt(pageId);
    if (isNaN(pageIdNum)) throw error(400, 'Invalid ID');

    const result: LoadCommunityData = {
        pageId: pageIdNum,
        postsResponse: client.getPosts(communityName, pageIdNum, jwt).catch(e => {
            if (e.type === 'invalid-json') {
                // We don't always get a clean exception from the Lemmy API library
                // when the post doesn't exist
                throw error(502, 'Invalid upstream response');
            }
            throw e;
        }),
    }

    if (communityName) {
        result.communityResponse = client.getCommunity(communityName, jwt);
    }

    return result;
};