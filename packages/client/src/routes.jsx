import * as React from 'react';
import {Route, Routes} from 'react-router-dom';
import ScrollToTop from './components/ScrollTop';
import Home from './components/home/Home';
import ArchiveDetail from './components/archive/ArchiveDetail';
import {ArchiveKind} from '@tunji-web/common';
import ArchiveList from './components/archive/ArchiveList';
import About from './components/about/About';

const routes = () => (
    <ScrollToTop>
        <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/about" element={<About/>}/>
            <Route exact path={`/${ArchiveKind.Articles}`} element={<ArchiveList/>}/>
            <Route exact path={`/${ArchiveKind.Projects}`} element={<ArchiveList/>}/>
            <Route exact path={`/${ArchiveKind.Talks}`} element={<ArchiveList/>}/>
            <Route path={`/${ArchiveKind.Articles}/:archiveId`} element={<ArchiveDetail/>}/>
            <Route path={`/${ArchiveKind.Projects}/:archiveId`} element={<ArchiveDetail/>}/>
            <Route path={`/${ArchiveKind.Talks}/:archiveId`} element={<ArchiveDetail/>}/>
        </Routes>
    </ScrollToTop>
);

export default routes;
