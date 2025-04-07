import * as React from 'react';
import Container from '@mui/material/Container';
import AppAppBar from './components/AppAppBar';
import MainContent from './components/MainContent';
import Latest from './components/Latest';
import Footer from './components/Footer';

export default function Blog(props: {}) {
    return (
        <div>
            <AppAppBar/>
            <Container
                maxWidth="lg"
                component="main"
                sx={{display: 'flex', flexDirection: 'column', my: 16, gap: 4}}
            >
                <MainContent/>
                <Latest/>
            </Container>
            <Footer/>
        </div>
    );
}
