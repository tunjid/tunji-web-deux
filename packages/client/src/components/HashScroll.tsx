import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Smooth-scrolls to a #hash target on navigation. RR's <ScrollRestoration/> handles position
// save/restore but not in-page hash anchors (e.g. the detail screen's table-of-contents links),
// so this preserves the behavior the old ScrollToTop component provided.
const HashScroll = () => {
    const {hash} = useLocation();

    useEffect(() => {
        if (!hash) return;
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({behavior: 'smooth'});
    }, [hash]);

    return null;
};

export default HashScroll;
