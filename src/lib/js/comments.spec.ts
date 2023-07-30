import { describe, expect, it } from "vitest";
import { getCommentTree } from "./comments";

describe('getCommentTree', () => {
    it('gets a simple comment tree', async () => {
        // We've muted type checking for the input parameter because the types
        // don't fully align with the behavior of the API library
        expect(getCommentTree({
            comments: [
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
            ],
        } as any)).toEqual({
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
});