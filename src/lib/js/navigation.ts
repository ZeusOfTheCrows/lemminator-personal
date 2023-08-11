import type { Community, PostView } from "lemmy-js-client";

export function getNormalizedCommunityName(community: Community): string {
    if (community.local) return community.name;

    const hostname = new URL(community.actor_id).hostname;
    return `${community.name}@${hostname}`;
}

export function getDetailLinkForPost(postView: PostView): string {
    // For federated communities, we have to get the community name from outside PostView.
    // For the front page, PostView is the only place where we can get it.
    return `/c/${getNormalizedCommunityName(postView.community)}/post/${postView.post.id}`;
}