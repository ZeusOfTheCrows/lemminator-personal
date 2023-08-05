import { describe, expect, it } from "vitest";
import { getCommentTree, expandCommentsForId } from "./comments";
import type { Comment, CommentView } from "lemmy-js-client";

function fabricateCommentView(overrides: Partial<Comment>, numDescendants: number): CommentView {
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
            child_count: numDescendants,
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
        const comment_view_1 = {
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
        };
        const comment_view_2 = {
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
        };

        // We've muted type checking for the input parameter because the types
        // don't fully align with the behavior of the API library
        expect(getCommentTree(
            [
                comment_view_1,
                comment_view_2,
            ] as any)).toEqual({
                topNodes: [
                    {
                        leaf: comment_view_2,
                        children: [
                            {
                                leaf: comment_view_1,
                                children: [],
                                fullPath: [2123755, 2123787],
                                unloadedChildren: 0,
                            },
                        ],
                        fullPath: [2123755],
                        unloadedChildren: 0,
                    },
                ],
                flattenedTree: [
                    comment_view_2,
                    comment_view_1,
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
                        unloadedChildren: 0,
                    }],
                    fullPath: [123],
                    unloadedChildren: 1,
                },
                {
                    leaf: comment_789,
                    children: [],
                    fullPath: [789],
                    unloadedChildren: 0,
                },
            ],
            flattenedTree: [
                comment_123,
                comment_123_456,
                comment_789
            ],
        })
    });

    it('parses a larger fabricated comment tree with omitted comments', () => {
        const comment_1 = fabricateCommentView({
            id: 1,
            path: "0.1",
        }, 5);
        const comment_1_2 = fabricateCommentView({
            id: 2,
            path: "0.1.2",
        }, 3);
        const comment_1_2_3 = fabricateCommentView({
            id: 3,
            path: "0.1.2.3",
        }, 1);

        expect(getCommentTree([
            comment_1,
            comment_1_2,
            comment_1_2_3,
        ])).toEqual({
            topNodes: [
                {
                    leaf: comment_1,
                    children: [{
                        leaf: comment_1_2,
                        children: [
                            {
                                leaf: comment_1_2_3,
                                children: [],
                                fullPath: [1, 2, 3],
                                unloadedChildren: 1,
                            }
                        ],
                        fullPath: [1, 2],
                        unloadedChildren: 1,
                    }],
                    fullPath: [1],
                    unloadedChildren: 1,
                },
            ],
            flattenedTree: [
                comment_1,
                comment_1_2,
                comment_1_2_3
            ],
        })
    });

    it('parses a comment tree to investigate a real-world bug', () => {
        const comment_2074795_2076331_2078428 = fabricateCommentView({
            id: 2078428,
            path: "0.2074795.2076331.2078428",
        }, 0);
        const comment_2074795_2076331 = fabricateCommentView({
            id: 2076331,
            path: "0.2074795.2076331",
        }, 1);
        const comment_2074795 = fabricateCommentView({
            id: 2074795,
            path: "0.2074795",
        }, 3);
        const comment_2074795_2075229 = fabricateCommentView({
            id: 2075229,
            path: "0.2074795.2075229",
        }, 0);

        expect(getCommentTree([
            comment_2074795_2076331_2078428,
            comment_2074795_2076331,
            comment_2074795,
            comment_2074795_2075229,
        ])).toEqual({
            topNodes: [
                {
                    leaf: comment_2074795,
                    children: [
                        {
                            leaf: comment_2074795_2076331,
                            children: [
                                {
                                    leaf: comment_2074795_2076331_2078428,
                                    children: [],
                                    fullPath: [2074795, 2076331, 2078428],
                                    unloadedChildren: 0,
                                }
                            ],
                            fullPath: [2074795, 2076331],
                            unloadedChildren: 0,
                        },
                        {
                            leaf: comment_2074795_2075229,
                            children: [],
                            fullPath: [2074795, 2075229],
                            unloadedChildren: 0,
                        },
                    ],
                    fullPath: [2074795],
                    unloadedChildren: 0,
                },
            ],
            flattenedTree: [
                comment_2074795,
                comment_2074795_2076331,
                comment_2074795_2076331_2078428,
                comment_2074795_2075229,
            ],
        })
    });

    it('parses a second comment tree to help investigate a real-world bug', () => {
        const comment_2074795_2076331_2078428 = fabricateCommentView({
            id: 2078428,
            path: "0.2074795.2076331.2078428",
        }, 0);
        const comment_2074795_2076331 = fabricateCommentView({
            id: 2076331,
            path: "0.2074795.2076331",
        }, 1);
        const comment_2074795 = fabricateCommentView({
            id: 2074795,
            path: "0.2074795",
        }, 3);

        expect(getCommentTree([
            comment_2074795_2076331_2078428,
            comment_2074795_2076331,
            comment_2074795,
        ])).toEqual({
            topNodes: [
                {
                    leaf: comment_2074795,
                    children: [
                        {
                            leaf: comment_2074795_2076331,
                            children: [
                                {
                                    leaf: comment_2074795_2076331_2078428,
                                    children: [],
                                    fullPath: [2074795, 2076331, 2078428],
                                    unloadedChildren: 0,
                                },
                            ],
                            fullPath: [2074795, 2076331],
                            unloadedChildren: 0,
                        },
                    ],
                    fullPath: [2074795],
                    unloadedChildren: 1,
                },
            ],
            flattenedTree: [
                comment_2074795,
                comment_2074795_2076331,
                comment_2074795_2076331_2078428,
            ],
        })
    });

    // This is a known problematic case, but we don't have a working solution yet. Ideally,
    // the Lemmy API would expose a variable indicating the number of omitted direct childs
    // of a comment.
    it.skip('parses a third comment tree to help investigate a real-world bug', () => {
        const comment_2181797 = fabricateCommentView({
            id: 2181797,
            path: "0.2181797",
        }, 11);
        const comment_2181797_2187385_2200910_2208646_2230147 = fabricateCommentView({
            id: 2230147,
            path: "0.2181797.2187385.2200910.2208646.2230147",
        }, 0);
        const comment_2181797_2187385 = fabricateCommentView({
            id: 2187385,
            path: "0.2181797.2187385",
        }, 4);
        const comment_2181797_2187385_2200910_2208646 = fabricateCommentView({
            id: 2208646,
            path: "0.2181797.2187385.2200910.2208646",
        }, 1);
        const comment_2181797_2187385_2205610 = fabricateCommentView({
            id: 2205610,
            path: "0.2181797.2187385.2205610",
        }, 0);
        const comment_2181797_2182177 = fabricateCommentView({
            id: 2182177,
            path: "0.2181797.2182177",
        }, 0);
        const comment_2181797_2187385_2200910 = fabricateCommentView({
            id: 2200910,
            path: "0.2181797.2187385.2200910",
        }, 2);
        const comment_2181797_2183102 = fabricateCommentView({
            id: 2183102,
            path: "0.2181797.2183102",
        }, 0);
        // const comment_2181797_2209393_2209965_2213011 = fabricateCommentView({
        //     id: 2213011,
        //     path: "0.2181797.2209393.2209965.2213011",
        // }, 0);
        // const comment_2181797_2209393_2209965 = fabricateCommentView({
        //     id: 2209965,
        //     path: "0.2181797.2209393.2209965",
        // }, 1);

        expect(getCommentTree([
            comment_2181797,
            comment_2181797_2187385_2200910_2208646_2230147,
            comment_2181797_2187385,
            comment_2181797_2187385_2200910_2208646,
            comment_2181797_2187385_2205610,
            comment_2181797_2182177,
            comment_2181797_2187385_2200910,
            comment_2181797_2183102,
            // comment_2181797_2209393_2209965_2213011,
            // comment_2181797_2209393_2209965,
        ])).toEqual({
            topNodes: [
                {
                    leaf: comment_2181797,
                    children: [
                        {
                            leaf: comment_2181797_2187385,
                            children: [
                                {
                                    leaf: comment_2181797_2187385_2205610,
                                    children: [],
                                    fullPath: [2181797, 2187385, 2205610],
                                    unloadedChildren: 0,
                                },
                                {
                                    leaf: comment_2181797_2187385_2200910,
                                    children: [
                                        {
                                            leaf: comment_2181797_2187385_2200910_2208646,
                                            children: [
                                                {
                                                    leaf: comment_2181797_2187385_2200910_2208646_2230147,
                                                    children: [],
                                                    fullPath: [2181797, 2187385, 2200910, 2208646, 2230147],
                                                    unloadedChildren: 0,
                                                },
                                            ],
                                            fullPath: [2181797, 2187385, 2200910, 2208646],
                                            unloadedChildren: 0,
                                        },
                                    ],
                                    fullPath: [2181797, 2187385, 2200910],
                                    unloadedChildren: 0,
                                },
                            ],
                            fullPath: [2181797, 2187385],
                            unloadedChildren: 0,
                        },
                        {
                            leaf: comment_2181797_2182177,
                            children: [],
                            fullPath: [2181797, 2182177],
                            unloadedChildren: 0,
                        },
                        {
                            leaf: comment_2181797_2183102,
                            children: [],
                            fullPath: [2181797, 2183102],
                            unloadedChildren: 0,
                        },
                    ],
                    fullPath: [2181797],
                    unloadedChildren: 1,
                },
            ],
            flattenedTree: [
                comment_2181797,
                comment_2181797_2187385,
                comment_2181797_2187385_2205610,
                comment_2181797_2187385_2200910,
                comment_2181797_2187385_2200910_2208646,
                comment_2181797_2187385_2200910_2208646_2230147,
                comment_2181797_2182177,
                comment_2181797_2183102,
                // comment_2181797_2209393_2209965_2213011,
                // comment_2181797_2209393_2209965,
            ],
        })
    });
});

