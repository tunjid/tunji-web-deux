import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from "react-router-dom";
import { ArchiveLike, UserLike } from "../../../../common/Models";
import axios from "axios";
import { Chip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { theme } from "../../styles/PersistentUi";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import ReactMarkdown from 'react-markdown'
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import { PersistentUiState } from "../../reducers/PersistentUi";
import { HomeState } from "../../reducers/Home";

const gfm = require('remark-gfm')

const useStyles = makeStyles((theme) => createStyles({
        root: {
            display: 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
            'justify-content': 'center',
        },
        date: {
            'margin-top': theme.spacing(4),
            'margin-bottom': theme.spacing(2),
        },
        title: {
            margin: theme.spacing(2),
        },
        categories: {
            display: 'flex',
            flexWrap: 'wrap',
            'align-items': 'center',
            '& > *': {
                margin: theme.spacing(0.5),
            },
        },
        cardBackground: {
            height: '50vh',
            width: '90vw',
            margin: theme.spacing(0.5),
        },
        cardImage: {
            height: '50vh',
            width: '90vw',
        },
        archiveBody: {
            width: '60vw',
        },
    }
));

interface ArchiveDetailParams {
    archiveId: string
}

interface Props {
    isSignedIn: boolean;
}

const selector: OutputSelector<StoreState, Props, (a: UserLike) => Props> = createSelector(
    state => state.auth.signedInUser,
    (signedInUser) => ({
        isSignedIn: signedInUser !== undefined,
    })
);

const ArchiveDetail = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {pathname} = useLocation();
    const {archiveId} = useParams<ArchiveDetailParams>();
    const [archive, setArchive] = useState<ArchiveLike>();
    const {isSignedIn} = useSelector(selector, shallowEqual);

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
            hasAppBarShadow: true,
            hasAppBarSpacer: true,
            appBarColor: theme.palette.primary.dark,
            menuItems: isSignedIn ? [{id: 'edit', text: 'Edit'}] : []
        }));
        const fetch = async () => {
            const response = await axios.get<ArchiveLike>(`/api${pathname}`);
            const status = response.status;
            if (status < 200 || status > 399) return;
            setArchive({...response.data, created: new Date(response.data.created)})
        }
        fetch();
    }, [archiveId, isSignedIn, dispatch, pathname]);

    return (
        <div className={classes.root}>
            <Typography className={classes.date} gutterBottom variant="subtitle1">
                {archive?.created?.toDateString() || ''}
            </Typography>
            <div className={classes.categories}>
                {(archive?.categories || []).map((label) => <Chip
                    key={label}
                    label={label}
                    color="secondary"
                    style={{backgroundColor: '#4282F1'}}
                    size="small"/>
                )}
            </div>
            <Typography className={classes.title} gutterBottom variant="h2">
                {archive?.title || ''}
            </Typography>
            <Card className={classes.cardBackground} elevation={1}>
                <CardMedia
                    className={classes.cardImage}
                    image={archive?.thumbnail}
                    title={archive?.title}
                />
            </Card>
            <ReactMarkdown className={classes.archiveBody} remarkPlugins={[gfm]} children={archive?.body || ''}/>
            <div className={classes.categories}>
                {(archive?.tags || []).map((label) => <Chip
                    key={label}
                    label={label}
                    color="secondary"
                    style={{backgroundColor: theme.palette.secondary.dark}}
                    size="small"/>
                )}
            </div>
        </div>
    );
}

export default ArchiveDetail;
