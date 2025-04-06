import * as React from 'react';
import { createSelector } from 'reselect';
import { StoreState } from '../../types';
import { useDispatch } from 'react-redux';
import { HomeState } from '../../reducers/Home';
import { HomeActions } from '../../actions/Home';
import { AuthState } from '../../reducers/Auth';
import { ArchiveKind } from '@tunji-web/common';
import { useDeepEqualSelector } from '../../hooks/UseDeepEqualSelector';
import Box from '@mui/material/Box';
import { Search } from '@tunji-web/client/src/blog/components/MainContent';
import IconButton from '@mui/material/IconButton';
import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { capitalizeFirst } from '@tunji-web/client/src/components/common/Common';


interface State {
    appBarColor: string;
    hasAppBarShadow: boolean;
    onHomePage: boolean;
    isSignedIn: boolean;
    selectedTab: ArchiveKind;
    tabs: ArchiveKind[];
}

const selector = createSelector<StoreState, State, [HomeState, AuthState]>(
    [
        (state: StoreState) => state.home,
        (state: StoreState) => state.auth,
    ],
    (home, auth) => ({
        selectedTab: home.selectedTab,
        tabs: home.tabs,
        isSignedIn: !!auth.signedInUser,
    })
);


const HomeHeader = () => {
    const dispatch = useDispatch();
    const {
        selectedTab,
        tabs,
    } = useDeepEqualSelector(selector);

    const onTabChanged = (_event: React.SyntheticEvent, newValue: number) => {
        dispatch(HomeActions.selectTab(tabs[newValue]));
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <div>
                <Typography variant="h1" gutterBottom>
                    Adetunji Dahunsi
                </Typography>
                <Typography>These are a few of my favorite things</Typography>
            </div>
            <Box
                sx={{
                    display: {xs: 'flex', sm: 'none'},
                    flexDirection: 'row',
                    gap: 1,
                    width: {xs: '100%', md: 'fit-content'},
                    overflow: 'auto',
                }}
            >
                <Search/>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column-reverse', md: 'row'},
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: {xs: 'start', md: 'center'},
                    gap: 4,
                    overflow: 'auto',
                }}
            >
                <Box
                    sx={{
                        display: 'inline-flex',
                        flexDirection: 'row',
                        gap: 3,
                        overflow: 'auto',
                    }}
                >
                    <Tabs value={tabs.indexOf(selectedTab)} onChange={onTabChanged} >
                        {tabs.map((kind) => <Tab key={kind} label={capitalizeFirst(kind)}/>)}
                    </Tabs>
                </Box>
                <Box
                    sx={{
                        display: {xs: 'none', sm: 'flex'},
                        flexDirection: 'row',
                        gap: 1,
                        width: {xs: '100%', md: 'fit-content'},
                        overflow: 'auto',
                    }}
                >
                    <Search/>
                </Box>
            </Box>
        </Box>
    );
};

export default HomeHeader;
