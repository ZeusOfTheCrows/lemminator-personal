import { getClient } from "$lib/js/client";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (({ params }) => {
    const client = getClient();

    const postIdNum = parseInt(params.postId)
    if (isNaN(postIdNum)) throw error(400, 'Invalid ID');

    return {
        postResponse: client.getPost({ id: postIdNum }).catch((e) => {
            if (e === 'couldnt_find_post') {
                throw error(404, 'Could not find post');
            } else if (e.type === 'invalid-json') {
                // We don't always get a clean exception from the Lemmy API library
                // when the post doesn't exist
                throw error(502, 'Invalid upstream response');
            }
            throw e;
        }),
    };
}) satisfies PageLoad;