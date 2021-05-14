import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import ArchiveCard from "../cards/ArchiveCard";
import { GridList, GridListTile } from "@material-ui/core";
import { ArchiveKind, ArchiveLike } from "../../client-server-common/Models";
import { ArchiveCardInfo, CardStyle } from "./ArchiveCardInfo";
import { useWidth } from "../../hooks/UseWidth";
import { archiveDate, readTime } from "../common/Common";

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

    const width = useWidth();
    const isxSmallScreen = /xs/.test(width);
    const isSmallScreen = /sm/.test(width);

    const spanCount = (index: number) => {
        if (isxSmallScreen) return 6;
        else if (isSmallScreen) return index % 3 === 0 ? 6 : 3
        else return index % 4 === 0 ? 6 : 2;
    }

    const style = (index: number) => {
        if (isxSmallScreen) return CardStyle.vertical;
        else if (isSmallScreen) return index % 3 === 0 ? CardStyle.horizontal : CardStyle.vertical
        else return index % 4 === 0 ? CardStyle.horizontal : CardStyle.vertical;
    }

    const cardFromArchive: (archive: ArchiveLike, index: number) => ArchiveCardInfo = (archive, index) => ({
        id: archive.key,
        link: archive.link,
        kind: archive.kind,
        title: archive.title,
        description: archive.description,
        author: archive.author,
        spanCount: spanCount(index),
        thumbnail: archive.thumbnail || '',
        date: archiveDate(archive.created),
        style: style(index),
        categories: archive.categories,
        readTime: readTime(archive.body),
    })

    const cards = archives.map(cardFromArchive);

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
}

export default ArchiveCards;
