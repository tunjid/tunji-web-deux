import * as React from 'react';
import { ReactNode } from 'react';
import { Components } from 'react-markdown/src/ast-to-react';
import ReactPlayer from 'react-player';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as darkCodeTheme from 'react-syntax-highlighter/dist/cjs/styles/prism/darcula';
import * as lightCodeTheme from 'react-syntax-highlighter/dist/cjs/styles/prism/one-light';
import { OpenGraphScrapeQueryKey, slugify } from '@tunji-web/common';
import OpenGraphCard from '../open-graph/OpenGraph';

import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import Typography from '@mui/material/Typography';
import { Alert as MuiAlert, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Card from '@mui/material/Card';
import { styled, useColorScheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';


const StyledTable = styled(Table)(() => ({
    width: '100%',
    'border-collapse': 'collapse',
}));

const StyledTableHead = styled(TableHead)(({theme}) => ({
    padding: '16px',
    '&:not(:has(img))': {
        'border': `1px solid ${theme.palette.divider}`,
        'background': theme.palette.divider,
    },
}));

const StyledTableBody = styled(TableBody)(({theme}) => ({
    padding: '16px',
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:not(:only-child) td, &:not(:only-child) th': {
        'border': `1px solid ${theme.palette.divider}`,
    },
}));

const StyledTableCell = (props: any) => {
    return <TableCell
        sx={{
            padding: '16px',
        }}
    >
        <StyledParagraph {...props}/>
    </TableCell>;
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

const StyledInlineCode = styled('code')(({theme}) => ({
    fontWeight: '100',
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 1,
    paddingBottom: 1,
    borderColor: theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`
}));

const headerProps = (headerType: string) => ({
    gutterBottom: true,
    variant: headerType,
});

export const MarkdownComponents: Components = {
    table: ({node, ...props}) => {
        return <Box sx={{display: 'flex', flexDirection: 'column', my: 2}}>
            <StyledTable{...props} />
        </Box>;
    },
    thead: StyledTableHead,
    tbody: StyledTableBody,
    tr: StyledTableRow,
    th: StyledTableCell,
    td: StyledTableCell,
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
        if (!href || typeof href !== 'string') return <a{...props}/>;

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
                : <MuiLink
                    color={'textSecondary'}
                    sx={{
                        fontWeight: 'normal'
                    }}
                    {...props}/>;
    },
    p: ({node, ...props}) => {
        const text = Array.isArray(props.children)
            ? props.children[0].toString().toLowerCase()
            : props.children.toString().toLowerCase();
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
            : <StyledInlineCode
                children={children}
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
            remarkPlugins={[gfm]}
            rehypePlugins={[rehypeRaw]}
            children={body || ''}
            components={MarkdownComponents}
        />
    );
};

export default BlogMarkdown;
