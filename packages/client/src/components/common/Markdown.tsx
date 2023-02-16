import * as React from 'react';
import { ReactNode } from 'react';
import { Components } from 'react-markdown/src/ast-to-react';
import ReactPlayer from 'react-player';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { OpenGraphScrapeQueryKey, slugify } from '@tunji-web/common';
import OpenGraphCard from '../open-graph/OpenGraph';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import { createStyles, makeStyles } from '@material-ui/core/styles';

export const MarkdownBody = {
    '& h1': {
        fontFamily: '"Muli", sans-serif',
        fontSize: "40px",
        letterSpacing: "0px",
        fontWeight: "normal",
        lineHeight: "90%"
    },
    '& h2': {
        fontFamily: '"Muli", sans-serif',
        fontSize: "32px",
        letterSpacing: "0px",
        fontWeight: "lighter",
        lineHeight: "90%"
    },
    '& h3': {
        fontFamily: '"Muli", sans-serif',
        fontSize: "24px",
        letterSpacing: "0px",
        fontWeight: "lighter",
        lineHeight: "80%"
    },
    "& p, & li, & ul": {
        fontFamily: '"Muli", sans-serif',
        fontSize: "18px",
        letterSpacing: "0px",
        fontWeight: "normal",
        lineHeight: "125%"
    }
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
    code({node, inline, className, children, ...props}) {
        const classname = className as string;
        const match = /language-(\w+)/.exec(classname || '');
        return !inline && match
            ? <SyntaxHighlighter
                showLineNumbers={true}
                language={match[1]}
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
            : <code
                className={classname}
                children={children}
                style={{backgroundColor: '#F2F2F2'}}
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
    ".markDown": {},
    ".markDown ul": {
        marginTop: "1em",
        marginBottom: "1em",
        listStyle: "disc outside none"
    },
    ".markDown ul li": {
        marginLeft: "2em",
        display: "list-item",
        textAlign: "-webkit-match-parent"
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
