import * as React from 'react';
import { useEffect } from 'react';
import ArchiveCards from '../cards/ArchiveCards';
import { useDispatch } from 'react-redux';
import { HomeState } from '../../reducers/Home';
import { createSelector } from 'reselect';
import { StoreState } from '../../types';
import { PersistentUiState } from '../../reducers/PersistentUi';
import { AuthState } from '../../reducers/Auth';
import { Helmet } from 'react-helmet';
import { ArchiveKind } from '@tunji-web/common';
import { useSearchParams } from 'react-router-dom';
import { ArchiveActions, ArchivesQuery } from '../../actions/Archive';
import { archivesSelector } from '../common/Common';
import { useDeepEqualSelector } from '../../hooks/UseDeepEqualSelector';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import HomeHeader from '@tunji-web/client/src/components/home/HomeHeader';
import AppAppBar from '@tunji-web/client/src/blog/components/AppAppBar';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

interface State {
    appBarTitle: string;
    isSignedIn: boolean;
    selectedTab: ArchiveKind;
}

const selector = createSelector<StoreState, State, [PersistentUiState, HomeState, AuthState]>(
    [
        state => state.persistentUI,
        state => state.home,
        state => state.auth,
    ],
    (persistentUI, home, auth) => ({
        appBarTitle: persistentUI.appBarTitle,
        selectedTab: home.selectedTab,
        isSignedIn: !!auth.signedInUser,
    })
);

const querySelector = (searchParams: URLSearchParams) => createSelector<StoreState, Record<ArchiveKind, ArchivesQuery>>(
    () => ({
        [ArchiveKind.Articles]: {
            params: populateAuthor(new URLSearchParams(searchParams)),
            key: `Home-${ArchiveKind.Articles}`,
            kind: ArchiveKind.Articles,
        },
        [ArchiveKind.Projects]: {
            params: populateAuthor(new URLSearchParams(searchParams)),
            key: `Home-${ArchiveKind.Projects}`,
            kind: ArchiveKind.Projects,
        },
        [ArchiveKind.Talks]: {
            params: populateAuthor(new URLSearchParams(searchParams)),
            key: `Home-${ArchiveKind.Talks}`,
            kind: ArchiveKind.Talks,
        }
    })
);

const populateAuthor = (params: URLSearchParams) => {
    params.append('populateAuthor', 'true');
    return params;
};

const Home = () => {
    const dispatch = useDispatch();
    const {
        selectedTab,
    } = useDeepEqualSelector(selector);
    const [searchParams] = useSearchParams();
    const queries = useDeepEqualSelector(querySelector(searchParams));
    const articles = useDeepEqualSelector(archivesSelector(() => queries[ArchiveKind.Articles], 8));
    const projects = useDeepEqualSelector(archivesSelector(() => queries[ArchiveKind.Projects], 8));
    const talks = useDeepEqualSelector(archivesSelector(() => queries[ArchiveKind.Talks], 8));

    useEffect(() => {
        dispatch(ArchiveActions.fetchArchives(queries[ArchiveKind.Articles]));
        dispatch(ArchiveActions.fetchArchives(queries[ArchiveKind.Projects]));
        dispatch(ArchiveActions.fetchArchives(queries[ArchiveKind.Talks]));
    }, [queries, dispatch]);

    return (
        <div>
            <Helmet>
                <title>Adetunji Dahunsi</title>
                <meta name="description" content="Tunji's web corner"/>
            </Helmet>
            <AppAppBar
                links={[{title: 'Home', link: '/'}, {title: 'About', link: '/about'}]}
            />
            <Container
                maxWidth="md"
                component="main"
                sx={{display: 'flex', flexDirection: 'column', my: 16, gap: 4}}
            >
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
                    <HomeHeader/>
                    <div>
                        <div hidden={selectedTab !== ArchiveKind.Articles}>
                            <ArchiveCards kind={ArchiveKind.Articles} archives={articles}/>
                        </div>
                        <div hidden={selectedTab !== ArchiveKind.Projects}>
                            <ArchiveCards kind={ArchiveKind.Projects} archives={projects}/>
                        </div>
                        <div hidden={selectedTab !== ArchiveKind.Talks}>
                            <ArchiveCards kind={ArchiveKind.Talks} archives={talks}/>
                        </div>
                    </div>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        margin: 'auto',
                    }}>
                        <Link
                            to={`/${selectedTab}`}
                        >
                            <Button
                                variant="outlined"
                            >
                                {`All ${selectedTab}`}
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default Home;
