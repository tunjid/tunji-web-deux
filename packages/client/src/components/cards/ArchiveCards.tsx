import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import ArchiveCard from '../cards/ArchiveCard';
import { GridList, GridListTile, Hidden } from '@material-ui/core';
import { ArchiveKind, ArchiveLike } from '@tunji-web/common';
import { ArchiveCardInfo, CardStyle } from './ArchiveCardInfo';
import { archiveDate, readTime } from '../common/Common';

const useStyles = makeStyles(() => createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-around',
        },
    }
));

interface Props {
    kind: ArchiveKind,
    archives: ArchiveLike[];
}

const ArchiveCards = ({kind, archives}: Props) => {
    const classes = useStyles();

    const spanCount = (index: number, screenSize: string) => {
        if (screenSize === 'sm') return 6;
        else if (screenSize === 'md') return index % 3 === 0 ? 6 : 3;
        else return index % 4 === 0 ? 6 : 2;
    };

    const style = (index: number, screenSize: string) => {
        if (screenSize === 'sm') return CardStyle.vertical;
        else if (screenSize === 'md') return index % 3 === 0 ? CardStyle.horizontal : CardStyle.vertical;
        else return index % 4 === 0 ? CardStyle.horizontal : CardStyle.vertical;
    };

    const cardFromArchive: (archive: ArchiveLike, index: number, screenSize: string) => ArchiveCardInfo = (archive, index, screenSize) => ({
        id: archive.key,
        link: archive.link,
        kind: archive.kind,
        title: archive.title,
        description: archive.description,
        author: archive.author,
        spanCount: spanCount(index, screenSize),
        thumbnail: archive.thumbnail || '',
        date: archiveDate(archive.created),
        style: style(index, screenSize),
        categories: archive.categories,
        readTime: readTime(archive.body),
    });

    const result = (size: string) => {
        const cards = archives.map((archive, index) => cardFromArchive(archive, index, size));
        return (
            <div className={classes.root}>
                <GridList
                    cellHeight={'auto'}
                    spacing={16}
                    cols={6}
                >
                    {cards.map((card) => (
                        <GridListTile key={card.id} cols={card.spanCount || 2}>
                            <ArchiveCard kind={kind} cardInfo={card}/>
                        </GridListTile>
                    ))}
                </GridList>
            </div>
        );
    };

    return (
        <div>
            <Hidden only={['md', 'lg', 'xl']} implementation="css">
                {result('sm')}
            </Hidden>
            <Hidden only={['xs', 'sm', 'lg', 'xl']} implementation="css">
                {result('md')}
            </Hidden>
            <Hidden only={['xs', 'sm', 'md']} implementation="css">
                {result('lg')}
            </Hidden>
        </div>
    );
};

export default ArchiveCards;
