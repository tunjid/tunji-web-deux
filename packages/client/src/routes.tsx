import * as React from 'react';
import { Outlet, RouteObject, ScrollRestoration, useNavigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import SnackbarManager from '@tunji-web/client/src/containers/SnackbarManager';
import { setNavigate } from './actions/Router';
import { ArchiveKind } from '@tunji-web/common';
import Home from './components/home/Home';
import About from './components/about/About';
import ArchiveList from './components/archive/ArchiveList';
import ArchiveDetail from './components/archive/ArchiveDetail';
import HashScroll from './components/HashScroll';

// Captures the data router's navigate so Redux thunks (RouterActions) can navigate imperatively.
// Lives in the layout (rendered under RouterProvider) so useNavigate resolves to the data router.
function NavigationSetup() {
    const navigate = useNavigate();
    React.useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);
    return null;
}

const RootLayout = () => (
    <SnackbarProvider>
        <NavigationSetup/>
        {/* ScrollRestoration: scroll-to-top on push, restore prior position on back/forward (POP) so the
            reverse view-transition's target card is on-screen. HashScroll keeps the #hash smooth-scroll. */}
        <ScrollRestoration/>
        <HashScroll/>
        <Outlet/>
        <SnackbarManager/>
    </SnackbarProvider>
);

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <RootLayout/>,
        children: [
            {index: true, element: <Home/>},
            {path: 'about', element: <About/>},
            {path: ArchiveKind.Articles, element: <ArchiveList/>},
            {path: ArchiveKind.Projects, element: <ArchiveList/>},
            {path: ArchiveKind.Talks, element: <ArchiveList/>},
            {path: `${ArchiveKind.Articles}/:archiveId`, element: <ArchiveDetail/>},
            {path: `${ArchiveKind.Projects}/:archiveId`, element: <ArchiveDetail/>},
            {path: `${ArchiveKind.Talks}/:archiveId`, element: <ArchiveDetail/>},
            // Catch-all so the data router never falls through to its default error boundary
            // (the classic <Routes> simply rendered nothing for unmatched paths).
            {path: '*', element: <Home/>},
        ],
    },
];
