import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AppCard, { CardInfo, CardStyle } from "./HomeCard";
import { GridList, GridListTile } from "@material-ui/core";
import { ArchiveKind, fetchArchives } from "../../reducers/Archive";
import { ArchiveLike } from "../../../../common/Models";

const useStyles = makeStyles(() => createStyles({
        root: {
            display: 'flex',
            position: 'relative',
            justifyContent: 'space-around',
        },
        gridList: {
            width: `80vw`,
            "height": 'auto',
            "overflowY": 'auto',
        },
    }
));

interface Props {
    currentKind: ArchiveKind,
    cards: CardInfo[];
}

const cardFromArchive: (archive: ArchiveLike, index: number) => CardInfo = (archive, index) => ({
    id: archive.key,
    title: archive.title,
    body: archive.description,
    spanCount: index % 4 === 0 ? 6 : 2,
    thumbnail: archive.thumbnail || '',
    date: archive.created.toDateString(),
    style: index % 4 === 0 ? CardStyle.horizontal : CardStyle.vertical,
    categories: archive.categories,
})

const archivesFromState: (state: StoreState) => ArchiveLike[] = (state: StoreState) => {
    switch (state.persistentUI.selectedTab.kind) {
        case ArchiveKind.Articles: {
            return state.articles.archives;
        }
        case ArchiveKind.Projects: {
            return state.projects.archives;
        }
        case ArchiveKind.Talks: {
            return state.talks.archives;
        }
        default: {
            return [];
        }
    }
};
const selector: OutputSelector<StoreState, Props, (res: StoreState) => Props> = createSelector(
    state => state,
    (state: StoreState) => {
        return {
            currentKind: state.persistentUI.selectedTab.kind,
            cards: archivesFromState(state).map(cardFromArchive)
        }
    }
);

const HomeCards = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {currentKind, cards}: Props = useSelector(selector, shallowEqual);

    useEffect(() => {
        dispatch(fetchArchives(currentKind));
    }, [currentKind, dispatch]);

    return (
        <div className={classes.root}>
            <GridList
                className={classes.gridList}
                cellHeight={'auto'}
                spacing={8}
                cols={6}
            >
                {cards.map((card) => (
                    <GridListTile key={card.id} cols={card.spanCount || 2}>
                        <AppCard cardInfo={card}/>
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}

export default HomeCards;
