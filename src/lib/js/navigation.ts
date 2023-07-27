import type { PostView } from "lemmy-js-client";

export function getDetailLinkForPost(postView: PostView): string {
    return `/c/${postView.community.name}/${postView.post.id}`;
}