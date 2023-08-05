import { error } from "@sveltejs/kit";
import { LemmyHttp } from "lemmy-js-client";
import moment from "moment";
import { TimeoutError, timeout } from 'promise-timeout';

export function getClient() {
    const hostname = import.meta.env.VITE_INSTANCE_HOSTNAME;
    let baseUrl = `https://${hostname}`;
    let client: LemmyHttp = new LemmyHttp(baseUrl);
    return client;
}

export function formatRelativeTime(raw_timestamp: string): string {
    return moment(raw_timestamp).fromNow();
}

export async function wrapForApiTimeouts<T>(promise: Promise<T>): Promise<T> {
    return await timeout(promise, 8000).catch((err) => {
        if (err instanceof TimeoutError) {
            throw error(504, 'The servers are too slow right now.')
        } else {
            throw err;
        }
    })
}

export async function startSession(usernameOrEmail: string, password: string): Promise<string> {
    const client = getClient();
    const loginResponse = await client.login({
        username_or_email: usernameOrEmail,
        password,
    });
    if (!loginResponse.jwt) throw 'token_missing';
    return loginResponse.jwt;
}

export const POST_PAGE_SIZE = 10;