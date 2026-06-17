// Minimal shapes for the subset of the Bluesky getPostThread response we render.

export interface BskyAuthor {
    did: string;
    handle: string;
    displayName?: string;
    avatar?: string;
}

export interface BskyFacetFeature {
    $type: string;
    uri?: string;  // app.bsky.richtext.facet#link
    did?: string;  // app.bsky.richtext.facet#mention
    tag?: string;  // app.bsky.richtext.facet#tag
}

export interface BskyFacet {
    index: { byteStart: number; byteEnd: number };
    features: BskyFacetFeature[];
}

export interface BskyPostRecord {
    text?: string;
    createdAt: string;
    facets?: BskyFacet[];
}

export interface BskyPostView {
    uri: string;
    author: BskyAuthor;
    record: BskyPostRecord;
    replyCount?: number;
}

export interface BskyThreadViewPost {
    $type?: string;
    post: BskyPostView;
    replies?: BskyThreadViewPost[];
}

export interface ArchiveCommentsResponse {
    postUri: string | null;
    postUrl: string | null;
    thread: BskyThreadViewPost | null;
    hiddenReplies: string[];
}
