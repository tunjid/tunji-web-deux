import React, { useEffect, useState } from 'react';
import { Avatar, Box, CircularProgress, Link, Typography } from '@mui/material';
import { PopulatedArchive } from '@tunji-web/client/src/models/PopulatedArchive';
import ApiService from '@tunji-web/client/src/rest/ApiService';
import {
    ArchiveCommentsResponse,
    BskyAuthor,
    BskyFacet,
    BskyThreadViewPost,
} from '@tunji-web/client/src/models/BskyThread';

interface ArchiveCommentsProps {
    archive?: PopulatedArchive;
}

const THREAD_VIEW_POST = 'app.bsky.feed.defs#threadViewPost';
const MAX_DEPTH = 6;

const profileUrl = (did: string) => `https://bsky.app/profile/${did}`;

const postUrl = (atUri: string): string => {
    const [did, , rkey] = atUri.replace('at://', '').split('/');
    return `https://bsky.app/profile/${did}/post/${rkey}`;
};

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});

const byCreatedAt = (a: BskyThreadViewPost, b: BskyThreadViewPost) =>
    new Date(a.post.record.createdAt).getTime() - new Date(b.post.record.createdAt).getTime();

const liveReplies = (node: BskyThreadViewPost, hiddenReplies: Set<string>) =>
    (node.replies || [])
        .filter((r) => r.$type === THREAD_VIEW_POST && !!r.post)
        .filter((r) => !hiddenReplies.has(r.post.uri))
        .sort(byCreatedAt);

/**
 * Render post text with facets (links, mentions, tags) as React nodes.
 * Facets index into UTF-8 bytes, so we slice on the encoded bytes. React handles
 * escaping, so unlike the original web component we never build raw HTML.
 */
const renderText = (text: string | undefined, facets: BskyFacet[] | undefined): React.ReactNode => {
    if (!text) return null;

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const bytes = encoder.encode(text);

    const sorted = (facets || [])
        .filter((f) => f.index && f.features?.length)
        .sort((a, b) => a.index.byteStart - b.index.byteStart);

    const nodes: React.ReactNode[] = [];
    let cursor = 0;
    let key = 0;

    const pushText = (value: string) => {
        const lines = value.split('\n');
        lines.forEach((line, i) => {
            if (line) nodes.push(<React.Fragment key={`t-${key++}`}>{line}</React.Fragment>);
            if (i < lines.length - 1) nodes.push(<br key={`br-${key++}`}/>);
        });
    };

    for (const facet of sorted) {
        const {byteStart, byteEnd} = facet.index;
        if (byteStart > cursor) pushText(decoder.decode(bytes.slice(cursor, byteStart)));

        const facetText = decoder.decode(bytes.slice(byteStart, byteEnd));
        const feature = facet.features[0];

        let href: string | undefined;
        if (feature.$type === 'app.bsky.richtext.facet#link') href = feature.uri;
        else if (feature.$type === 'app.bsky.richtext.facet#mention') href = feature.did ? profileUrl(feature.did) : undefined;
        else if (feature.$type === 'app.bsky.richtext.facet#tag') href = feature.tag ? `https://bsky.app/hashtag/${encodeURIComponent(feature.tag)}` : undefined;

        if (href) {
            nodes.push(
                <Link key={`f-${key++}`} href={href} target="_blank" rel="noopener noreferrer">{facetText}</Link>
            );
        } else {
            pushText(facetText);
        }
        cursor = byteEnd;
    }

    if (cursor < bytes.length) pushText(decoder.decode(bytes.slice(cursor)));

    return nodes;
};

const Author = ({author}: { author: BskyAuthor }) => (
    <Link
        href={profileUrl(author.did)}
        target="_blank"
        rel="noopener noreferrer"
        sx={{display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'text.primary'}}
    >
        {author.avatar && <Avatar src={author.avatar} alt="" sx={{width: 28, height: 28}}/>}
        <Typography component="span" variant="body2" sx={{fontWeight: 600}}>
            {author.displayName || author.handle}
        </Typography>
        <Typography component="span" variant="body2" color="text.secondary">
            @{author.handle}
        </Typography>
    </Link>
);

