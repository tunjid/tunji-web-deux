import * as React from "react";
import { Components } from "react-markdown/src/ast-to-react";
import ReactPlayer from "react-player";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { OpenGraphScrapeEndpoint } from "../../client-server-common/RouteUtilities";
import OpenGraphCard from "../open-graph/OpenGraph";

export const MarkdownBody = {
    '& > *': {
        fontSize: '150%'
    }
}

export const MarkdownComponents: Components = {
    table: ({node, ...props}) => <table{...props} style={{width: '100%'}}/>,
    img: ({node, ...props}) => <img{...props} style={
        {
            maxWidth: '100%',
            display: 'block',
            margin: '0 auto'
        }
    }/>,
    a: ({node, ...props}) => {
        const href = props['href'];
        if (!href && typeof href !== 'string') return <a{...props}/>;

        const url = href as string;

        const openGraphIndex = url.indexOf(OpenGraphScrapeEndpoint);
        const openGraphUrl = openGraphIndex >= 0
            ? new URLSearchParams(
                url.slice(openGraphIndex + OpenGraphScrapeEndpoint.length)
            ).get('url')
            : undefined

        const videoUrl = url.indexOf('youtube') >= 0 || url.indexOf('vimeo') >= 0 || url.indexOf('wistia') >= 0
            ? url
            : undefined

        return openGraphUrl
            ? <OpenGraphCard url={openGraphUrl}/>
            : videoUrl
                ? <ReactPlayer url={videoUrl}/>
                : <a{...props}/>;
    },
    code({node, inline, className, children, ...props}) {
        const classname = className as string;
        const match = /language-(\w+)/.exec(classname || '')
        return !inline && match
            ? <SyntaxHighlighter
                showLineNumbers={true}
                language={match[1]}
                PreTag="div"
                customStyle={{
                    fontSize: "66%"
                }}
                codeTagProps={
                    {
                        style: {
                            lineHeight: "inherit",
                            fontSize: "inherit"
                        }
                    }
                }
                children={String(children).replace(/\n$/, '')} {...props} />
            : <code
                className={classname}
                children={children}
                style={{backgroundColor: '#F2F2F2'}}
                {...props}
            />
    }
}
