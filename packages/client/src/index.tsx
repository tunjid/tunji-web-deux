import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import reportWebVitals from './reportWebVitals';
import { clientStore } from './reducers';
import { routes } from './routes';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import { AppTheme, createEmotionCache } from '@tunji-web/client';

const cache = createEmotionCache();
// Data router: hydrates from window.__staticRouterHydrationData (emitted by the server's
// StaticRouterProvider). Enables React Router's built-in view transitions, including the
// automatic replay on browser Back/Forward (POP).
const router = createBrowserRouter(routes);

hydrateRoot(
    document.getElementById('root'),
    <Provider store={clientStore.store}>
        <CacheProvider value={cache}>
            <AppTheme>
                <CssBaseline/>
                <RouterProvider router={router}/>
            </AppTheme>
        </CacheProvider>
    </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
