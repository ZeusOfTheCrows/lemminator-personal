import { getClient } from "$lib/js/client";
import type { GetRepliesResponse } from "lemmy-js-client";
import type { PageLoad } from "./$types";

export const load = (async ({ parent }) => {
    const { jwt } = await parent();

    const client = getClient();
    const result: {
        unreadsResponse?: Promise<GetRepliesResponse>,
        archiveResponse?: Promise<GetRepliesResponse>,
    } = {};
    if (jwt) {
        result.unreadsResponse = client.getReplies({ unreadOnly: true, jwt });
        result.archiveResponse = client.getReplies({ unreadOnly: false, jwt });
    }

    return result;
}) satisfies PageLoad;