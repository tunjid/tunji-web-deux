import * as React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import ScrollToTop from './components/ScrollTop'
import Home from "./components/home/Home";
import SignIn from "./components/auth/SignIn";
import {ArchiveKind} from "./reducers/Archive";
import ArchiveDetail from "./components/archivedetail/ArchiveDetail";

export default () => (
    <BrowserRouter>
        <ScrollToTop>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/sign-in' component={SignIn}/>
                <Route path={`/${ArchiveKind.Articles}/:archiveId`} component={ArchiveDetail}/>
                <Route path={`/${ArchiveKind.Projects}/:archiveId`} component={ArchiveDetail}/>
                <Route path={`/${ArchiveKind.Talks}/:archiveId`} component={ArchiveDetail}/>
            </Switch>
        </ScrollToTop>
    </BrowserRouter>
)
