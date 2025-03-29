import { PropsWithChildren, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
}

const ScrollToTop = ({children}: PropsWithChildren<Props>) => {
    const location = useLocation();
    const prevLocationPathNameRef = useRef<string | null>(null);

    useEffect(() => {
        const prevLocationPathName = prevLocationPathNameRef.current;
        if (!prevLocationPathName || location.pathname !== prevLocationPathName) {
            window.scrollTo(0, 0);
        } else if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) element.scrollIntoView({behavior: 'smooth'});
        }
        prevLocationPathNameRef.current = location.pathname;
    });

    return children || null;
};


// @ts-ignore
export default ScrollToTop;
