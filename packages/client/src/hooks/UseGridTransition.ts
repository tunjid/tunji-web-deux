import { useViewTransitionState } from 'react-router-dom';
import { ArchiveKind } from '@tunji-web/common';

// The card-grid screens: Home and each archive list. A navigation BETWEEN two of these (e.g. Home <-> a
// list) has two of these paths as its view-transition endpoints; a navigation to a detail has only one
// (the current grid — the detail path is not a grid route). So "at least two grid endpoints" uniquely
// identifies a grid<->grid transition — the case where cards present on both screens should morph.
const GRID_PATHS: string[] = [
    '/',
    `/${ArchiveKind.Articles}`,
    `/${ArchiveKind.Projects}`,
    `/${ArchiveKind.Talks}`,
];

/**
 * True while a view transition between two card-grid screens is in flight (Home <-> list, list <-> list).
 *
 * Every `useViewTransitionState` is called unconditionally over a constant-length list so hook order is
 * stable across renders — combining the checks with `&&`/`||` would short-circuit and skip hook calls,
 * violating the Rules of Hooks.
 */
export const useGridTransition = (): boolean => {
    const endpointMatches = GRID_PATHS.map((path) => useViewTransitionState(path));
    return endpointMatches.filter(Boolean).length >= 2;
};
