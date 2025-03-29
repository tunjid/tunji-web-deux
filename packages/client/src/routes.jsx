import * as React from 'react'
import {Route, Switch} from 'react-router-dom'
import ScrollToTop from './components/ScrollTop'
import Home from "./components/home/Home";
import ArchiveDetail from "./components/archive/ArchiveDetail";
import {ArchiveKind} from "@tunji-web/common";
import ArchiveList from "./components/archive/ArchiveList";
import About from "./components/about/About";

const routes = () => (
    <ScrollToTop>
        <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/about' component={About}/>
            <Route exact path={`/${ArchiveKind.Articles}`} component={ArchiveList}/>
            <Route exact path={`/${ArchiveKind.Projects}`} component={ArchiveList}/>
            <Route exact path={`/${ArchiveKind.Talks}`} component={ArchiveList}/>
            <Route path={`/${ArchiveKind.Articles}/:archiveId`} component={ArchiveDetail}/>
            <Route path={`/${ArchiveKind.Projects}/:archiveId`} component={ArchiveDetail}/>
            <Route path={`/${ArchiveKind.Talks}/:archiveId`} component={ArchiveDetail}/>
        </Switch>
    </ScrollToTop>
)

export default routes;
