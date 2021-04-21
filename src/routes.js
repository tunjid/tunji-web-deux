import * as React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import ScrollToTop from './components/ScrollTop'
import Cards from "./components/cards/Cards";

export default () => (
    <BrowserRouter>
        <ScrollToTop>
            <Switch>
                <Route exact path='/' component={Cards}/>
            </Switch>
        </ScrollToTop>
    </BrowserRouter>
)