const PostFooter = ({uri, createdAt}: { uri: string; createdAt: string }) => (
    <Typography variant="caption" color="text.secondary" sx={{display: 'block', mt: 0.5}}>
        <Link href={postUrl(uri)} title="View on Bluesky" target="_blank" rel="noopener noreferrer" color="inherit"
              sx={{textDecoration: 'none'}}>
            {formatDate(createdAt)}
        </Link>
    </Typography>
);

const Reply = ({node, depth, hiddenReplies}: {
    node: BskyThreadViewPost;
    depth: number;
    hiddenReplies: Set<string>;
}) => {
    const {post} = node;
    const nested = liveReplies(node, hiddenReplies);

    return (
        <Box component="li" sx={{listStyle: 'none', mt: 2}}>
            <Author author={post.author}/>
            <Typography variant="body2" component="div" sx={{mt: 0.5}}>
                {renderText(post.record.text, post.record.facets)}
            </Typography>
            <PostFooter uri={post.uri} createdAt={post.record.createdAt}/>
            {nested.length > 0 && (
                depth >= MAX_DEPTH ? (
                    <Typography variant="body2" sx={{mt: 1}}>
                        <Link href={postUrl(post.uri)} target="_blank" rel="noopener noreferrer">
                            More of the conversation on Bluesky &rarr;
                        </Link>
                    </Typography>
                ) : (
                    <Box component="ol" sx={{listStyle: 'none', pl: 2, ml: 1, my: 0, borderLeft: 1, borderColor: 'divider'}}>
                        {nested.map((reply) => (
                            <Reply key={reply.post.uri} node={reply} depth={depth + 1} hiddenReplies={hiddenReplies}/>
                        ))}
                    </Box>
                )
            )}
        </Box>
    );
};

export default function ArchiveComments({archive}: ArchiveCommentsProps) {
    const [data, setData] = useState<ArchiveCommentsResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const kind = archive?.kind;
    const id = archive?.key;

    useEffect(() => {
        if (!kind || !id) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;
        setIsLoading(true);
        setError(null);

        ApiService.fetchArchiveComments(kind, id)
            .then((response) => {
                if (isMounted) setData(response.data);
            })
            .catch((err) => {
                console.error('Failed to load comments:', err);
                if (isMounted) setError('Could not load comments.');
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [kind, id]);

    if (isLoading) {
        return (
            <Box sx={{mt: 6, py: 2, display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary'}}>
                <CircularProgress size={20} color="inherit"/>
                <Typography variant="body2">Loading comments...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{mt: 6, py: 2}}>
                <Typography variant="body2" color="error.main">{error}</Typography>
            </Box>
        );
    }

    const thread = data?.thread;
    if (!thread?.post) return null;

    const hiddenReplies = new Set(data?.hiddenReplies || []);

    // Top-level comments: all non-hidden replies, including the post author's own
    // (so the author's responses/answers show up as comments too).
    const directReplies = liveReplies(thread, hiddenReplies);

    const engageUrl = data?.postUrl;
    if (directReplies.length === 0 && !engageUrl) return null;

    return (
        <Box sx={{mt: 6, pt: 4, borderTop: 1, borderColor: 'divider', width: '100%'}}>
            <Typography variant="h6" gutterBottom>Comments</Typography>
            {directReplies.length > 0 ? (
                <Box component="ol" sx={{listStyle: 'none', p: 0, m: 0}}>
                    {directReplies.map((reply) => (
                        <Reply key={reply.post.uri} node={reply} depth={1} hiddenReplies={hiddenReplies}/>
                    ))}
                </Box>
            ) : (
                <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
            )}
            {engageUrl && (
                <Typography variant="body2" sx={{mt: 3}}>
                    <Link href={engageUrl} target="_blank" rel="noopener noreferrer">
                        Add your thoughts on Bluesky
                    </Link>
                </Typography>
            )}
        </Box>
    );
}
