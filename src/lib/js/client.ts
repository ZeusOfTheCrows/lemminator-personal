import { invalidateAll } from "$app/navigation";
import { error } from "@sveltejs/kit";
import { LemmyHttp, type GetSiteResponse, type ListCommunitiesResponse, type GetCommunityResponse, type GetCommentsResponse, type GetPostsResponse, type GetPostResponse, type LoginResponse, type PostResponse } from "lemmy-js-client";
import moment from "moment";
import { TimeoutError, timeout } from 'promise-timeout';

class ApiClient {
    constructor(private innerClient: LemmyHttp) { }

    private async wrapForApiTimeouts<T>(promise: Promise<T>): Promise<T> {
        return timeout(promise, 8000).catch((err) => {
            if (err instanceof TimeoutError) {
                throw error(504, 'The servers are too slow right now.')
            } else {
                throw err;
            }
        })
    }

    async acquireJwt(usernameOrEmail: string, password: string): Promise<string> {
        const response = await this.wrapForApiTimeouts(this.innerClient.login({
            username_or_email: usernameOrEmail,
            password,
        }));
        if (!response.jwt) throw 'token_missing';
        invalidateAll();
        return response.jwt;
    }

    listTopCommunities(): Promise<ListCommunitiesResponse> {
        return this.wrapForApiTimeouts(this.innerClient
            .listCommunities({
                type_: 'Local',
                sort: 'TopDay'
            }));
    }

    getSite(jwt?: string): Promise<GetSiteResponse> {
        return this.wrapForApiTimeouts(this.innerClient.getSite({
            auth: jwt,
        }));
    }

    getCommunity(communityName: string, jwt?: string): Promise<GetCommunityResponse> {
        return this.wrapForApiTimeouts(this.innerClient.getCommunity({
            auth: jwt,
            name: communityName,
        }));
    }

    getPosts(communityName: string | undefined, pageIdNum: number, jwt?: string): Promise<GetPostsResponse> {
        return this.wrapForApiTimeouts(this.innerClient.getPosts({
            auth: jwt,
            page: pageIdNum,
            limit: POST_PAGE_SIZE,
            community_name: communityName,
        }));
    }

    getPost(post_id: number, jwt?: string): Promise<GetPostResponse> {
        return this.wrapForApiTimeouts(this.innerClient.getPost({
            auth: jwt,
            id: post_id,
        }));
    }

    voteOnPost(postId: number, score: 1 | 0 | -1, jwt: string): Promise<PostResponse> {
        return this.wrapForApiTimeouts(this.innerClient.likePost({
            auth: jwt,
            post_id: postId,
            score,
        }));
    }

    getComments(postId: number, optional?: { parentCommentId?: number }, jwt?: string): Promise<GetCommentsResponse> {
        return this.wrapForApiTimeouts(this.innerClient.getComments({
            auth: jwt,
            post_id: postId,
            parent_id: optional?.parentCommentId,
            limit: 50,
            sort: 'Hot',
            // Calculation of "Load more" counts depends on comments not being omitted for exceeding a depth limit
            max_depth: 999,
        }));
    }
}

export function getClient(): ApiClient {
    const hostname = import.meta.env.VITE_INSTANCE_HOSTNAME;
    let baseUrl = `https://${hostname}`;
    let client: LemmyHttp = new LemmyHttp(baseUrl);
    return new ApiClient(client);
}

export function formatRelativeTime(raw_timestamp: string): string {
    return moment(raw_timestamp).fromNow();
}

export const POST_PAGE_SIZE = 10;