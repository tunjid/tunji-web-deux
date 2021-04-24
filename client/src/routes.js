import * as React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import ScrollToTop from './components/ScrollTop'
import Home from "./components/home/Home";
import {ArchiveKind} from "./reducers/Archive";
import ArchiveDetail from "./components/archivedetail/ArchiveDetail";

export default () => (
    <BrowserRouter>
        <ScrollToTop>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route path='/test' component={Home}/>
                <Route path={`/${ArchiveKind.Articles}/:archiveId`} component={ArchiveDetail}/>
                <Route path={`/${ArchiveKind.Projects}/:archiveId`} component={ArchiveDetail}/>
                <Route path={`/${ArchiveKind.Talks}/:archiveId`} component={ArchiveDetail}/>
            </Switch>
        </ScrollToTop>
    </BrowserRouter>
)
