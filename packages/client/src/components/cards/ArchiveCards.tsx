import * as React from 'react';
import Grid from '@mui/material/Grid';
import { ArchiveKind, ArchiveLike } from '@tunji-web/common';
import { archiveDate, readTime } from '../common/Common';
import ArchiveCard from '@tunji-web/client/src/components/cards/ArchiveCard';
import { ArchiveCardInfo } from '@tunji-web/client/src/components/cards/ArchiveCardInfo';

interface Props {
    kind: ArchiveKind,
    archives: ArchiveLike[],
}

const ArchiveCards = ({archives}: Props) => {
    const cardFromArchive: (archive: ArchiveLike, index: number) => ArchiveCardInfo = (archive, index) => {
        const position = index + 1;
        const modulo5 = position % 5;
        const should = (modulo5 === 1 || modulo5 === 2) && index < 5;
        return ({
            id: archive.key,
            link: archive.link,
            kind: archive.kind,
            title: archive.title,
            description: archive.description,
            author: archive.author,
            showThumbnail: true,
            breakPoints: {xs: 12, md: should ? 6 : 4},
            thumbnail: archive.thumbnail || '',
            date: archiveDate(archive.created),
            categories: archive.categories,
            readTime: readTime(archive.body),
        });
    };

    const cards = archives.map(cardFromArchive);

    return (
        <Grid container spacing={4} columns={12} sx={{my: 4}}>
            {cards.map((cardInfo, index) => (
                <ArchiveCard key={cardInfo.id} cardInfo={cardInfo}/>
            ))}
        </Grid>
    );
};

export default ArchiveCards;
