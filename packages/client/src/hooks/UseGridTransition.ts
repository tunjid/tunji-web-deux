import { useContext } from 'react';
import { matchPath, UNSAFE_ViewTransitionContext } from 'react-router-dom';
import { ArchiveKind } from '@tunji-web/common';

// The card-grid screens: Home and each archive list. A whole-card morph should run only when BOTH
// endpoints of the view transition are grid screens — that covers Home <-> list AND list <-> list
// (a filter change keeps the same path, only the query string differs). A nav to/from a detail or a
// non-grid route (e.g. /about) has a non-grid endpoint, so cards stay in the default page cross-fade.
const GRID_PATHS: string[] = [
    '/',
    `/${ArchiveKind.Articles}`,
    `/${ArchiveKind.Projects}`,
    `/${ArchiveKind.Talks}`,
];

const isGridPath = (pathname: string): boolean =>
    GRID_PATHS.some((path) => matchPath({path, end: true}, pathname) != null);

/**
 * True while a view transition between two card-grid screens is in flight (Home <-> list, list <-> list).
 *
 * Reads the transition's endpoints straight from React Router's ViewTransitionContext so the same-path
 * case (list <-> list filter changes) is detected too — `useViewTransitionState` only reports a boolean
 * per path and can't tell a same-path grid transition apart from, say, list -> /about.
 */
export const useGridTransition = (): boolean => {
    const vtContext = useContext(UNSAFE_ViewTransitionContext);
    if (!vtContext.isTransitioning) return false;
    return isGridPath(vtContext.currentLocation.pathname)
        && isGridPath(vtContext.nextLocation.pathname);
};
