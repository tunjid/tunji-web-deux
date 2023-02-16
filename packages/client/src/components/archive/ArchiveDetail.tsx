import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Avatar, Drawer } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import { PersistentUiActions } from '../../actions/PersistentUi';
import { theme } from '../../styles/PersistentUi';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import { archiveDate, archiveSelector, capitalizeFirst, readTime, responsiveWidth } from '../common/Common';
import { ArchiveActions, StoreState } from '@tunji-web/client';
import EditIcon from '@material-ui/icons/Edit';
import ChipInput, { ChipType } from './ChipInput';
import { horizontalMargin, horizontalPadding, verticalMargin } from '../../styles/Common';
import { Helmet } from 'react-helmet';
import BlogMarkdown from '../common/Markdown';
import { useDeepEqualSelector } from '../../hooks/UseDeepEqualSelector';
import LikeButton from '@tunji-web/client/src/components/like-button/LikeButton';
import { useWidth } from '@tunji-web/client/src/hooks/UseWidth';
import { ArchiveFile } from '@tunji-web/common';
import ReactPlayer from 'react-player';
import { TableOfContents } from '@tunji-web/client/src/components/common/TableOfContents';
import { PopulatedArchive } from '@tunji-web/client/src/models/PopulatedArchive';
import { createSelector } from 'reselect';
import { DetailState } from '@tunji-web/client/src/reducers/Detail';
import { DetailActions } from '@tunji-web/client/src/actions/Detail';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            a: responsiveWidth(theme),
            ...verticalMargin(theme.spacing(2)),
            ...horizontalPadding(theme.spacing(2)),
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
            },
        },
        fixedContent: {
            margin: 'auto',
            position: 'fixed'
        },
        content: {
            margin: 'auto',
            display: 'flex',
            width: '100%',
            maxWidth: '800px',
            flex: 'auto',
            flexDirection: 'column',
            alignItems: 'center',
            ...horizontalPadding(theme.spacing(2)),
            ...verticalMargin(theme.spacing(2)),
        },
        tableOfContentsColumn: {
            position: 'sticky',
            top: '100px',
            flex: '1',
            height: '100%',
            'overflow-y': 'visible',
            ...verticalMargin(theme.spacing(4)),
        },
        title: {
            width: '100%',
            ...verticalMargin(theme.spacing(1)),
        },
        description: {
            width: '100%',
            'margin-bottom': theme.spacing(1),
        },
        info: {
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            ...verticalMargin(theme.spacing(1)),
        },
        infoChild: {
            ...horizontalPadding(theme.spacing(1)),
        },
        avatar: {
            width: theme.spacing(3),
            height: theme.spacing(3),
        },
        chipContainer: {
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            ...verticalMargin(theme.spacing(0.5)),
        },
        smallLikeButton: {
            ...verticalMargin(theme.spacing(0.5)),
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        largeLikeButtonContainer: {
            ...verticalMargin(theme.spacing(0.5)),
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyItems: 'center'
        },
        cardBackground: {
            height: '50vh',
            margin: theme.spacing(0.5),
        },
        cardImage: {
            height: '50vh',
        },
        archiveBody: {
        },
    }
));

const fileToStyleSheet: (file: ArchiveFile) => HTMLLinkElement = file => {
    const sheet = document.createElement('link');
    sheet.rel = 'stylesheet';
    sheet.href = file.url;
    sheet.type = file.mimetype;

    return sheet;
};

const fileToScript: (file: ArchiveFile) => HTMLScriptElement = file => {
    const script = document.createElement('script');
    script.src = file.url;
    script.type = file.mimetype;
    return script;
};

