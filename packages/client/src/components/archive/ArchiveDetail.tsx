import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Avatar, CircularProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import { PersistentUiActions } from '../../actions/PersistentUi';
import { theme } from '../../styles/PersistentUi';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import ReactMarkdown from 'react-markdown';
import { archiveDate, archiveSelector, capitalizeFirst, readTime, responsiveWidth } from '../common/Common';
import { ArchiveActions } from '@tunji-web/client';
import gfm from 'remark-gfm';
import EditIcon from '@material-ui/icons/Edit';
import ChipInput, { ChipType } from './ChipInput';
import { horizontalMargin, verticalMargin } from '../../styles/Common';
import { Helmet } from 'react-helmet';
import { MarkdownBody, MarkdownComponents } from '../common/Markdown';
import { useDeepEqualSelector } from '../../hooks/UseDeepEqualSelector';
import LikeButton from '@tunji-web/client/src/components/like-button/LikeButton';
import { useWidth } from '@tunji-web/client/src/hooks/UseWidth';
import { ArchiveFile, ArchiveLike } from '@tunji-web/common';
import ReactPlayer from 'react-player';
import rehypeRaw from 'rehype-raw';

const useStyles = makeStyles((theme) => createStyles({
        root: {
            ...verticalMargin(theme.spacing(2)),
        },
        split: {},
        sideBar: {
            display: 'flex',
            position: 'fixed',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            alignContent: 'flex-start',
            ...horizontalMargin(theme.spacing(8)),
            ...verticalMargin(theme.spacing(16)),
        },
        content: {
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ...verticalMargin(theme.spacing(2)),
        },
        title: {
            ...responsiveWidth(theme),
            ...verticalMargin(theme.spacing(1)),
        },
        description: {
            ...responsiveWidth(theme),
            'margin-bottom': theme.spacing(1),
        },
        info: {
            ...responsiveWidth(theme),
            ...verticalMargin(theme.spacing(1)),
            display: 'flex',
            alignItems: 'flex-start',
        },
        infoChild: {
            ...horizontalMargin(theme.spacing(1)),
        },
        avatar: {
            width: theme.spacing(3),
            height: theme.spacing(3),
        },
        chipContainer: {
            ...responsiveWidth(theme),
            ...verticalMargin(theme.spacing(0.5)),
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
        },
        smallLikeButton: {
            ...responsiveWidth(theme),
            ...verticalMargin(theme.spacing(0.5)),
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'flex-start',
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
            ...MarkdownBody,
        },
    }
));

const fileToStyleSheet : (file: ArchiveFile) => HTMLLinkElement = file => {
    const sheet = document.createElement('link');
    sheet.rel  = 'stylesheet';
    sheet.href = file.url;
    sheet.type = file.mimetype;

    return sheet;
}

const fileToScript : (file: ArchiveFile) => HTMLScriptElement = file => {
    const script = document.createElement('script');
    script.async = true;
    script.src = file.url;
    script.type = file.mimetype;
    return script;
}

function scriptsAbsentFromDOM(archiveFiles: any) {
    const existingScriptSources = new Set<string>();
    for (let i = 0; i < document.scripts.length; i++) {
        const script = document.scripts.item(i);
        if (script) existingScriptSources.add(script.src);
    }

    const scriptsToAdd = archiveFiles
        ?.filter(file => file.mimetype === 'text/javascript' && !existingScriptSources.has(file.url))
        ?.map(fileToScript);
    return scriptsToAdd;
}

function styleSheetsAbsentFromDOM(archiveFiles: any) {
    const existingStyleSheets = document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]');
    const existingStyleSheetRefs = new Set<string>();
    for (let i = 0; i < existingStyleSheets.length; i++) {
        const sheet = existingStyleSheets.item(i);
        if (sheet) existingStyleSheetRefs.add(sheet.href);
    }

    const styleSheetsToAdd = archiveFiles
        ?.filter(file => file.mimetype === 'text/css' && !existingStyleSheetRefs.has(file.url))
        ?.map(fileToStyleSheet);
    return styleSheetsToAdd;
}

