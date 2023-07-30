import { LemmyHttp } from "lemmy-js-client";
import moment from "moment";

export function getClient() {
    const hostname = import.meta.env.VITE_INSTANCE_HOSTNAME;
    let baseUrl = `https://${hostname}`;
    let client: LemmyHttp = new LemmyHttp(baseUrl);
    return client;
}

export function formatRelativeTime(raw_timestamp: string): string {
    return moment(raw_timestamp).fromNow();
}

export const POST_PAGE_SIZE = 10;