import * as React from 'react';
import './App.css';
import Routes from './routes';
import { SnackbarProvider } from 'notistack';
import SnackbarManager from '@tunji-web/client/src/containers/SnackbarManager';
import { useNavigate } from 'react-router-dom';
import { setNavigate } from './actions/Router';

function NavigationSetup() {
    const navigate = useNavigate();
    React.useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);
    return null;
}

const App = () => {
    return (
        <SnackbarProvider>
            <NavigationSetup/>
            <Routes/>
            <SnackbarManager/>
        </SnackbarProvider>
    );
};

export default App;