const ArchiveDetail = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {isSignedIn, kind, archiveId, archive, archiveFiles} = useDeepEqualSelector(archiveSelector('detail'));

    const width = useWidth();
    const isxSmallScreen = /xs/.test(width);
    const isSmallScreen = /sm/.test(width);
    const isSmallOrLess = isxSmallScreen || isSmallScreen;

    useEffect(() => {
        if (archiveId) dispatch(ArchiveActions.readArchive({kind, view: 'detail', id: archiveId}));
    }, [archiveId, dispatch, kind]);

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
            appBarTitle: `${capitalizeFirst(kind).slice(0, -1)} Detail`,
            hasAppBarShadow: true,
            hasAppBarSpacer: true,
            hasHomeIcon: true,
            appBarColor: theme.palette.primary.dark,
            fab: isSignedIn ? {
                id: 'edit',
                text: 'Edit',
                icon: <EditIcon/>,
                action: PersistentUiActions.menuRoute(`/${kind}/${archiveId}/edit`)
            } : undefined
        }));
    }, [archiveId, kind, isSignedIn, dispatch]);

    useEffect(() => {
        const scriptsToAdd = scriptsAbsentFromDOM(archiveFiles);
        scriptsToAdd?.forEach(script => document.body.appendChild(script));

        const styleSheetsToAdd = styleSheetsAbsentFromDOM(archiveFiles);
        styleSheetsToAdd?.forEach(sheet => document.head.appendChild(sheet));

        return () => {
            scriptsToAdd?.forEach(script => document.body.removeChild(script));
            styleSheetsToAdd?.forEach(sheet => document.head.removeChild(sheet));
        };
    }, [archiveFiles]);

    const setLikes: (count: number) => void = (count) => {
        dispatch(ArchiveActions.incrementArchiveLikes({
            id: archive.id,
            kind,
            increment: count
        }));
    };

    const conditionalLikeButton = (show: Boolean) => {
        return show ? <LikeButton
            initialCount={archive.likes}
            onClose={setLikes}
        /> : <div/>;
    };
    const [showUrl, setShowUrl] = useState(true);
    const onPlayerReady = () => setShowUrl(false);

    const ssrVideoUrl = () => {
        return showUrl ? <a href={archive?.videoUrl}>Video link</a> : <div/>;
    };

    const heroContent = (archive?: ArchiveLike) => {
        return archive?.videoUrl ? <div className={classes.cardBackground}>
            {ssrVideoUrl()}
            <ReactPlayer
                url={archive?.videoUrl}
                width={'100%'}
                controls={true}
                onReady={onPlayerReady}
            />
        </div> : <Card className={classes.cardBackground} elevation={1}>
            <CardMedia
                className={classes.cardImage}
                image={archive?.thumbnail}
                title={archive?.title}
            />
        </Card>;
    };
    return (
        <div className={classes.root}>
            <div className={classes.sideBar}>
                {conditionalLikeButton(!isSmallOrLess)}
            </div>
            <div className={classes.content}>
                <Helmet>
                    <title>{archive?.title}</title>
                    <meta name="description" content={archive?.description}/>
                </Helmet>
                <Typography className={classes.title} gutterBottom variant="h3">
                    {archive?.title || ''}
                </Typography>
                <Typography className={classes.description} color="textSecondary" gutterBottom variant="h5">
                    {archive?.description || ''}
                </Typography>

                <div className={classes.info}>
                    <Avatar className={classes.avatar} src={archive?.author?.imageUrl}/>

                    <Typography className={classes.infoChild} component="p">
                        {archive?.author?.fullName}
                    </Typography>

                    <Typography className={classes.infoChild} gutterBottom component="p" color="textSecondary">
                        {archive ? `${archiveDate(archive?.created)} · ${readTime(archive?.body || '')}` : ''}
                    </Typography>
                </div>


                <div className={classes.chipContainer}>
                    <ChipInput
                        name="Categories: "
                        type={ChipType.Category}
                        kind={archive?.kind}
                        chips={archive?.categories}
                    />
                </div>

                {heroContent(archive)}

                <ReactMarkdown
                    className={classes.archiveBody}
                    remarkPlugins={[gfm]}
                    rehypePlugins={[rehypeRaw]}
                    children={archive?.body || ''}
                    components={MarkdownComponents}
                />

                <div className={classes.chipContainer}>
                    <ChipInput
                        name="Tags: "
                        type={ChipType.Tag}
                        kind={archive?.kind}
                        chips={archive?.tags}
                    />
                </div>
                <div className={classes.smallLikeButton}>
                    {conditionalLikeButton(isSmallOrLess)}
                </div>
            </div>
        </div>
    );
};

export default ArchiveDetail;
