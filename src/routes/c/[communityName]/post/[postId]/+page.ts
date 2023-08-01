import { getClient } from "$lib/js/client";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (({ params }) => {
    const client = getClient();

    const postIdNum = parseInt(params.postId);
    if (isNaN(postIdNum)) throw error(400, 'Invalid ID');

    return {
        // The implicit page limit appears to be 50. An explicit limit cannot be set.
        postResponse: client.getPost({ id: postIdNum }).then(response => {
            if (response.community_view.community.name !== params.communityName) {
                throw error(404, 'Could not find post');
            }
            return response;
        }).catch(e => {
            if (e === 'couldnt_find_post') {
                throw error(404, 'Could not find post');
            } else if (e.type === 'invalid-json') {
                // We don't always get a clean exception from the Lemmy API library
                // when the post doesn't exist
                throw error(502, 'Invalid upstream response');
            }
            throw e;
        }),
        commentsResponse: client.getComments({ post_id: postIdNum, limit: 50, sort: 'Hot' }).catch((e) => {
            if (e === 'couldnt_get_comments') {
                throw error(502, "Could not fetch comments");
            }
            throw e;
        }),
    };
}) satisfies PageLoad;