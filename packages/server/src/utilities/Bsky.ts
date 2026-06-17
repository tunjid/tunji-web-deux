import { documentRecordKey } from 'atmosphere-rss';
import config from '../config/config';

// atproto identity for this site's standard documents. Mirrors the values that
// were previously duplicated in ReactRouter.tsx and the client DocumentComments.
export const REPO_DID = 'did:plc:6q4y7p2wft3tncsffspts3m5';
export const STANDARD_DOCUMENT_COLLECTION = 'site.standard.document';

// app.bsky.* records (posts, threads) are served by the public appview.
const APPVIEW_API = 'https://public.api.bsky.app/xrpc';

const fetchJson = async (url: string): Promise<any | null> => {
    try {
        const response = await fetch(url, {headers: {Accept: 'application/json'}});
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error(`Bsky request failed for ${url}:`, error);
        return null;
    }
};

// Custom-lexicon records (e.g. site.standard.document) are NOT served by the
// appview — it only indexes app.bsky.* collections and returns RecordNotFound for
// the rest. Such records must be read from the repo's own PDS, whose endpoint we
// resolve from the DID document. The mapping is stable per-DID, so cache it (and
// evict on failure so transient errors are retried).
const pdsCache = new Map<string, Promise<string | null>>();

const resolvePdsEndpoint = (did: string): Promise<string | null> => {
    const cached = pdsCache.get(did);
    if (cached) return cached;

    const promise = (async () => {
        const didDocUrl = did.startsWith('did:plc:')
            ? `https://plc.directory/${did}`
            : did.startsWith('did:web:')
                ? `https://${did.slice('did:web:'.length)}/.well-known/did.json`
                : null;
        if (!didDocUrl) return null;

        const doc = await fetchJson(didDocUrl);
        const service = (doc?.service || []).find(
            (s: any) => s.id === '#atproto_pds' || s.type === 'AtprotoPersonalDataServer',
        );
        return service?.serviceEndpoint ?? null;
    })();

    pdsCache.set(did, promise);
    promise.then((endpoint) => {
        if (!endpoint) pdsCache.delete(did);
    }).catch(() => pdsCache.delete(did));
    return promise;
};

/**
 * Resolve the Bluesky post URI for a standard document, given the archive's
 * publish date and its kind/link. Returns null when no post is associated.
 *
 * The record key is deterministic (publish date + canonical URL pathname); this
 * mirrors the server-side computation in ReactRouter.tsx. The record itself lives
 * on the repo's PDS, not the appview.
 */
export const resolveDocumentPostUri = async (
    created: Date,
    kind: string,
    link: string,
): Promise<string | null> => {
    const pds = await resolvePdsEndpoint(REPO_DID);
    if (!pds) return null;

    const rkey = await documentRecordKey(created, new URL(`${config.apiEndpoint}/${kind}/${link}`));
    const record = await fetchJson(
        `${pds}/xrpc/com.atproto.repo.getRecord?repo=${REPO_DID}&collection=${STANDARD_DOCUMENT_COLLECTION}&rkey=${rkey}`,
    );
    return record?.value?.bskyPostRef?.uri ?? null;
};

/**
 * Fetch the raw getPostThread response for a Bluesky post (the `{ thread, threadgate }`
 * envelope) from the appview, or null on failure.
 */
export const fetchPostThread = async (atUri: string, depth: number): Promise<any | null> => {
    return fetchJson(
        `${APPVIEW_API}/app.bsky.feed.getPostThread?uri=${encodeURIComponent(atUri)}&depth=${depth}`,
    );
};

/**
 * Convert an at:// post URI to its bsky.app web URL.
 */
export const atUriToBskyUrl = (atUri: string): string => {
    const [did, , rkey] = atUri.replace('at://', '').split('/');
    return `https://bsky.app/profile/${did}/post/${rkey}`;
};
