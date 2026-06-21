import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import _ from 'lodash';
import { ArchiveKind } from '@tunji-web/common';
import { PopulatedArchive } from '@tunji-web/client/src/models/PopulatedArchive';
import ApiService from '@tunji-web/client/src/rest/ApiService';
import { ArchiveActions } from '@tunji-web/client/src/actions/Archive';
import ArchiveCard from '@tunji-web/client/src/components/cards/ArchiveCard';
import { ArchiveCardInfo } from '@tunji-web/client/src/components/cards/ArchiveCardInfo';
import { archiveDate, readTime } from '../common/Common';

interface RelatedArchivesProps {
    archive?: PopulatedArchive;
}

// How many candidates to pull per kind, how many of the most-related to keep before the shuffle, and
// how many cards to ultimately show. The shuffle over the top candidates is what keeps the picks from
// being identical on every visit to the same post.
const POOL_PER_KIND = 8;
const TOP_CANDIDATES = 8;
const RESULT_COUNT = 3;

const withDate = (archive: PopulatedArchive): PopulatedArchive => ({...archive, created: new Date(archive.created)});

// Fetch a pool across every archive kind in parallel, tolerating per-kind failures so one bad request
// doesn't sink the whole section. `categories` (when present) narrows each query to posts sharing at
// least one category ($in on the server); when empty the query just returns the most-recent posts.
const fetchPool = (categories: string[]): Promise<PopulatedArchive[]> =>
    Promise.all(
        Object.values(ArchiveKind).map((kind) => {
            const params = new URLSearchParams();
            categories.forEach((category) => params.append('category', category));
            params.append('limit', `${POOL_PER_KIND}`);
            params.append('populateAuthor', 'true');

            return ApiService
                .fetchArchives({kind, params, key: `related-${kind}`})
                .then((response) => response.data.map(withDate))
                .catch(() => [] as PopulatedArchive[]);
        })
    ).then((pools) => pools.flat());

// Shared categories + shared tags. Higher means more related.
const relatedness = (current: PopulatedArchive, candidate: PopulatedArchive): number =>
    _.intersection(current.categories, candidate.categories).length +
    _.intersection(current.tags, candidate.tags).length;

const cardInfoFrom = (archive: PopulatedArchive): ArchiveCardInfo => ({
    id: archive.key,
    link: archive.link,
    kind: archive.kind,
    title: archive.title,
    description: archive.description,
    author: archive.author,
    showThumbnail: true,
    breakPoints: {xs: 12, sm: 6, md: 4},
    thumbnail: archive.thumbnail || '',
    date: archiveDate(archive.created),
    categories: archive.categories,
    readTime: readTime(archive.body),
});

// Per-archive cache of the chosen picks, scoped to the session (it lives only in memory, so a fresh
// page load re-randomizes). Returning to a post — e.g. browser Back after tapping a related card — then
// shows the SAME cards it showed before. That stability is what lets the REVERSE view transition
// animate: the card linking to the post you came from must still be present on the page you return to,
// so the detail hero has a morph target to shrink back into.
const picksCache = new Map<string, PopulatedArchive[]>();

