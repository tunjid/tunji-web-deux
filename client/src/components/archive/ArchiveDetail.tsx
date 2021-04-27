import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { Chip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { theme } from "../../styles/PersistentUi";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import ReactMarkdown from 'react-markdown'
import { archiveSelector } from "./Common";
import { ArchiveActions } from "../../actions/Archive";
import gfm from "remark-gfm";

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
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
            'align-items': 'center',
            '& > *': {
                margin: theme.spacing(0.5),
            },
        },
        cardBackground: {
            height: '50vh',
            width: '50vw',
            margin: theme.spacing(0.5),
        },
        cardImage: {
            height: '50vh',
            width: '50vw',
        },
        archiveBody: {
            width: '50vw',
        },
    }
));

const ArchiveDetail = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {isSignedIn, kind, archiveId, archive} = useSelector(archiveSelector('detail'), shallowEqual);

    useEffect(() => {
        dispatch(ArchiveActions.readArchive({kind, view: "detail", id: archiveId}));
    }, [archiveId, dispatch, kind]);

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
            hasAppBarShadow: true,
            hasAppBarSpacer: true,
            appBarColor: theme.palette.primary.dark,
            menuItems: isSignedIn ? [{
                id: 'edit',
                text: 'Edit',
                action: PersistentUiActions.menuRoute(`/${kind}/${archiveId}/edit`)
            }] : []
        }));
    }, [archiveId, kind, isSignedIn, dispatch]);

    return (
        <div className={classes.root}>
            <Typography className={classes.date} gutterBottom variant="subtitle1">
                {archive?.created?.toDateString() || ''}
            </Typography>
            Categories
            <div className={classes.chips}>
                {(archive?.categories || []).map((label) => <Chip
                    key={label}
                    label={label}
                    color="secondary"
                    style={{backgroundColor: '#4282F1'}}
                    size="small"/>
                )}
            </div>
            Tags
            <div className={classes.chips}>
                {(archive?.tags || []).map((label) => <Chip
                    key={label}
                    label={label}
                    color="secondary"
                    style={{backgroundColor: theme.palette.secondary.dark}}
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
            <ReactMarkdown
                className={classes.archiveBody}
                remarkPlugins={[gfm]}
                children={archive?.body || ''}
                components={{
                    img: ({node, ...props}) => (<img{...props} style={{maxWidth: '10vw'}}/>),
                    p: ({node, ...props}) => (<p{...props} style={{fontSize: '150%'}}/>),
                    li: ({node, ...props}) => (<p{...props} style={{fontSize: '150%'}}/>),
                    h1: ({node, ...props}) => (<h1{...props} style={{fontSize: '150%'}}/>),
                    h2: ({node, ...props}) => (<h2{...props} style={{fontSize: '150%'}}/>),
                    h3: ({node, ...props}) => (<h3{...props} style={{fontSize: '150%'}}/>),
                    h4: ({node, ...props}) => (<h4{...props} style={{fontSize: '150%'}}/>),
                    h5: ({node, ...props}) => (<h5{...props} style={{fontSize: '150%'}}/>),
                    h6: ({node, ...props}) => (<h6{...props} style={{fontSize: '150%'}}/>),
                }}
            />
        </div>
    );
}

export default ArchiveDetail;
