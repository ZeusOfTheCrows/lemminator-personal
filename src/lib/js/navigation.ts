import type { CommentView, Community, PostView } from "lemmy-js-client";

export function getNormalizedCommunityName(community: Community): string {
    if (community.local) return community.name;

    const hostname = new URL(community.actor_id).hostname;
    return `${community.name}@${hostname}`;
}

export function getPostDetailLinkFromPostView(postView: PostView): string {
    return `/c/${getNormalizedCommunityName(postView.community)}/post/${postView.post.id}`;
}

export function getPostDetailLinkFromCommentView(commentView: CommentView): string {
    return `/c/${getNormalizedCommunityName(commentView.community)}/post/${commentView.post.id}`;
}

export function getDetailLinkForComment(commentView: CommentView): string {
    return `/c/${getNormalizedCommunityName(commentView.community)}/post/${commentView.post.id}/comment/${commentView.comment.id}`;
}