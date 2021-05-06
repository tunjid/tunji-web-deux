import * as React from "react";
import { Components } from "react-markdown/src/ast-to-react";
import ReactPlayer from "react-player";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { OpenGraphScrapeEndpoint } from "../../client-server-common/RouteUtilities";
import OpenGraphCard from "../open-graph/OpenGraph";

export const MarkdownComponents: Components = {
    p: ({node, ...props}) => <p{...props} style={{fontSize: '150%'}}/>,
    h1: ({node, ...props}) => <h1{...props} style={{fontSize: '150%'}}/>,
    h2: ({node, ...props}) => <h2{...props} style={{fontSize: '150%'}}/>,
    h3: ({node, ...props}) => <h3{...props} style={{fontSize: '150%'}}/>,
    h4: ({node, ...props}) => <h4{...props} style={{fontSize: '150%'}}/>,
    h5: ({node, ...props}) => <h5{...props} style={{fontSize: '150%'}}/>,
    h6: ({node, ...props}) => <h6{...props} style={{fontSize: '150%'}}/>,
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
        const c = className as string;
        const match = /language-(\w+)/.exec(c || '')
        return !inline && match
            ? <SyntaxHighlighter
                language={match[1]}
                PreTag="div"
                children={String(children).replace(/\n$/, '')} {...props} />
            : <code className={c} {...props} />
    }
}
