import * as React from 'react'
import {Route, Switch} from 'react-router-dom'
import ScrollToTop from './components/ScrollTop'
import Home from "./components/home/Home";
import SignIn from "./components/auth/SignIn";
import ArchiveDetail from "./components/archive/ArchiveDetail";
import ArchiveEdit from "./components/archive/ArchiveEdit";
import {ArchiveKind} from "./common/Models";

const routes = () => (
    <ScrollToTop>
        <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/sign-in' component={SignIn}/>
            <Route path={`/${ArchiveKind.Articles}/:archiveId/edit`} component={ArchiveEdit}/>
            <Route path={`/${ArchiveKind.Projects}/:archiveId/edit`} component={ArchiveEdit}/>
            <Route path={`/${ArchiveKind.Talks}/:archiveId/edit`} component={ArchiveEdit}/>
            <Route path={`/${ArchiveKind.Articles}/:archiveId`} component={ArchiveDetail}/>
            <Route path={`/${ArchiveKind.Projects}/:archiveId`} component={ArchiveDetail}/>
            <Route path={`/${ArchiveKind.Talks}/:archiveId`} component={ArchiveDetail}/>
        </Switch>
    </ScrollToTop>
)

export default routes;
