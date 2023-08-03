import { describe, expect, it } from "vitest";
import { getCommentTree, mergeCommentLists } from "./comments";
import type { Comment, CommentView } from "lemmy-js-client";

function fabricateCommentView(overrides: Partial<Comment>, numChildren: number): CommentView {
    return {
        comment: {
            id: 2155471,
            creator_id: 629088,
            post_id: 2655263,
            content: "Content",
            removed: false,
            published: "2023-08-01T19:43:36.102876",
            deleted: false,
            ap_id: "https://",
            local: true,
            path: "0.2155471",
            distinguished: false,
            language_id: 0,
            ...overrides,
        },
        creator: {
            id: 629088,
            name: "azimir",
            banned: false,
            published: "2023-06-02T02:17:21.163220",
            actor_id: "https://",
            local: true,
            deleted: false,
            admin: false,
            bot_account: false,
            instance_id: 394,
            inbox_url: "http://"
        },
        post: {
            id: 2655263,
            name: "Name",
            body: "Body",
            creator_id: 697272,
            community_id: 8,
            removed: false,
            locked: false,
            published: "2023-08-01T03:50:13.943367",
            updated: "2023-08-01T03:51:09.182302",
            deleted: false,
            nsfw: false,
            ap_id: "https://feddit.cl/post/214176",
            local: false,
            language_id: 0,
            featured_community: false,
            featured_local: false,
        },
        community: {
            id: 8,
            name: "asklemmy",
            title: "Asklemmy",
            description: "Foo Bar",
            removed: false,
            published: "2019-04-25T04:58:33.886275",
            updated: "2023-07-27T08:58:41.602101",
            deleted: false,
            nsfw: false,
            actor_id: "https://",
            local: true,
            icon: "https://",
            banner: "https://",
            hidden: false,
            posting_restricted_to_mods: false,
            instance_id: 394,
            followers_url: "https://",
            inbox_url: "https://"
        },
        counts: {
            id: 1902259,
            comment_id: 2155471,
            score: 1,
            upvotes: 1,
            downvotes: 0,
            published: "2023-08-01T19:43:36.102876",
            child_count: numChildren,
            hot_rank: 1728,
        },
        creator_banned_from_community: false,
        subscribed: "NotSubscribed",
        saved: false,
        creator_blocked: false,
    };
}

