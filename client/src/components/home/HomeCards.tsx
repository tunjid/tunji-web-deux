import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import { shallowEqual, useSelector } from "react-redux";
import AppCard, { CardInfo, CardStyle } from "./HomeCard";
import { GridList, GridListTile } from "@material-ui/core";
import { ArchiveKind } from "../../reducers/Archive";
import { Archive } from "../../../../server/models/Archive";

const useStyles = makeStyles(() => createStyles({
        root: {
            display: 'flex',
            position:'relative',
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
    cards: CardInfo[];
}

const cardFromArchive: (archive: Archive) => CardInfo = (archive) => ({
    id: archive._id,
    title: archive.title,
    body: archive.body,
    thumbnail: archive.thumbnail || '',
    date: archive.created.toDateString(),
    style: CardStyle.horizontal,
    categories: archive.categories,
})

const cardsFromState: (state: StoreState) => Archive[] = (state: StoreState) => {
    switch (state.persistentUI.selectedTab.kind) {
        case ArchiveKind.Article: {
            return state.articles.cards;
        }
        case ArchiveKind.Project: {
            return state.projects.cards;
        }
        case ArchiveKind.Talk: {
            return state.talks.cards;
        }
        default: {
            return [];
        }
    }
};
const selector: OutputSelector<StoreState, Props, (res: StoreState) => Props> = createSelector(
    state => state,
    (state: StoreState) => {
        return {cards: cardsFromState(state).map(cardFromArchive)}
    }
);

const HomeCards = () => {
    const classes = useStyles();
    const {cards}: Props = useSelector(selector, shallowEqual);

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
