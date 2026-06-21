import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Grid, Typography } from '@mui/material';
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

export default function RelatedArchives({archive}: RelatedArchivesProps) {
    const dispatch = useDispatch();
    const [related, setRelated] = useState<PopulatedArchive[]>([]);

    const currentKey = archive?.key;

    // Drop the previous post's picks synchronously when navigating to a different archive (e.g.
    // detail -> detail by clicking a related card). The same ArchiveDetail/RelatedArchives instance is
    // reused across that navigation, so without this the prior picks linger until the async re-fetch
    // resolves. A lingering card that links to the NEW post would briefly claim the same
    // `archive-image-<id>` as the destination hero — a duplicate view-transition-name, which aborts the
    // whole morph. Resetting in render keeps the new snapshot collision-free so the hero image morphs.
    const [trackedKey, setTrackedKey] = useState(currentKey);
    if (currentKey !== trackedKey) {
        setTrackedKey(currentKey);
        setRelated([]);
    }

    useEffect(() => {
        if (!archive || !currentKey) {
            setRelated([]);
            return;
        }

        let isMounted = true;

        const dedupe = (archives: PopulatedArchive[]): PopulatedArchive[] =>
            _.uniqBy(archives.filter((a) => a.key !== currentKey), (a) => a.key);

        const resolve = async (): Promise<PopulatedArchive[]> => {
            const pool = dedupe(await fetchPool(archive.categories));

            // Bias toward the most-related, then shuffle so the chosen few vary between visits.
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
                if (!isMounted) return;
                setRelated(picks);
                // Seed the store so the destination detail page can render the correct hero on first
                // paint (archiveSelector falls back to kindToArchivesMap), making the image morph clean.
                _.toPairs(_.groupBy(picks, (a) => a.kind)).forEach(([kind, item]) =>
                    dispatch(ArchiveActions.addArchives({kind: kind as ArchiveKind, item}))
                );
            })
            .catch((err) => {
                console.error('Failed to load related posts:', err);
                if (isMounted) setRelated([]);
            });

        return () => {
            isMounted = false;
        };
    }, [archive, currentKey, dispatch]);

    if (related.length === 0) return null;

    return (
        <Box sx={{mt: 6, pt: 4, borderTop: 1, borderColor: 'divider', width: '100%'}}>
            <Typography variant="h6" gutterBottom>Keep reading</Typography>
            <Grid container spacing={4} columns={12} sx={{my: 4}}>
                {related.map((item) => (
                    <ArchiveCard key={item.key} cardInfo={cardInfoFrom(item)}/>
                ))}
            </Grid>
        </Box>
    );
}
