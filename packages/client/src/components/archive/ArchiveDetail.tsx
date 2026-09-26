import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { archiveDate, archiveSelector, readTime } from '../common/Common';
import { ArchiveActions } from '@tunji-web/client';
import ChipInput, { ChipType } from './ChipInput';
import { Helmet } from 'react-helmet';
import BlogMarkdown from '../common/Markdown';
import { useDeepEqualSelector } from '../../hooks/UseDeepEqualSelector';
import { ArchiveFile } from '@tunji-web/common';
import ReactPlayer from 'react-player';
import { PopulatedArchive } from '@tunji-web/client/src/models/PopulatedArchive';
import { DetailActions } from '@tunji-web/client/src/actions/Detail';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { TableOfContents } from '@tunji-web/client/src/components/common/TableOfContents';
import AppAppBar from '@tunji-web/client/src/blog/components/AppAppBar';
import LikeButton from '@tunji-web/client/src/components/like-button/LikeButton';
import ArchiveComments from './ArchiveComments';
import RelatedArchives from './RelatedArchives';

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
    archiveId?: string;
}

interface State {
    tocOpen: boolean;
}

const Header: (props: DetailProps) => React.JSX.Element = ({archive, archiveId}) => {

    // `showUrl` is only an SSR / no-JS fallback link (ReactPlayer is client-only). Hide it once mounted
    // so it never sits over the click-to-play thumbnail. `playing` lets the light-preview click start
    // playback in one tap.
    const [showUrl, setShowUrl] = useState(true);
    const [playing, setPlaying] = useState(false);
    useEffect(() => setShowUrl(false), []);

    const ssrVideoUrl = () => {
        return showUrl ? <a href={archive?.videoUrl}>Video link</a> : <div/>;
    };

    // Circular, semi-opaque backdrop so the play affordance reads against any thumbnail.
    const playIcon = (
        <Box
            sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                color: '#fff',
                transition: 'background-color 0.2s ease, transform 0.2s ease',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.72)',
                    transform: 'scale(1.05)',
                },
            }}
        >
            <PlayArrowRoundedIcon sx={{fontSize: 44}}/>
        </Box>
    );

    const heroContent = (archive?: PopulatedArchive) => {
        const element = archive?.videoUrl
            ? <div style={{
                width: '100%',
                aspectRatio: '16 / 9',
                // The video embed itself can't be a morph target (cross-origin iframes aren't captured
                // in view-transition snapshots), so name this persistent wrapper instead. With `light`
                // the hero shows the thumbnail until clicked, so the snapshot is the same image the card
                // morphs from. Same gate as the image branch; the two branches never render together.
                viewTransitionName: archive?.thumbnail ? `archive-image-${archiveId}` : 'none',
            }}>
                {ssrVideoUrl()}
                <ReactPlayer
                    url={archive?.videoUrl}
                    width={'100%'}
                    height={'100%'}
                    controls={true}
                    light={archive?.thumbnail || true}
                    playIcon={playIcon}
                    playing={playing}
                    onClickPreview={() => setPlaying(true)}
                />
            </div>
            : <CardMedia
                component="img"
                sx={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    objectFit: 'cover',
                    viewTransitionName: archive?.thumbnail ? `archive-image-${archiveId}` : 'none',
                }}
                image={archive?.thumbnail}
                alt={archive?.title}
            />;
        return <Card
            sx={{
                width: '100%',
                aspectRatio: '16 / 9',
                padding: 0,
            }}
        >
            {element}
        </Card>;
    };

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            alignItems: 'start',
        }}
    >
        <Typography gutterBottom variant="h3">
            {archive?.title || ''}
        </Typography>
        <Typography color="textSecondary" gutterBottom variant="h5">
            {archive?.description || ''}
        </Typography>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 2,
                alignItems: 'center',
            }}
        >
            <Avatar src={archive?.author?.imageUrl}/>
            <Typography component="p">
                {archive?.author?.fullName}
            </Typography>
            <Typography component="p" color="textSecondary">
                {archive ? `${archiveDate(archive?.created)} · ${readTime(archive?.body || '')}` : ''}
            </Typography>
        </Box>
        <ChipInput
            name="Categories: "
            type={ChipType.Category}
            kind={archive?.kind}
            chips={archive?.categories}
        />
        {heroContent(archive)}
    </Box>;
};

const ArchiveDetail = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const {
        isSignedIn,
        kind,
        archiveId,
        archive,
        archiveFiles
    } = useDeepEqualSelector(archiveSelector('detail', location.pathname));

    useEffect(() => {
        if (archiveId) dispatch(ArchiveActions.readArchive({kind, view: 'detail', id: archiveId}));
    }, [archiveId, dispatch, kind]);

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
        <div>
            <AppAppBar
                links={[
                    {title: 'Home', link: '/'},
                    {title: 'About', link: '/about'}
                ]}
            >
                <LikeButton
                    initialCount={archive.likes}
                    onClose={setLikes}
                />
            </AppAppBar>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', overflow: 'auto'}}>
                <Box sx={{flex: 1}}/>
                <Container
                    maxWidth="md"
                    component="main"
                    sx={{display: 'flex', flexGrow: 1, flexDirection: 'column', my: 16, gap: 4}}
                >
                    <Helmet>
                        <title>{archive?.title}</title>
                        <meta name="description" content={archive?.description}/>
                    </Helmet>
                    <Header key={archiveId} archive={archive} archiveId={archiveId}/>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                        <BlogMarkdown body={archive?.body}/>
                    </Box>
                    <ChipInput
                        name="Tags: "
                        type={ChipType.Tag}
                        kind={archive?.kind}
                        chips={archive?.tags}
                    />
                    <RelatedArchives archive={archive}/>
                    <ArchiveComments archive={archive}/>
                </Container>
                <Box sx={{flex: 1, my: 16}}>
                    <Box sx={{
                        position: 'fixed',
                        maxWidth: 200,
                        flexDirection: 'column',
                        display: {xs: 'none', sm: 'none', md: 'none', lg: 'block'}
                    }}>
                        <TableOfContents markdown={archive?.body || ''}/>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default ArchiveDetail;
