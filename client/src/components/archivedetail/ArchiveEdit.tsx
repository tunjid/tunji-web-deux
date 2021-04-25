import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from "react-router-dom";
import { ArchiveKind, ArchiveLike, UserLike } from "../../common/Models";
import { Chip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { theme } from "../../styles/PersistentUi";
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import ApiService from "../../rest/ApiService";
import MEDitor from '@uiw/react-md-editor';
import { ArchiveActions } from "../../actions/Archive";

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
        editor: {
            height: '100vh',
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

interface ArchiveEditParams {
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

const ArchiveEdit = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {pathname} = useLocation();
    const {archiveId} = useParams<ArchiveEditParams>();
    const [archive, setArchive] = useState<ArchiveLike>();
    const {isSignedIn} = useSelector(selector, shallowEqual);

    const random = Math.random();
    console.log(`Random: ${random}; Render. ${!!archive}`);

    const c = () => archive;

    const onNewText = (markdown: string | undefined) => {
        console.log(`On change. ${markdown}; archive? ${!!archive}; random: ${random}; aaaa:${!!c()}`);

        if (archive) setArchive({...archive, body: markdown || ''})
    }

    useEffect(() => {
        const path = `/${pathname.split('/')[1]}/${archiveId}`;
        const fetch = async () => {
            const response = await ApiService.fetchArchive(path);
            const status = response.status;
            if (status < 200 || status > 399) return;
            setArchive({...response.data, created: new Date(response.data.created)})
        }
        fetch();
    }, [archiveId, isSignedIn, pathname]);


    useEffect(() => {
        console.log(`ARCHIVE CHANGED: ${archive?.body}`);
        dispatch(PersistentUiActions.modifyAppBar({
            hasAppBarShadow: true,
            hasAppBarSpacer: true,
            appBarColor: theme.palette.primary.dark,
            menuItems: isSignedIn ? [{
                id: 'save',
                text: 'Save',
                action: ArchiveActions.saveArchive(archive)
            }] : []
        }));
    }, [archive, isSignedIn, dispatch]);



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

            <MEDitor
                className={classes.editor}
                value={archive?.body || 'llllllll'}
                onChange={onNewText}
            />
            {/*<MEDditor.Markdown source={value} />*/}

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

export default ArchiveEdit;