describe('getCommentTree', () => {
    it('gets a simple comment tree', async () => {
        // We've muted type checking for the input parameter because the types
        // don't fully align with the behavior of the API library
        expect(getCommentTree(
            [
                {
                    comment: {
                        id: 2123787,
                        creator_id: 2218030,
                        post_id: 2620154,
                        content: "This is a response",
                        removed: false,
                        published: "2023-07-30T18:37:19.967750",
                        deleted: false,
                        ap_id: "https://lemm.ee/comment/1689750",
                        local: false,
                        path: "0.2123755.2123787",
                        distinguished: false,
                        language_id: 0,
                    },
                    creator: {
                        id: 2218030,
                        name: "username1",
                        banned: false,
                        published: "2023-07-30T16:23:54.316122",
                        actor_id: "https://lemm.ee/u/username1",
                        local: false,
                        deleted: false,
                        admin: false,
                        bot_account: false,
                        instance_id: 137189,
                    },
                    post: {
                        id: 2620154,
                        name: "Is this a question?",
                        body: "Question text",
                        creator_id: 2218030,
                        community_id: 13,
                        removed: false,
                        locked: false,
                        published: "2023-07-30T18:30:08.724729",
                        deleted: false,
                        nsfw: false,
                        ap_id: "https://lemm.ee/post/2484944",
                        local: false,
                        language_id: 37,
                        featured_community: false,
                        featured_local: false,
                    },
                    community: {
                        id: 13,
                        name: "lemmy_support",
                        title: "Lemmy Support",
                        description: "Support / questions about Lemmy.\n\n[Matrix Space: #lemmy-space](https://matrix.to/#/#lemmy-space:matrix.org)",
                        removed: false,
                        published: "2019-04-25T16:53:06.109704",
                        updated: "2023-06-14T21:24:21.959740",
                        deleted: false,
                        nsfw: false,
                        actor_id: "https://lemmy.ml/c/lemmy_support",
                        local: true,
                        hidden: false,
                        posting_restricted_to_mods: false,
                        instance_id: 394,
                    },
                    counts: {
                        id: 1873595,
                        comment_id: 2123787,
                        score: 1,
                        upvotes: 1,
                        downvotes: 0,
                        published: "2023-07-30T18:37:19.967750",
                        child_count: 0,
                        hot_rank: 1541,
                    },
                    creator_banned_from_community: false,
                    subscribed: "NotSubscribed",
                    saved: false,
                    creator_blocked: false,
                },
                {
                    comment: {
                        id: 2123755,
                        creator_id: 1757963,
                        post_id: 2620154,
                        content: "Top-level response",
                        removed: false,
                        published: "2023-07-30T18:34:58.718070",
                        deleted: false,
                        ap_id: "https://lemmy.goblackcat.com/comment/145677",
                        local: false,
                        path: "0.2123755",
                        distinguished: false,
                        language_id: 37,
                    },
                    creator: {
                        id: 1757963,
                        name: "username2",
                        display_name: "username2",
                        avatar: "https://lemmy.goblackcat.com/pictrs/image/",
                        banned: false,
                        published: "2023-07-16T22:35:52.290761",
                        actor_id: "https://lemmy.goblackcat.com/u/username2",
                        bio: "Hello yes this is bio",
                        local: false,
                        banner: "https://lemmy.goblackcat.com/pictrs/image/",
                        deleted: false,
                        admin: false,
                        bot_account: false,
                        instance_id: 139559,
                    },
                    post: {
                        id: 2620154,
                        name: "Is this a question?",
                        body: "Question text",
                        creator_id: 2218030,
                        community_id: 13,
                        removed: false,
                        locked: false,
                        published: "2023-07-30T18:30:08.724729",
                        deleted: false,
                        nsfw: false,
                        ap_id: "https://lemm.ee/post/2484944",
                        local: false,
                        language_id: 37,
                        featured_community: false,
                        featured_local: false,
                    },
                    community: {
                        id: 13,
                        name: "lemmy_support",
                        title: "Lemmy Support",
                        description: "Support / questions about Lemmy.\n\n[Matrix Space: #lemmy-space](https://matrix.to/#/#lemmy-space:matrix.org)",
                        removed: false,
                        published: "2019-04-25T16:53:06.109704",
                        updated: "2023-06-14T21:24:21.959740",
                        deleted: false,
                        nsfw: false,
                        actor_id: "https://lemmy.ml/c/lemmy_support",
                        local: true,
                        hidden: false,
                        posting_restricted_to_mods: false,
                        instance_id: 394,
                    },
                    counts: {
                        id: 1873565,
                        comment_id: 2123755,
                        score: 6,
                        upvotes: 6,
                        downvotes: 0,
                        published: "2023-07-30T18:34:58.718070",
                        child_count: 1,
                        hot_rank: 0,
                    },
                    creator_banned_from_community: false,
                    subscribed: "NotSubscribed",
                    saved: false,
                    creator_blocked: false,
                },
            ] as any)).toEqual({
                topNodes: [
                    {
                        leaf: {
                            comment: {
                                id: 2123755,
                                creator_id: 1757963,
                                post_id: 2620154,
                                content: "Top-level response",
                                removed: false,
                                published: "2023-07-30T18:34:58.718070",
                                deleted: false,
                                ap_id: "https://lemmy.goblackcat.com/comment/145677",
                                local: false,
                                path: "0.2123755",
                                distinguished: false,
                                language_id: 37,
                            },
                            creator: {
                                id: 1757963,
                                name: "username2",
                                display_name: "username2",
                                avatar: "https://lemmy.goblackcat.com/pictrs/image/",
                                banned: false,
                                published: "2023-07-16T22:35:52.290761",
                                actor_id: "https://lemmy.goblackcat.com/u/username2",
                                bio: "Hello yes this is bio",
                                local: false,
                                banner: "https://lemmy.goblackcat.com/pictrs/image/",
                                deleted: false,
                                admin: false,
                                bot_account: false,
                                instance_id: 139559,
                            },
                            post: {
                                id: 2620154,
                                name: "Is this a question?",
                                body: "Question text",
                                creator_id: 2218030,
                                community_id: 13,
                                removed: false,
                                locked: false,
                                published: "2023-07-30T18:30:08.724729",
                                deleted: false,
                                nsfw: false,
                                ap_id: "https://lemm.ee/post/2484944",
                                local: false,
                                language_id: 37,
                                featured_community: false,
                                featured_local: false,
                            },
                            community: {
                                id: 13,
                                name: "lemmy_support",
                                title: "Lemmy Support",
                                description: "Support / questions about Lemmy.\n\n[Matrix Space: #lemmy-space](https://matrix.to/#/#lemmy-space:matrix.org)",
                                removed: false,
                                published: "2019-04-25T16:53:06.109704",
                                updated: "2023-06-14T21:24:21.959740",
                                deleted: false,
                                nsfw: false,
                                actor_id: "https://lemmy.ml/c/lemmy_support",
                                local: true,
                                hidden: false,
                                posting_restricted_to_mods: false,
                                instance_id: 394,
                            },
                            counts: {
                                id: 1873565,
                                comment_id: 2123755,
                                score: 6,
                                upvotes: 6,
                                downvotes: 0,
                                published: "2023-07-30T18:34:58.718070",
                                child_count: 1,
                                hot_rank: 0,
                            },
                            creator_banned_from_community: false,
                            subscribed: "NotSubscribed",
                            saved: false,
                            creator_blocked: false,
                        },
                        children: [
                            {
                                leaf: {
                                    comment: {
                                        id: 2123787,
                                        creator_id: 2218030,
                                        post_id: 2620154,
                                        content: "This is a response",
                                        removed: false,
                                        published: "2023-07-30T18:37:19.967750",
                                        deleted: false,
                                        ap_id: "https://lemm.ee/comment/1689750",
                                        local: false,
                                        path: "0.2123755.2123787",
                                        distinguished: false,
                                        language_id: 0,
                                    },
                                    creator: {
                                        id: 2218030,
                                        name: "username1",
                                        banned: false,
                                        published: "2023-07-30T16:23:54.316122",
                                        actor_id: "https://lemm.ee/u/username1",
                                        local: false,
                                        deleted: false,
                                        admin: false,
                                        bot_account: false,
                                        instance_id: 137189,
                                    },
                                    post: {
                                        id: 2620154,
                                        name: "Is this a question?",
                                        body: "Question text",
                                        creator_id: 2218030,
                                        community_id: 13,
                                        removed: false,
                                        locked: false,
                                        published: "2023-07-30T18:30:08.724729",
                                        deleted: false,
                                        nsfw: false,
                                        ap_id: "https://lemm.ee/post/2484944",
                                        local: false,
                                        language_id: 37,
                                        featured_community: false,
                                        featured_local: false,
                                    },
                                    community: {
                                        id: 13,
                                        name: "lemmy_support",
                                        title: "Lemmy Support",
                                        description: "Support / questions about Lemmy.\n\n[Matrix Space: #lemmy-space](https://matrix.to/#/#lemmy-space:matrix.org)",
                                        removed: false,
                                        published: "2019-04-25T16:53:06.109704",
                                        updated: "2023-06-14T21:24:21.959740",
                                        deleted: false,
                                        nsfw: false,
                                        actor_id: "https://lemmy.ml/c/lemmy_support",
                                        local: true,
                                        hidden: false,
                                        posting_restricted_to_mods: false,
                                        instance_id: 394,
                                    },
                                    counts: {
                                        id: 1873595,
                                        comment_id: 2123787,
                                        score: 1,
                                        upvotes: 1,
                                        downvotes: 0,
                                        published: "2023-07-30T18:37:19.967750",
                                        child_count: 0,
                                        hot_rank: 1541,
                                    },
                                    creator_banned_from_community: false,
                                    subscribed: "NotSubscribed",
                                    saved: false,
                                    creator_blocked: false,
                                },
                                children: [
                                ],
                                fullPath: [2123755, 2123787],
                            },
                        ],
                        fullPath: [2123755],
                    },
                ],
                flattenedTree: [
                    {
                        comment: {
                            id: 2123755,
                            creator_id: 1757963,
                            post_id: 2620154,
                            content: "Top-level response",
                            removed: false,
                            published: "2023-07-30T18:34:58.718070",
                            deleted: false,
                            ap_id: "https://lemmy.goblackcat.com/comment/145677",
                            local: false,
                            path: "0.2123755",
                            distinguished: false,
                            language_id: 37,
                        },
                        creator: {
                            id: 1757963,
                            name: "username2",
                            display_name: "username2",
                            avatar: "https://lemmy.goblackcat.com/pictrs/image/",
                            banned: false,
                            published: "2023-07-16T22:35:52.290761",
                            actor_id: "https://lemmy.goblackcat.com/u/username2",
                            bio: "Hello yes this is bio",
                            local: false,
                            banner: "https://lemmy.goblackcat.com/pictrs/image/",
                            deleted: false,
                            admin: false,
                            bot_account: false,
                            instance_id: 139559,
                        },
                        post: {
                            id: 2620154,
                            name: "Is this a question?",
                            body: "Question text",
                            creator_id: 2218030,
                            community_id: 13,
                            removed: false,
                            locked: false,
                            published: "2023-07-30T18:30:08.724729",
                            deleted: false,
                            nsfw: false,
                            ap_id: "https://lemm.ee/post/2484944",
                            local: false,
                            language_id: 37,
                            featured_community: false,
                            featured_local: false,
                        },
                        community: {
                            id: 13,
                            name: "lemmy_support",
                            title: "Lemmy Support",
                            description: "Support / questions about Lemmy.\n\n[Matrix Space: #lemmy-space](https://matrix.to/#/#lemmy-space:matrix.org)",
                            removed: false,
                            published: "2019-04-25T16:53:06.109704",
                            updated: "2023-06-14T21:24:21.959740",
                            deleted: false,
                            nsfw: false,
                            actor_id: "https://lemmy.ml/c/lemmy_support",
                            local: true,
                            hidden: false,
                            posting_restricted_to_mods: false,
                            instance_id: 394,
                        },
                        counts: {
                            id: 1873565,
                            comment_id: 2123755,
                            score: 6,
                            upvotes: 6,
                            downvotes: 0,
                            published: "2023-07-30T18:34:58.718070",
                            child_count: 1,
                            hot_rank: 0,
                        },
                        creator_banned_from_community: false,
                        subscribed: "NotSubscribed",
                        saved: false,
                        creator_blocked: false,
                    },
                    {
                        comment: {
                            id: 2123787,
                            creator_id: 2218030,
                            post_id: 2620154,
                            content: "This is a response",
                            removed: false,
                            published: "2023-07-30T18:37:19.967750",
                            deleted: false,
                            ap_id: "https://lemm.ee/comment/1689750",
                            local: false,
                            path: "0.2123755.2123787",
                            distinguished: false,
                            language_id: 0,
                        },
                        creator: {
                            id: 2218030,
                            name: "username1",
                            banned: false,
                            published: "2023-07-30T16:23:54.316122",
                            actor_id: "https://lemm.ee/u/username1",
                            local: false,
                            deleted: false,
                            admin: false,
                            bot_account: false,
                            instance_id: 137189,
                        },
                        post: {
                            id: 2620154,
                            name: "Is this a question?",
                            body: "Question text",
                            creator_id: 2218030,
                            community_id: 13,
                            removed: false,
                            locked: false,
                            published: "2023-07-30T18:30:08.724729",
                            deleted: false,
                            nsfw: false,
                            ap_id: "https://lemm.ee/post/2484944",
                            local: false,
                            language_id: 37,
                            featured_community: false,
                            featured_local: false,
                        },
                        community: {
                            id: 13,
                            name: "lemmy_support",
                            title: "Lemmy Support",
                            description: "Support / questions about Lemmy.\n\n[Matrix Space: #lemmy-space](https://matrix.to/#/#lemmy-space:matrix.org)",
                            removed: false,
                            published: "2019-04-25T16:53:06.109704",
                            updated: "2023-06-14T21:24:21.959740",
                            deleted: false,
                            nsfw: false,
                            actor_id: "https://lemmy.ml/c/lemmy_support",
                            local: true,
                            hidden: false,
                            posting_restricted_to_mods: false,
                            instance_id: 394,
                        },
                        counts: {
                            id: 1873595,
                            comment_id: 2123787,
                            score: 1,
                            upvotes: 1,
                            downvotes: 0,
                            published: "2023-07-30T18:37:19.967750",
                            child_count: 0,
                            hot_rank: 1541,
                        },
                        creator_banned_from_community: false,
                        subscribed: "NotSubscribed",
                        saved: false,
                        creator_blocked: false,
                    },
                ],
            });
    });

    it('parses a fabricated comment tree with omitted comments', () => {
        const comment_123 = fabricateCommentView({
            id: 123,
            path: "0.123",
        }, 2);
        const comment_123_456 = fabricateCommentView({
            id: 456,
            path: "0.123.456",
        }, 0);
        const comment_789 = fabricateCommentView({
            id: 789,
            path: "0.789",
        }, 0);

        expect(getCommentTree([
            comment_123,
            comment_123_456,
            comment_789,
        ])).toEqual({
            topNodes: [
                {
                    leaf: comment_123,
                    children: [{
                        leaf: comment_123_456,
                        children: [],
                        fullPath: [123, 456],
                    }],
                    fullPath: [123],
                },
                {
                    leaf: comment_789,
                    children: [],
                    fullPath: [789],
                },
            ],
            flattenedTree: [
                comment_123,
                comment_123_456,
                comment_789
            ],
        })
    });
});

describe('mergeCommentLists', () => {
    it('removes duplicate entries', () => {
        const comment_12 = fabricateCommentView({
            id: 12,
            path: "0.12",
        }, 2);
        const comment_12_34 = fabricateCommentView({
            id: 34,
            path: "0.12.34",
        }, 0);
        const comment_56 = fabricateCommentView({
            id: 56,
            path: "0.56",
        }, 0);
        const comment_56_78 = fabricateCommentView({
            id: 56,
            path: "0.56.78",
        }, 0);

        expect(mergeCommentLists([
            comment_12,
            comment_12_34,
        ], [
            comment_12_34,
            comment_56,
            comment_56_78,
        ]))
    });
});