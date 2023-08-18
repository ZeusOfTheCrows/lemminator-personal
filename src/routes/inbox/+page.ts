import { getClient } from "$lib/js/client";
import type { GetRepliesResponse } from "lemmy-js-client";
import type { PageLoad } from "./$types";

export const load = (async ({ parent }) => {
    const { jwt } = await parent();

    const client = getClient();
    const result: {
        repliesResponse?: Promise<GetRepliesResponse>,
    } = {};
    if (jwt) {
        result.repliesResponse = client.getReplies({ jwt });
    }

    return result;
}) satisfies PageLoad;