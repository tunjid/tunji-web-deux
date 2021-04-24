import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AppCard from "./HomeCard";
import { GridList, GridListTile } from "@material-ui/core";
import { ArchiveKind, ArchiveLike } from "../../common/Models";
import { CardInfo, CardStyle } from "../cards/CardInfo";
import { ArchiveActions } from "../../actions/Archive";

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
    description: archive.description,
    author: archive.author,
    spanCount: index % 4 === 0 ? 6 : 2,
    thumbnail: archive.thumbnail || '',
    date: archive.created.toDateString().split(' ').splice(1).join(' '),
    style: index % 4 === 0 ? CardStyle.horizontal : CardStyle.vertical,
    categories: archive.categories,
})

const archivesFromState: (state: StoreState) => ArchiveLike[] = (state: StoreState) => {
    switch (state.home.selectedTab.kind) {
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
            currentKind: state.home.selectedTab.kind,
            cards: archivesFromState(state).map(cardFromArchive)
        }
    }
);

const HomeCards = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {currentKind, cards}: Props = useSelector(selector, shallowEqual);

    useEffect(() => {
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
                        <AppCard kind={currentKind} cardInfo={card}/>
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}

export default HomeCards;