describe('mergeCommentLists', () => {
    it('only adds new siblings and descendants of those siblings', () => {
        const comment_1 = fabricateCommentView({
            id: 1,
            path: "0.1",
        }, 5);
        const comment_1_2 = fabricateCommentView({
            id: 2,
            path: "0.1.2",
        }, 2);
        const comment_1_2_3 = fabricateCommentView({
            id: 3,
            path: "0.1.2.3",
        }, 0);
        const comment_1_2_4 = fabricateCommentView({
            id: 4,
            path: "0.1.2.4",
        }, 0);
        const comment_1_5 = fabricateCommentView({
            id: 5,
            path: "0.1.5",
        }, 0);
        const comment_1_6 = fabricateCommentView({
            id: 6,
            path: "0.1.6",
        }, 0);

        expect(expandCommentsForId(1, [
            comment_1,
            comment_1_2,
            comment_1_2_3,
        ], [
            comment_1_2_3,
            comment_1_2_4,
            comment_1_5,
            comment_1_6,
        ])).toEqual([
            comment_1,
            comment_1_2,
            comment_1_2_3,
            comment_1_5,
            comment_1_6,
        ])
    });

    it('always inserts at the bottom', () => {
        const comment_2074795_2076331_2078428 = fabricateCommentView({
            id: 2078428,
            path: "0.2074795.2076331.2078428",
        }, 0);
        const comment_2074795_2076331 = fabricateCommentView({
            id: 2076331,
            path: "0.2074795.2076331",
        }, 1);
        const comment_2074795 = fabricateCommentView({
            id: 2074795,
            path: "0.2074795",
        }, 3);
        const comment_2074795_2075229 = fabricateCommentView({
            id: 2075229,
            path: "0.2074795.2075229",
        }, 0);

        expect(expandCommentsForId(2074795, [
            comment_2074795,
            comment_2074795_2076331,
            comment_2074795_2076331_2078428,
        ], [
            comment_2074795_2075229,
            comment_2074795_2076331_2078428,
            comment_2074795_2076331,
            comment_2074795,
        ])).toEqual([
            comment_2074795,
            comment_2074795_2076331,
            comment_2074795_2076331_2078428,
            comment_2074795_2075229,
        ])
    });
});