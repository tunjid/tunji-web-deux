import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { Avatar, Chip, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { theme } from "../../styles/PersistentUi";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import ReactMarkdown from 'react-markdown'
import { archiveDate, archiveSelector, readTime } from "./Common";
import { ArchiveActions } from "../../actions/Archive";
import gfm from "remark-gfm";
import EditIcon from '@material-ui/icons/Edit';

const responsiveWidth = (theme: Theme) => ({
    [theme.breakpoints.up('md')]: {
        width: '50vw',
    },
    width: '80vw',
});

const useStyles = makeStyles((theme) => createStyles({
        root: {
            display: 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
        },
        title: {
            ...responsiveWidth(theme),
            'margin-top': theme.spacing(3),
            'margin-bottom': theme.spacing(1),
        },
        description: {
            ...responsiveWidth(theme),
            'margin-bottom': theme.spacing(1),
        },
        info: {
            ...responsiveWidth(theme),
            display: 'flex',
            'align-items': 'flex-start',
            'margin-top': theme.spacing(1),
            'margin-bottom': theme.spacing(1),
        },
        infoChild: {
            'margin-left': theme.spacing(1),
            'margin-right': theme.spacing(1),
        },
        avatar: {
            width: theme.spacing(3),
            height: theme.spacing(3),
        },
        chips: {
            ...responsiveWidth(theme),
            display: 'flex',
            flexWrap: 'wrap',
            'align-items': 'center',
            '& > *': {
                margin: theme.spacing(0.5),
            },
            'margin-top': theme.spacing(0.5),
            'margin-bottom': theme.spacing(0.5),
        },
        cardBackground: {
            ...responsiveWidth(theme),
            height: '50vh',
            margin: theme.spacing(0.5),
        },
        cardImage: {
            ...responsiveWidth(theme),
            height: '50vh',
        },
        archiveBody: {
            ...responsiveWidth(theme),
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
            appBarTitle: `${kind.charAt(0).toUpperCase() + kind.slice(1, kind.length - 1)} Detail`,
            hasAppBarShadow: true,
            hasAppBarSpacer: true,
            appBarColor: theme.palette.primary.dark,
            fab: isSignedIn ? {
                id: 'edit',
                text: 'Edit',
                icon: <EditIcon/>,
                action: PersistentUiActions.menuRoute(`/${kind}/${archiveId}/edit`)
            } : undefined
        }));
    }, [archiveId, kind, isSignedIn, dispatch]);

    return (
        <div className={classes.root}>
            <Typography className={classes.title} gutterBottom variant="h3">
                {archive?.title || ''}
            </Typography>
            <Typography className={classes.description} color="textSecondary" gutterBottom variant="h5">
                {archive?.description || ''}
            </Typography>

            <div className={classes.info}>
                <Avatar className={classes.avatar} src={archive.author.imageUrl}/>

                <Typography className={classes.infoChild} component="p">
                    {archive.author.fullName}
                </Typography>

                <Typography className={classes.infoChild} gutterBottom component="p" color="textSecondary">
                    {`${archiveDate(archive?.created)} · ${readTime(archive?.body || '')}`}
                </Typography>
            </div>


            <div className={classes.chips}>
                Categories:
                {(archive?.categories || []).map((label) => <Chip
                    key={label}
                    label={label}
                    color="secondary"
                    style={{backgroundColor: '#4282F1'}}
                    size="small"/>
                )}
            </div>

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

            <div className={classes.chips}>
                Tags:
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
