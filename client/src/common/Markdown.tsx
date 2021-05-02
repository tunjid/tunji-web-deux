import * as React from "react";
import { Components } from "react-markdown/src/ast-to-react";

export const MarkdownComponents: Components = {
    img: ({node, ...props}) => <img{...props} style={{maxWidth: '10vw'}}/>,
    p: ({node, ...props}) => <p{...props} style={{fontSize: '150%'}}/>,
    li: ({node, ...props}) => <li{...props} style={{fontSize: '150%'}}/>,
    h1: ({node, ...props}) => <h1{...props} style={{fontSize: '150%'}}/>,
    h2: ({node, ...props}) => <h2{...props} style={{fontSize: '150%'}}/>,
    h3: ({node, ...props}) => <h3{...props} style={{fontSize: '150%'}}/>,
    h4: ({node, ...props}) => <h4{...props} style={{fontSize: '150%'}}/>,
    h5: ({node, ...props}) => <h5{...props} style={{fontSize: '150%'}}/>,
    h6: ({node, ...props}) => <h6{...props} style={{fontSize: '150%'}}/>,
}
