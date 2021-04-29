import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { createSelector } from "reselect";
import { StoreState } from "../../types";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ArchiveCard from "../cards/ArchiveCard";
import { GridList, GridListTile } from "@material-ui/core";
import { ArchiveKind, ArchiveLike } from "../../common/Models";
import { ArchiveCardInfo, CardStyle } from "./ArchiveCardInfo";
import { ArchiveActions } from "../../actions/Archive";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { useWidth } from "../../hooks/UseWidth";
import { archiveDate, readTime } from "../archive/Common";
import { ArchiveState } from "../../reducers/Archive";

const useStyles = makeStyles(() => createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-around',
        },
        gridList: {
            width: `80%`,
            maxWidth: '1200px'
        },
    }
));

interface ArchiveSearchOptions {
    category?: string,
    from?: Date
    to?: Date
}

const DefaultSearchOptions: ArchiveSearchOptions = {}

interface Props {
    kind: ArchiveKind,
    searchOptions?: ArchiveSearchOptions,
}

interface State {
    currentKind: ArchiveKind,
    archives: ArchiveLike[];
}

const selector = (kind: ArchiveKind) => createSelector<StoreState, ArchiveState, State>(
    state => state.archives,
    (archiveState) => ({
        currentKind: kind,
        archives: archiveState.kindToArchivesMap[kind]
    })
);

const ArchiveCards = ({kind}: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {currentKind, archives}: State = useSelector(selector(kind), shallowEqual);

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

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({menuItems: []}));
        dispatch(ArchiveActions.fetchArchives(currentKind));
    }, [currentKind, dispatch]);

    return (
        <div className={classes.root}>
            <GridList
                className={classes.gridList}
                cellHeight={'auto'}
                spacing={16}
                cols={6}
            >
                {cards.map((card) => (
                    <GridListTile key={card.id} cols={card.spanCount || 2}>
                        <ArchiveCard kind={currentKind} cardInfo={card}/>
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}

export default ArchiveCards;