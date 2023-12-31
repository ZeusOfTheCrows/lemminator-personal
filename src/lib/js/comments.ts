import type { CommentReplyView, CommentView } from "lemmy-js-client";

export interface CommentTreeNode {
    leaf: CommentView | CommentReplyView;
    children: CommentTreeNode[];
    fullPath: number[];
}

export interface CommentTree {
    topNodes: CommentTreeNode[];
    flattenedTree: CommentView[];
}

export function isCommentReplyView(item: CommentView | CommentReplyView): item is CommentReplyView {
    return !!((item as any).comment_reply);
}

function addLeafToTree(nodes: CommentTreeNode[], commentView: CommentView, fullPath: number[], partialPath: number[]): boolean {
    if (partialPath.length == 1) {
        nodes.push({
            leaf: commentView,
            children: [],
            fullPath,
        });
        return true;
    } else {
        const matchedLeaf = nodes.find(n => n.leaf.comment.id == partialPath[0]);
        if (matchedLeaf) {
            return addLeafToTree(matchedLeaf.children, commentView, fullPath, partialPath.slice(1));
        } else {
            return false;
        }
    }
}

function flattenCommentTree(nodes: CommentTreeNode[]): CommentView[] {
    return nodes.reduce((acc: CommentView[], cur: CommentTreeNode) => {
        acc = acc.concat(cur.leaf).concat(flattenCommentTree(cur.children));
        return acc;
    }, []);
}

export function getCommentTree(comments: CommentView[]): CommentTree {
    if (!comments.length) {
        return {
            topNodes: [],
            flattenedTree: [],
        };
    }

    const topNodes: CommentTreeNode[] = [];
    let unprocessedComments: CommentView[] = [...comments];
    const maxLevelToProcess = unprocessedComments
        .reduce((acc, cur) => Math.max(acc, (cur.comment.path.match(/\./g) || []).length), 0);

    const largestCommonPathPrefix = unprocessedComments.reduce((prefix, cur) => {
        const curPath = cur.comment.path;
        let commonPrefix = '';
        for (let i = 0; i < Math.min(prefix.length, curPath.length); i++) {
            if (prefix[i] === curPath[i]) {
                commonPrefix += prefix[i];
            } else {
                break;
            }
        }
        return commonPrefix;
    }, unprocessedComments[0].comment.path);
    const listifiedLargestCommonPathPrefix = largestCommonPathPrefix.split('.');
    const prefixToTrim = `${listifiedLargestCommonPathPrefix.slice(0, listifiedLargestCommonPathPrefix.length - 1).join('.')}.`;
    const trimRegex = new RegExp(`^${prefixToTrim.replace('.', '\\.')}`);

    for (let levelToProcess = 1; levelToProcess <= maxLevelToProcess; levelToProcess++) {
        const processedComments: CommentView[] = [];
        for (const commentView of unprocessedComments) {
            const processedPath = commentView.comment.path.replace(trimRegex, '')
                .split('.')
                .map(item => parseInt(item));

            // Preserve original order to prevent comment jumps the user wouldn't expect
            if (processedPath.length != levelToProcess) continue;

            if (addLeafToTree(topNodes, commentView, processedPath, processedPath)) {
                processedComments.push(commentView);
            }
        }
        unprocessedComments = unprocessedComments.filter(uc => !processedComments.find(pc => uc == pc));
    }

    return {
        topNodes,
        flattenedTree: flattenCommentTree(topNodes),
    };
}

export function locateCommentNode(nodes: CommentTreeNode[], commentId: number): CommentTreeNode | null {
    const locatedNode = nodes.find(n => n.leaf.comment.id == commentId);
    if (locatedNode) {
        return locatedNode;
    }

    for (const node of nodes) {
        const locatedChildNode = locateCommentNode(node.children, commentId);
        if (locatedChildNode) return locatedChildNode;
    }

    return null;
}

export function expandTopLevelComments(existingComments: CommentView[], commentsToMerge: CommentView[]): CommentView[] {
    // Assumption is that the existing comments tree doesn't contain duplicates
    const existingIds = existingComments.map((c) => c.comment.id);
    const newComments = commentsToMerge.filter(c => !existingIds.includes(c.comment.id));

    // When a user clicks 'Load more' in a certain comment thread, we don't want to expand
    // already displayed descendants of that comment because it's not what the user would
    // expect. Therefore, filtering is needed.
    const matcher = /^0\.(\d+)$/;
    const subtreesToIgnore = existingComments.filter(c => !!c.comment.path.match(matcher))
        .map(c => {
            return c.comment.path.match(matcher)![1];
        });

    const nonIgnoredNewComments = newComments.reduce((acc: CommentView[], c: CommentView) => {
        const fullPath = c.comment.path.split(".");
        if (!fullPath.find(pathItem => subtreesToIgnore.includes(pathItem))) {
            acc.push(c);
        }
        return acc;
    }, []);
    return existingComments.concat(nonIgnoredNewComments);
}

export function expandCommentsForId(comment_id: number, existingComments: CommentView[], commentsToMerge: CommentView[]) {
    // Assumption is that the existing comments tree doesn't contain duplicates
    const existingIds = existingComments.map((c) => c.comment.id);
    const newComments = commentsToMerge.filter(c => !existingIds.includes(c.comment.id));

    // When a user clicks 'Load more' in a certain comment thread, we don't want to expand
    // already displayed descendants of that comment because it's not what the user would
    // expect. Therefore, filtering is needed.
    const subtreesToIgnore = existingComments.filter(c => c.comment.path.includes(`.${comment_id}.`))
        .map(c => {
            const fullPath = c.comment.path.split(".");
            return fullPath[fullPath.length - 1];
        });
    const nonIgnoredNewComments = newComments.reduce((acc: CommentView[], c: CommentView) => {
        const fullPath = c.comment.path.split(".");
        if (!fullPath.find(pathItem => subtreesToIgnore.includes(pathItem))) {
            acc.push(c);
        }
        return acc;
    }, []);
    return existingComments.concat(nonIgnoredNewComments);
}
