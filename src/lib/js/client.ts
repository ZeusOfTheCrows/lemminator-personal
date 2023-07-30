import { LemmyHttp } from "lemmy-js-client";
import moment from "moment";

export function getClient() {
    let baseUrl = 'https://lemmy.ml';
    let client: LemmyHttp = new LemmyHttp(baseUrl);
    return client;
}

export function formatRelativeTime(raw_timestamp: string): string {
    return moment(raw_timestamp).fromNow();
}

export const POST_PAGE_SIZE = 10;