export default function RelatedArchives({archive}: RelatedArchivesProps) {
    const dispatch = useDispatch();

    const currentKey = archive?.key;
    const cachedPicks = currentKey ? picksCache.get(currentKey) : undefined;

    const [related, setRelated] = useState<PopulatedArchive[]>(cachedPicks ?? []);
    const [refreshing, setRefreshing] = useState(false);
    // Bumped by the refresh button to force a re-fetch for the current archive (see the fetch effect).
    const [refreshNonce, setRefreshNonce] = useState(0);

    // When navigating to a different archive (e.g. detail -> detail by clicking a related card) the same
    // ArchiveDetail/RelatedArchives instance is reused, so swap to the new post's picks *in render* —
    // never let the previous post's lingering cards reach the next view-transition snapshot. Showing the
    // new post's own cached picks (or nothing, pending fetch) keeps that snapshot free of a card that
    // would duplicate the destination hero's `archive-image-<id>` and abort the forward morph; rendering
    // the cached picks (rather than clearing) on a return visit preserves the reverse morph's target.
    const [trackedKey, setTrackedKey] = useState(currentKey);
    if (currentKey !== trackedKey) {
        setTrackedKey(currentKey);
        setRelated(cachedPicks ?? []);
        setRefreshing(false);
    }

    // Fetch once per archive and cache the result. Cached visits — crucially browser Back/Forward —
    // reuse the stored picks untouched: re-rolling the shuffle on return would replace the very card the
    // reverse view transition needs to morph back into, breaking the animation. The only way to re-roll
    // is the explicit refresh button below, which drops this archive's cache entry and bumps the nonce.
    useEffect(() => {
        if (!archive || !currentKey || picksCache.has(currentKey)) return;

        let isMounted = true;
        setRefreshing(true);

        const dedupe = (archives: PopulatedArchive[]): PopulatedArchive[] =>
            _.uniqBy(archives.filter((a) => a.key !== currentKey), (a) => a.key);

        const resolve = async (): Promise<PopulatedArchive[]> => {
            const pool = dedupe(await fetchPool(archive.categories));

            // Bias toward the most-related, then shuffle so the chosen few vary between fresh loads.
            const ranked = _.orderBy(pool, (candidate) => relatedness(archive, candidate), ['desc'])
                .slice(0, TOP_CANDIDATES);
            let picks = _.shuffle(ranked).slice(0, RESULT_COUNT);

            // Sparse categories/tags: top up with recent posts of any kind.
            if (picks.length < RESULT_COUNT) {
                const fallback = dedupe(await fetchPool([]));
                const pickedKeys = new Set(picks.map((a) => a.key));
                const extra = _.shuffle(fallback.filter((a) => !pickedKeys.has(a.key)));
                picks = [...picks, ...extra].slice(0, RESULT_COUNT);
            }

            return picks;
        };

        resolve()
            .then((picks) => {
                // Cache + seed even if we've since navigated away: it's correct data for this archive
                // key, ready for a later return. Only the visible state is gated on still being mounted.
                picksCache.set(currentKey, picks);
                // Seed the store so the destination detail page can render the correct hero on first
                // paint (archiveSelector falls back to kindToArchivesMap), making the image morph clean.
                _.toPairs(_.groupBy(picks, (a) => a.kind)).forEach(([kind, item]) =>
                    dispatch(ArchiveActions.addArchives({kind: kind as ArchiveKind, item}))
                );
                if (isMounted) setRelated(picks);
            })
            .catch((err) => {
                console.error('Failed to load related posts:', err);
                if (isMounted) setRelated([]);
            })
            .finally(() => {
                if (isMounted) setRefreshing(false);
            });

        return () => {
            isMounted = false;
        };
    }, [archive, currentKey, dispatch, refreshNonce]);

    // Explicit, user-initiated re-roll — safe because it happens between navigations, not during one.
    const handleRefresh = () => {
        if (refreshing || !currentKey) return;
        picksCache.delete(currentKey);
        setRefreshNonce((nonce) => nonce + 1);
    };

    if (related.length === 0) return null;

    return (
        <Box sx={{mt: 6, pt: 4, borderTop: 1, borderColor: 'divider', width: '100%'}}>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography variant="h6">Keep reading</Typography>
                <IconButton
                    onClick={handleRefresh}
                    disabled={refreshing}
                    size="small"
                    aria-label="Show other suggestions"
                    title="Show other suggestions"
                >
                    {refreshing
                        ? <CircularProgress size={18} color="inherit"/>
                        : <RefreshRoundedIcon fontSize="small"/>}
                </IconButton>
            </Box>
            <Grid container spacing={4} columns={12} sx={{my: 4}}>
                {related.map((item) => (
                    <ArchiveCard key={item.key} cardInfo={cardInfoFrom(item)}/>
                ))}
            </Grid>
        </Box>
    );
}
