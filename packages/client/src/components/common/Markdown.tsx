import * as React from 'react';
import { ReactNode } from 'react';
import { Components } from 'react-markdown/src/ast-to-react';
import ReactPlayer from 'react-player';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as darkCodeTheme from 'react-syntax-highlighter/dist/cjs/styles/prism/darcula';
import * as lightCodeTheme from 'react-syntax-highlighter/dist/cjs/styles/prism/ghcolors';
import { OpenGraphScrapeQueryKey, slugify } from '@tunji-web/common';
import OpenGraphCard from '../open-graph/OpenGraph';

import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import Typography from '@mui/material/Typography';
import { Alert as MuiAlert } from '@mui/material';
import Card from '@mui/material/Card';
import { useColorScheme } from '@mui/material/styles';
import { css } from '@emotion/react';
import Box from '@mui/material/Box';


export const MarkdownBody = {
    '& table': {
        'border-collapse': 'collapse',
    },
    '& thead': {
        padding: '16px',
        '&:not(:only-child)': {
            'border': '1px solid #ddd',
            'background': '#F0F3F4',
        },
    },
    '& tr': {
        '&:not(:only-child)': {
            'border': '1px solid #ddd'
        },
    },
    '& td': {
        padding: '16px',
        '& p, & li': {
            fontFamily: '"Muli", sans-serif',
            fontSize: '14px',
            letterSpacing: '0px',
            fontWeight: 'normal',
            lineHeight: '140%',
        }
    },
};

const SlugifiedTypography = (props: any) => {
    return <Typography id={`${slugify(idFromChildren(props.children))}`}  {...props}> {props.children}</Typography>;
};

const StyledParagraph = (props: any) => {
    return <Typography variant="body1" color={'textSecondary'} gutterBottom {...props}>
        {props.children}
    </Typography>;
};

const Alert = (props: any) => {
    return <Box sx={{display: 'flex', flexDirection: 'column', my: 2}}>
        <MuiAlert  {...props}></MuiAlert>
    </Box>;
};

const headerProps = (headerType: string) => ({
    gutterBottom: true,
    variant: headerType,
});

export const MarkdownComponents: Components = {
    table: ({node, ...props}) => <table{...props} style={{width: '100%'}}/>,
    img: ({node, ...props}) => <img{...props} style={
        {
            maxWidth: '100%',
            display: 'block',
            margin: '0 auto'
        }
    }/>,
    h1: ({node, ...props}) => {
        const merged = {...props, ...headerProps('h1')};
        return <SlugifiedTypography {...merged}/>;
    },
    h2: ({node, ...props}) => {
        const merged = {...props, ...headerProps('h2')};
        return <SlugifiedTypography {...merged}/>;
    },
    h3: ({node, ...props}) => {
        const merged = {...props, ...headerProps('h3')};
        return <SlugifiedTypography {...merged}/>;
    },
    h4: ({node, ...props}) => {
        const merged = {...props, ...headerProps('h4')};
        return <SlugifiedTypography {...merged}/>;
    },
    h5: ({node, ...props}) => {
        const merged = {...props, ...headerProps('h5')};
        return <SlugifiedTypography {...merged}/>;
    },
    h6: ({node, ...props}) => {
        const merged = {...props, ...headerProps('h6')};
        return <SlugifiedTypography {...merged}/>;
    },
    a: ({node, ...props}) => {
        const href = props['href'];
        if (!href && typeof href !== 'string') return <a{...props}/>;

        const url = href as string;

        const searchParams = new URLSearchParams(new URL(url).search);
        const openGraphUrl = searchParams.get(OpenGraphScrapeQueryKey) === 'true'
            ? url
            : undefined;

        const videoUrl = url.indexOf('youtube') >= 0 || url.indexOf('vimeo') >= 0 || url.indexOf('wistia') >= 0
            ? url
            : undefined;

        return openGraphUrl
            ? <OpenGraphCard url={openGraphUrl}/>
            : videoUrl
                ? <ReactPlayer
                    url={videoUrl}
                    width={'100%'}
                    controls={true}
                />
                : <a{...props}/>;
    },
    p: ({node, ...props}) => {
        const text = props.children.length > 0
            ? props.children[0].toString().toLowerCase()
            : '';
        if (text.indexOf('note:') === 0) return <Alert severity="info" {...props}></Alert>;
        if (text.indexOf('error:') === 0) return <Alert severity="error" {...props}></Alert>;
        if (text.indexOf('warning:') === 0) return <Alert severity="warning" {...props}></Alert>;
        if (text.indexOf('success:') === 0) return <Alert severity="success" {...props}></Alert>;

        return <StyledParagraph {...props}/>;
    },
    li: ({node, ...props}) => {
        return <Box component="li" sx={{mt: 1}}>
            <StyledParagraph {...props}/>
        </Box>;
    },
    code({node, inline, className, children, ...props}) {
        const classname = className as string;
        const match = /language-(\w+)/.exec(classname || '');
        const {mode, systemMode} = useColorScheme();
        const resolvedMode = (systemMode || mode) as 'light' | 'dark';
        const codeTheme = {
            light: lightCodeTheme.default,
            dark: darkCodeTheme.default,
        }[resolvedMode];
        return !inline && match
            ? <SyntaxHighlighter
                showLineNumbers={false}
                language={match[1]}
                style={codeTheme}
                PreTag="div"
                customStyle={{
                    display: 'block',
                    width: '100%',
                    margin: '0 auto',
                    padding: 16,
                }}
                codeTagProps={
                    {
                        style: {
                            lineHeight: 'inherit',
                            fontSize: 'inherit'
                        }
                    }
                }
                children={String(children).replace(/\n$/, '')} {...props} />
            : <code
                className={classname}
                children={children}
                style={{'font-weight': '300'}}
                {...props}
            />;
    },
    pre: ({node, ...props}) => {
        return <Box sx={{display: 'flex', flexDirection: 'column', my: 2}}>
            <Card
                sx={{
                    width: '100%',
                    padding: 0,
                }}>
            <pre
                style={{'margin': 0}}
                {...props}
            />
            </Card>
        </Box>;
    }
};

function idFromChildren(children: ReactNode[]): string {
    return children.length > 0 ? slugify(children.toString()) : '';
}

interface MarkdownProps {
    body?: string;
}

const BlogMarkdown: (props: MarkdownProps) => JSX.Element = ({body}) => {

    return (
        <ReactMarkdown
            css={css`${MarkdownBody}`}
            remarkPlugins={[gfm]}
            rehypePlugins={[rehypeRaw]}
            children={body || ''}
            components={MarkdownComponents}
        />
    );
};

export default BlogMarkdown;
