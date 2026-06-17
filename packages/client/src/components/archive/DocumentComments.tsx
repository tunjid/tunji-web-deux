import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { documentRecordKey } from 'atmosphere-rss';
import { PopulatedArchive } from '@tunji-web/client/src/models/PopulatedArchive';

// 1. Extend JSX IntrinsicElements for the Tangled web component
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'bsky-conversation': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                uri: string;
                'max-depth'?: string | number;
                'show-original-post'?: string | boolean;
                'engage-text'?: string;
            };
        }
    }
}

// 2. Define the component's expected props
interface DocumentCommentsProps {
    archive?: PopulatedArchive;
}

// Hardcoded repository details
const REPO_DID = 'did:plc:6q4y7p2wft3tncsffspts3m5';
const COLLECTION = 'site.standard.document';

/**
 * Helper to convert an AT-URI to a standard bsky.app web URL
 */
function convertAtUriToBskyUrl(atUri?: string | null): string | null {
    if (!atUri) return null;
    if (!atUri.startsWith('at://')) return atUri;

    const parts = atUri.replace('at://', '').split('/');
    if (parts.length === 3) {
        const did = parts[0];
        const recordKey = parts[2];
        return `https://bsky.app/profile/${did}/post/${recordKey}`;
    }

    return atUri;
}

export default function DocumentComments({ archive }: DocumentCommentsProps) {
    const [bskyWebUrl, setBskyWebUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Inject the Web Component script on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && !window.customElements.get('bsky-conversation')) {
            const script = document.createElement('script');
            script.src = '/bsky-conversation.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);

    const docCreated = archive?.created
    const kind = archive?.kind
    const docLink = archive?.link

    // Inject the Web Component script on mount from the remote source
    useEffect(() => {
        if (typeof window !== 'undefined' && !window.customElements.get('bsky-conversation')) {
            const script = document.createElement('script');

            // Replace with the exact raw/CDN URL provided in the Tangled repo's README
            script.src = 'https://jimray-bsky.tngl.io/bsky-conversation/bsky-conversation.js';

            // Web components are often exported as modules
            script.type = 'module';
            script.async = true;
            script.crossOrigin = 'anonymous'; // Good practice for external scripts

            document.head.appendChild(script);
        }
    }, []);

    // Fetch the document record and extract the Bluesky URI
    useEffect(() => {
        if (!docCreated || !kind || !docLink) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        async function resolvePostUri() {
            setIsLoading(true);
            setError(null);

            const rkey = await documentRecordKey(
                docCreated,
                new URL(`https://tunjid.com/${kind}/${docLink}`)
            )

            const url = `https://public.api.bsky.app/xrpc/com.atproto.repo.getRecord?repo=${REPO_DID}&collection=${COLLECTION}&rkey=${rkey}`;

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const postUri: string | undefined = data.value?.bskyPostRef?.uri;

                if (isMounted) {
                    setBskyWebUrl(convertAtUriToBskyUrl(postUri));
                }
            } catch (err) {
                console.error("Failed to resolve standard site document:", err);
                if (isMounted) setError("Could not load comments.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        resolvePostUri();

        return () => {
            isMounted = false;
        };
    }, [docCreated, kind, docLink]);

    // Render States using Material UI
    if (isLoading) {
        return (
            <Box sx={{ mt: 6, py: 2, display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                <CircularProgress size={20} color="inherit" />
                <Typography variant="body2">Loading comments...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 6, py: 2 }}>
                <Typography variant="body2" color="error.main">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (!bskyWebUrl) {
        return null;
    }

    // Render the Web Component with an MUI wrapper
    return (
        <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: 'divider' }}>
            <bsky-conversation
                uri={bskyWebUrl}
                max-depth={5}
                show-original-post="false"
                engage-text="Add your thoughts on Bluesky"
            ></bsky-conversation>
        </Box>
    );
}