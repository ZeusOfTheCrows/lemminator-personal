import type { CommentView, GetCommentsResponse } from "lemmy-js-client";

export interface CommentTreeNode {
    leaf: CommentView;
    children: CommentTreeNode[];
    fullPath: number[];
}

export interface CommentTree {
    topNodes: CommentTreeNode[];
    flattenedTree: CommentView[];
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
    const topNodes: CommentTreeNode[] = [];
    let unprocessedComments: CommentView[] = [...comments];

    while (unprocessedComments.length) {
        const processedComments: CommentView[] = [];
        for (const commentView of unprocessedComments) {
            const processedPath = commentView.comment.path.replace(/^0\./, '')
                .split('.')
                .map(item => parseInt(item));
            if (addLeafToTree(topNodes, commentView, processedPath, processedPath)) {
                processedComments.push(commentView);
            }
        }
        if (processedComments.length) {
            unprocessedComments = unprocessedComments.filter(uc => !processedComments.find(pc => uc == pc));
        } else {
            // We've reached equilibrium. Any comments we haven't been able to insert into
            // the tree at this point have at least one ancestor that's not in the tree. The
            // missing ancestors should show up on later comment pages that currently aren't
            // loaded.
            return {
                topNodes,
                flattenedTree: flattenCommentTree(topNodes),
            };
        }
    }

    return {
        topNodes,
        flattenedTree: flattenCommentTree(topNodes),
    };
}

export function mergeCommentLists(existingComments: CommentView[], commentsToMerge: CommentView[]) {
    // Assumption is that the existing comments tree doesn't contain duplicates
    const existingIds = existingComments.map((c) => c.comment.id);
    const newComments = commentsToMerge.filter(c => !existingIds.includes(c.comment.id));
    return existingComments.concat(commentsToMerge);
}
