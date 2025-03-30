import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { clientStore } from './reducers';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import { AppTheme, createEmotionCache } from '@tunji-web/client';

const cache = createEmotionCache();

ReactDOM.hydrate(
    <Provider store={clientStore.store}>
        <BrowserRouter>
            <CacheProvider value={cache}>
                <AppTheme>
                    <CssBaseline/>
                    <App/>
                </AppTheme>
            </CacheProvider>,
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
