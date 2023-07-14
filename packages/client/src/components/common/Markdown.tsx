import * as React from 'react';
import { ReactNode } from 'react';
import { Components } from 'react-markdown/src/ast-to-react';
import ReactPlayer from 'react-player';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import style from 'react-syntax-highlighter/dist/cjs/styles/prism/ghcolors';
import { OpenGraphScrapeQueryKey, slugify } from '@tunji-web/common';
import OpenGraphCard from '../open-graph/OpenGraph';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { Alert } from '@material-ui/lab';

export const MarkdownBody = {
    '& h1': {
        fontFamily: '"Muli", sans-serif',
        fontSize: '40px',
        letterSpacing: '0px',
        fontWeight: 'normal',
    },
    '& h2': {
        fontFamily: '"Muli", sans-serif',
        fontSize: '32px',
        letterSpacing: '0px',
        fontWeight: 'lighter',
    },
    '& h3': {
        fontFamily: '"Muli", sans-serif',
        fontSize: '24px',
        letterSpacing: '0px',
        fontWeight: 'lighter',
    },
    '& h4': {
        fontFamily: '"Muli", sans-serif',
        fontSize: '22px',
        letterSpacing: '0px',
        fontWeight: 'lighter',
    },
    '& h5': {
        fontFamily: '"Muli", sans-serif',
        fontSize: '20px',
        letterSpacing: '0px',
        fontWeight: 'lighter',
    },
    '& h6': {
        fontFamily: '"Muli", sans-serif',
        fontSize: '20px',
        letterSpacing: '0px',
        fontWeight: 'lighter',
    },
    '& p, & li': {
        fontFamily: '"Muli", sans-serif',
        fontSize: '18px',
        letterSpacing: '0px',
        fontWeight: 'normal',
        lineHeight: '180%',
    },
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
        return <h1 id={`${slugify(idFromChildren(props.children))}`} {...props}/>;
    },
    h2: ({node, ...props}) => {
        return <h2 id={`${slugify(idFromChildren(props.children))}`} {...props}/>;
    },
    h3: ({node, ...props}) => {
        return <h3 id={`${slugify(idFromChildren(props.children))}`} {...props}/>;
    },
    h4: ({node, ...props}) => {
        return <h4 id={`${slugify(idFromChildren(props.children))}`} {...props}/>;
    },
    h5: ({node, ...props}) => {
        return <h5 id={`${slugify(idFromChildren(props.children))}`} {...props}/>;
    },
    h6: ({node, ...props}) => {
        return <h6 id={`${slugify(idFromChildren(props.children))}`} {...props}/>;
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
            : "";
        if (text.indexOf('note:') === 0) return <Alert severity="info" {...props}></Alert>;
        if (text.indexOf('error:') === 0) return <Alert severity="error" {...props}></Alert>;
        if (text.indexOf('warning:') === 0) return <Alert severity="warning" {...props}></Alert>;
        if (text.indexOf('success:') === 0) return <Alert severity="success" {...props}></Alert>;
        return <p{...props}/>;
    },
    code({node, inline, className, children, ...props}) {
        const classname = className as string;
        const match = /language-(\w+)/.exec(classname || '');
        return !inline && match
            ? <Card>
                <SyntaxHighlighter
                    showLineNumbers={true}
                    language={match[1]}
                    style={style}
                    PreTag="div"
                    customStyle={{
                        display: 'block',
                        margin: '0 auto'
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
            </Card>
            : <code
                className={classname}
                children={children}
                style={{'font-weight': '300'}}
                {...props}
            />;
    }
};

function idFromChildren(children: ReactNode[]): string {
    return children.length > 0 ? slugify(children[0].toString()) : '';
}

interface MarkdownProps {
    body?: string;
}

const useStyles = makeStyles((theme) => createStyles({
    '.markDown': {},
    '.markDown ul': {
        marginTop: '1em',
        marginBottom: '1em',
        listStyle: 'disc outside none'
    },
    '.markDown ul li': {
        marginLeft: '2em',
        display: 'list-item',
        textAlign: '-webkit-match-parent'
    },
    archiveBody: {
        [theme.breakpoints.up('md')]: {
            maxWidth: '50vw',
        },
        maxWidth: '80vw',
        ...MarkdownBody
    }
}));
const BlogMarkdown: (props: MarkdownProps) => JSX.Element = ({body}) => {
    const classes = useStyles();

    return (
        <ReactMarkdown
            className={classes.archiveBody}
            remarkPlugins={[gfm]}
            rehypePlugins={[rehypeRaw]}
            children={body || ''}
            components={MarkdownComponents}
        />
    );
};

export default BlogMarkdown;
