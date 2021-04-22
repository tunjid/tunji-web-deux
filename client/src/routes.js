import * as React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import ScrollToTop from './components/ScrollTop'
import Home from "./components/home/Home";

export default () => (
    <BrowserRouter>
        <ScrollToTop>
            <Switch>
                <Route exact path='/' component={Home}/>
            </Switch>
        </ScrollToTop>
    </BrowserRouter>
)