function scriptsAbsentFromDOM(archiveFiles: ArchiveFile[]) {
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

function domScriptsIn(archiveFiles: ArchiveFile[]): HTMLScriptElement[] {
    if (!archiveFiles) return [];
    const result: HTMLScriptElement[] = [];
    const scriptSources = new Set<string>();
    archiveFiles
        ?.filter(file => file.mimetype === 'text/javascript')
        ?.map(file => file.url)
        ?.forEach(url => scriptSources.add(url));

    for (let i = 0; i < document.scripts.length; i++) {
        const script = document.scripts.item(i);
        if (script && scriptSources.has(script.src)) result.push(script);
    }

    return result;
}

function styleSheetsAbsentFromDOM(archiveFiles: ArchiveFile[]) {
    if (!archiveFiles) return [];
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

function domStyleSheetsIn(archiveFiles: ArchiveFile[]): HTMLLinkElement[] {
    const result: HTMLLinkElement[] = [];
    const sheetSources = new Set<string>();
    archiveFiles
        ?.filter(file => file.mimetype === 'text/css')
        ?.map(file => file.url)
        ?.forEach(url => sheetSources.add(url));

    const existingStyleSheets = document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]');
    for (let i = 0; i < existingStyleSheets.length; i++) {
        const styleSheet = existingStyleSheets.item(i);
        if (styleSheet && sheetSources.has(styleSheet.href)) result.push(styleSheet);
    }

    return result;
}

interface DetailProps {
    archive?: PopulatedArchive;
}

interface State {
    tocOpen: boolean;
}

const selector = createSelector<StoreState, DetailState, State>(
    state => state.detail,
    (detail) => ({
        tocOpen: detail.tocOpen,
    })
);

const Header: (props: DetailProps) => JSX.Element = ({archive}) => {
    const classes = useStyles();

    const [showUrl, setShowUrl] = useState(true);
    const onPlayerReady = () => setShowUrl(false);

    const ssrVideoUrl = () => {
        return showUrl ? <a href={archive?.videoUrl}>Video link</a> : <div/>;
    };

    const heroContent = (archive?: PopulatedArchive) => {
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

    return <div>
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
    </div>;
};

const Body: (props: DetailProps) => JSX.Element = ({archive}) => {
    const classes = useStyles();
    return <div>
        <BlogMarkdown body={archive?.body}/>
        <div className={classes.chipContainer}>
            <ChipInput
                name="Tags: "
                type={ChipType.Tag}
                kind={archive?.kind}
                chips={archive?.tags}
            />
        </div>
    </div>;
};

const ArchiveDetail = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {isSignedIn, kind, archiveId, archive, archiveFiles} = useDeepEqualSelector(archiveSelector('detail'));

    const {tocOpen} = useDeepEqualSelector(selector);
    const closeDrawer = () => dispatch(DetailActions.toggleToc());

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
            menuItems: isSmallOrLess ? [{
                id: 'contents',
                text: '',
                icon: <MenuIcon/>,
                action: DetailActions.toggleToc(),
            }] : [],
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
            domScriptsIn(archiveFiles)?.forEach(script => document.body.removeChild(script));
            domStyleSheetsIn(archiveFiles)?.forEach(sheet => document.head.removeChild(sheet));
        };
    }, [archiveFiles]);

    useEffect(() => {
        return () => {
            dispatch(DetailActions.toggleToc(false));
        };
    }, [dispatch]);

    const setLikes: (count: number) => void = (count) => {
        dispatch(ArchiveActions.incrementArchiveLikes({
            id: archive.id,
            kind,
            increment: count
        }));
    };

    return (
        isSmallOrLess
            ? <div className={classes.root}>
                <Header archive={archive}/>
                <Body archive={archive}/>
                <div className={classes.smallLikeButton}>
                    <LikeButton
                        initialCount={archive.likes}
                        onClose={setLikes}
                    />
                </div>
                <Drawer
                    anchor="right"
                    open={isSmallOrLess && tocOpen}
                    onClose={closeDrawer}>
                    <TableOfContents markdown={archive?.body || ''}/>
                </Drawer>
            </div>
            : <div className={classes.root}>
                <div className={classes.tableOfContentsColumn}>
                    <div className={classes.largeLikeButtonContainer}>
                        <LikeButton
                            initialCount={archive.likes}
                            onClose={setLikes}
                        />
                    </div>
                </div>
                <div className={classes.content}>
                    <Header archive={archive}/>
                    <Body archive={archive}/>
                </div>
                <div className={classes.tableOfContentsColumn}>
                    <TableOfContents markdown={archive?.body || ''}/>
                </div>
            </div>
    );
};

export default ArchiveDetail;
