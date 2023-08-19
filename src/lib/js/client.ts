import { browser } from "$app/environment";
import { invalidateAll } from "$app/navigation";
import { error } from "@sveltejs/kit";
import { LemmyHttp, type GetSiteResponse, type ListCommunitiesResponse, type GetCommunityResponse, type GetCommentsResponse, type GetPostsResponse, type GetPostResponse, type LoginResponse, type PostResponse, type CommentResponse, type SearchResponse } from "lemmy-js-client";
import moment from "moment-timezone";
import { TimeoutError, timeout } from 'promise-timeout';

class ApiClient {
    constructor(private innerClient: LemmyHttp) { }

    private async wrapForApiTimeouts<T>(callerDescription: string, promise: Promise<T>): Promise<T> {
        // Server-side rendering is on a tight deadline. For client-side rendering we can wait
        // however long we want as long as it still makes sense.
        const maxDelay = browser ? 20 * 1000 : 8 * 1000;

        return timeout(promise, maxDelay).catch((err) => {
            console.error(`Error in ${callerDescription}`);
            if (err instanceof TimeoutError) {
                throw error(504, 'Server request timed out');
            } else {
                throw err;
            }
        })
    }

    async acquireJwt(usernameOrEmail: string, password: string): Promise<string> {
        const response = await this.wrapForApiTimeouts('acquireJwt', this.innerClient.login({
            username_or_email: usernameOrEmail,
            password,
        }));
        if (!response.jwt) throw 'token_missing';
        invalidateAll();
        return response.jwt;
    }

    listTopCommunities(): Promise<ListCommunitiesResponse> {
        return this.wrapForApiTimeouts('listTopCommunities', this.innerClient
            .listCommunities({
                type_: 'Local',
                sort: 'TopDay'
            }));
    }

    getSite(jwt?: string): Promise<GetSiteResponse> {
        return this.wrapForApiTimeouts('getSite', this.innerClient.getSite({
            auth: jwt,
        }));
    }

    getCommunity(communityName: string, jwt?: string): Promise<GetCommunityResponse> {
        return this.wrapForApiTimeouts('getCommunity', this.innerClient.getCommunity({
            auth: jwt,
            name: communityName,
        }));
    }

    getPosts(communityName: string | undefined, pageIdNum: number, jwt?: string): Promise<GetPostsResponse> {
        return this.wrapForApiTimeouts('getPosts', this.innerClient.getPosts({
            auth: jwt,
            page: pageIdNum,
            limit: POST_PAGE_SIZE,
            community_name: communityName,
        }));
    }

    getPost(post_id: number, jwt?: string): Promise<GetPostResponse> {
        return this.wrapForApiTimeouts('getPost', this.innerClient.getPost({
            auth: jwt,
            id: post_id,
        }));
    }

    voteOnPost(postId: number, score: 1 | 0 | -1, jwt: string): Promise<PostResponse> {
        return this.wrapForApiTimeouts('voteOnPost', this.innerClient.likePost({
            auth: jwt,
            post_id: postId,
            score,
        }));
    }

    voteOnComment(commentId: number, score: 1 | 0 | -1, jwt: string): Promise<CommentResponse> {
        return this.wrapForApiTimeouts('voteOnComment', this.innerClient.likeComment({
            auth: jwt,
            comment_id: commentId,
            score,
        }));
    }

    getComment(params: { commentId: number, jwt?: string }): Promise<CommentResponse> {
        return this.wrapForApiTimeouts('getComment', this.innerClient.getComment({
            id: params.commentId,
            auth: params.jwt,
        }));
    }

    getComments(postId?: number, parentCommentId?: number, jwt?: string, page?: number): Promise<GetCommentsResponse> {
        return this.wrapForApiTimeouts('getComments', this.innerClient.getComments({
            auth: jwt,
            post_id: postId,
            parent_id: parentCommentId,
            limit: 50,
            sort: 'Hot',
            type_: 'All',
            page,
        }));
    }

    postComment(params: { postId: number, parentId?: number, content: string, jwt: string }): Promise<CommentResponse> {
        return this.wrapForApiTimeouts('postComment', this.innerClient.createComment({
            post_id: params.postId,
            parent_id: params.parentId,
            content: params.content,
            auth: params.jwt,
        }));
    }

    editComment(params: { commentId: number, content: string, jwt: string }): Promise<CommentResponse> {
        return this.wrapForApiTimeouts('editComment', this.innerClient.editComment({
            comment_id: params.commentId,
            content: params.content,
            auth: params.jwt,
        }))
    }

    deleteComment(params: {
        commentId: number,
        jwt: string,
    }): Promise<CommentResponse> {
        return this.wrapForApiTimeouts('deleteComment', this.innerClient.deleteComment({
            comment_id: params.commentId,
            deleted: true,
            auth: params.jwt,
        }));
    }

    search(params: { query: string, jwt?: string }): Promise<SearchResponse> {
        return this.wrapForApiTimeouts('searchCommunities', this.innerClient.search({
            q: params.query,
            auth: params.jwt,
        }));
    }

    getSubscribedPosts(params: { pageId: number, jwt: string }) {
        return this.wrapForApiTimeouts('getSubscribedPosts', this.innerClient.getPosts({
            page: params.pageId,
            auth: params.jwt,
            type_: 'Subscribed',
        }));
    }

    setSubscriptionStatus(params: { communityId: number, status: boolean, jwt: string }) {
        return this.wrapForApiTimeouts('updateSubscriptionStatus', this.innerClient.followCommunity({
            community_id: params.communityId,
            follow: params.status,
            auth: params.jwt,
        }));
    }

    getUnreadCount(params: { jwt: string }) {
        return this.wrapForApiTimeouts('getUnreadCount', this.innerClient.getUnreadCount({
            auth: params.jwt,
        }))
    }

    getReplies(params: { jwt: string }) {
        return this.wrapForApiTimeouts('getReplies', this.innerClient.getReplies({
            unread_only: false,
            auth: params.jwt,
        }));
    }

    setCommentReadStatus(params: { commentReplyId: number, readStatus: boolean, jwt: string }) {
        return this.wrapForApiTimeouts('setCommentReadStatus', this.innerClient.markCommentReplyAsRead({
            comment_reply_id: params.commentReplyId,
            auth: params.jwt,
            read: params.readStatus,
        }));
    }
}

export function getClient(): ApiClient {
    const hostname = import.meta.env.VITE_INSTANCE_HOSTNAME;
    let baseUrl = `https://${hostname}`;
    let client: LemmyHttp = new LemmyHttp(baseUrl);
    return new ApiClient(client);
}

export function formatRelativeUtcTime(raw_timestamp: string): string {
    return moment.tz(raw_timestamp, "UTC").fromNow();
}

export const POST_PAGE_SIZE = 10;