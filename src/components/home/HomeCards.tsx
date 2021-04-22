import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import { shallowEqual, useSelector } from "react-redux";
import AppCard, { CardInfo } from "./HomeCard";
import { GridList, GridListTile } from "@material-ui/core";

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

const cardsFromState: (state: StoreState) => CardInfo[] = (state: StoreState) => {
    switch (state.persistentUI.selectedTab.route) {
        case 'projects': {
            return state.projects.cards;
        }
        default: {
            return [];
        }
    }
};
const selector: OutputSelector<StoreState, Props, (res: StoreState) => Props> = createSelector(
    state => state,
    (state: StoreState) => {
        return {cards: cardsFromState(state)}
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
                cols={3}
            >
                {cards.map((card) => (
                    <GridListTile key={card.id} cols={card.spanCount || 1}>
                        <AppCard cardInfo={card}/>
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}

export default HomeCards;
