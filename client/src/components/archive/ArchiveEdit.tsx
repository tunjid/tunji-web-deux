import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { Chip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { theme } from "../../styles/PersistentUi";
import MEDitor from '@uiw/react-md-editor';
import { ArchiveActions } from "../../actions/Archive";
import { archiveSelector } from "./Common";

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

const ArchiveEdit = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {isSignedIn, kind, archiveId, archive} = useSelector(archiveSelector('edit'), shallowEqual);

    const onNewText = (markdown: string | undefined) => {
        dispatch(ArchiveActions.editArchive({kind, body: markdown || ''}));
    }

    useEffect(() => {
        dispatch(ArchiveActions.fetchArchive({kind, view: "edit", id: archiveId}));
    }, [archiveId, dispatch, kind]);

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
            hasAppBarShadow: true,
            hasAppBarSpacer: true,
            appBarColor: theme.palette.primary.dark,
            menuItems: isSignedIn ? [{
                id: 'save',
                text: 'Save',
                action: ArchiveActions.saveArchive(kind)
            }] : []
        }));
    }, [kind, isSignedIn, dispatch]);

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
                value={archive.body || ''}
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
