import { getClient } from "$lib/js/client";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { getNormalizedCommunityName } from "$lib/js/navigation";
import type { CommentResponse, GetCommentsResponse } from "lemmy-js-client";

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

    const firstComment = commentsResponse.comments.find(c => c.comment.path.endsWith(`.${commentIdNum}`));
    if (!firstComment || firstComment.post.id !== postIdNum) {
        throw error(404, 'Comment not found');
    }

    const result: {
        commentsResponse: GetCommentsResponse,
        parentCommentResponse?: CommentResponse,
    } = {
        commentsResponse,
    }
    const firstCommentPath = firstComment.comment.path.split('.').map((n) => parseInt(n));
    const parentCommentId = firstCommentPath.at(-2);

    if (parentCommentId) {
        result.parentCommentResponse = await client.getComment({ commentId: parentCommentId });
    }

    return result;
}) satisfies PageLoad;