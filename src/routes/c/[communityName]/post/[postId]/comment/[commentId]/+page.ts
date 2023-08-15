import { getClient } from "$lib/js/client";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { getNormalizedCommunityName } from "$lib/js/navigation";

export const load = (async ({ parent, params }) => {
    const { jwt } = await parent();
    const client = getClient();

    const postIdNum = parseInt(params.postId);
    const commentIdNum = parseInt(params.commentId);
    if (isNaN(postIdNum)) throw error(400, 'Invalid post ID');
    if (isNaN(commentIdNum)) throw error(400, 'Invalid comment ID');

    const commentsResponse = await client.getComments(undefined, commentIdNum, jwt).catch(e => {
        if (e.type === 'invalid-json') {
            // We don't always get a clean exception from the Lemmy API library
            // when the comment doesn't exist
            throw error(502, 'Unexpected server response');
        }
        throw e;
    });
    if (commentsResponse.comments[0].post.id !== postIdNum) {
        throw error(404, 'Comment not found');
    }

    return {
        commentsResponse,
    };
}) satisfies PageLoad;