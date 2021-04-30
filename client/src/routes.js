import * as React from 'react'
import {Route, Switch} from 'react-router-dom'
import ScrollToTop from './components/ScrollTop'
import Home from "./components/home/Home";
import SignIn from "./components/auth/SignIn";
import ArchiveDetail from "./components/archive/ArchiveDetail";
import {ArchiveCreate, ArchiveEdit} from "./components/archive/ArchiveEdit";
import {ArchiveKind} from "./common/Models";
import ArchiveList from "./components/archive/ArchiveList";
import About from "./components/about/About";

const routes = () => (
    <ScrollToTop>
        <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/about' component={About}/>
            <Route exact path='/sign-in' component={SignIn}/>
            <Route exact path={`/${ArchiveKind.Articles}/create`} component={ArchiveCreate}/>
            <Route exact path={`/${ArchiveKind.Projects}/create`} component={ArchiveCreate}/>
            <Route exact path={`/${ArchiveKind.Talks}/create`} component={ArchiveCreate}/>
            <Route exact path={`/${ArchiveKind.Articles}/:archiveId/edit`} component={ArchiveEdit}/>
            <Route exact path={`/${ArchiveKind.Projects}/:archiveId/edit`} component={ArchiveEdit}/>
            <Route exact path={`/${ArchiveKind.Talks}/:archiveId/edit`} component={ArchiveEdit}/>
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
