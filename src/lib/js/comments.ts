import type { CommentView } from "lemmy-js-client";

export interface CommentTreeNode {
    leaf: CommentView;
    children: CommentTreeNode[];
    fullPath: number[];
    unloadedChildren: number;
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
            unloadedChildren: 0,
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

function adjustUnloadedCounts(node: CommentTreeNode): { loaded: number, unloaded: number } {
    let loadedFromChildren = 0;
    let unloadedWithinChildren = 0;

    for (const child of node.children) {
        const counts = adjustUnloadedCounts(child);
        loadedFromChildren += counts.loaded;
        unloadedWithinChildren += counts.unloaded;
    }

    node.unloadedChildren = node.leaf.counts.child_count - loadedFromChildren - unloadedWithinChildren - node.children.length;
    return {
        loaded: node.children.length + loadedFromChildren,
        unloaded: node.unloadedChildren + unloadedWithinChildren,
    }
}

export function getCommentTree(comments: CommentView[]): CommentTree {
    const topNodes: CommentTreeNode[] = [];
    let unprocessedComments: CommentView[] = [...comments];
    const maxLevelToProcess = unprocessedComments
        .reduce((acc, cur) => Math.max(acc, (cur.comment.path.match(/\./g) || []).length), 0);

    for (let levelToProcess = 1; levelToProcess <= maxLevelToProcess; levelToProcess++) {
        const processedComments: CommentView[] = [];
        for (const commentView of unprocessedComments) {
            const processedPath = commentView.comment.path.replace(/^0\./, '')
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

    for (const topNode of topNodes) {
        adjustUnloadedCounts(topNode);
    }
    return {
        topNodes,
        flattenedTree: flattenCommentTree(topNodes),
    };
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
