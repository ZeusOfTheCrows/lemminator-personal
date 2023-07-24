import type { GetSiteResponse } from "lemmy-js-client";
import { readable, writable, type Readable, type Writable } from "svelte/store";
import { getClient } from "./client";

export const keynav: Writable<{
    mode: 'normal';
}> = writable({
    mode: 'normal',
});

const client = getClient();

export const cachedCalls: Readable<{
    siteResponse: Promise<GetSiteResponse>,
}> = readable({
    siteResponse: client.getSite(),
});