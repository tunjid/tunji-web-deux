import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Helmet } from 'react-helmet';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import clientConfig from '../../config';
import AppAppBar from '@tunji-web/client/src/blog/components/AppAppBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { SvgIcon, Table } from '@mui/material';
import rehypeRaw from 'rehype-raw';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

const body = `

# About Me
I love to build things, like bad puns, and enjoy football. 

# Career
Mechanical Engineering undergrad, Manufacturing engineering in grad school, software engineering professionally.

Currently a software engineer at Airbnb.

# Some things I've done

1. Led teams and orchestrated large level refactors.
2. Onboarded, taught and mentored junior engineers.
3. Helped define and set the direction for the next generation of Android Jetpack libraries for Android at Google.
4. Haggled with product managers on pushing delivery of a feature in the short term to better scale in the long term.
5. Mordernized and rearchitected a top 10 app on the [Google Play Store](https://play.google.com/store/apps/details?id=com.gc.teammanager).
6. Designed and built the architecture for the backend and frontend of the [Now in Android App](https://play.google.com/store/apps/details?id=com.google.samples.apps.nowinandroid).
7. Worked with low level apis for live video streaming, and made them consumable them in a high level API.
8. Worked across the full stack from the backend to both web and mobile frontend clients.
9. Performed manufacturing research and a little embedded programming.
10. Dabbled in home automation.
11. Tried my hand at a startup.

This website is my latest attempt at learning the web frontend flavor du jour after the original Angular in the 2010's.

# People I really cannot thank enough:

* Mayiawo Aken'Ova
* Barry Belmont
* Lukonde Mulenga
* Alex Grabski
* Adam McNeilly
* Lola Odelola
* Izzy Oji
* Ron Fessler
* Micheal Pardon
* Matt Chowning
* Ben Yelsey
`;

const BlueskyIcon = (props) => (
    <SvgIcon {...props} viewBox="0 0 568 501">
        <path
            d="M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 -1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 552.222 224.501C531.947 296.954 458.067 315.434 392.347 304.249C507.222 323.8 536.444 388.56 473.333 453.32C353.473 576.312 301.061 422.461 287.631 383.039C285.169 375.812 284.017 372.431 284 375.306C283.983 372.431 282.831 375.812 280.369 383.039C266.939 422.461 214.527 576.312 94.6667 453.32C31.5556 388.56 60.7778 323.8 175.653 304.249C109.933 315.434 36.0535 296.954 15.7778 224.501C9.94525 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1345 -1.61183 123.121 33.6637Z"
            fill="currentColor" // Use currentColor to inherit the color from the parent
        />
    </SvgIcon>
);

const StyledIconButton = styled(IconButton)(() => ({
    border: '1px solid #00000000',
}));

const About = () => {
    return (
        <div>
            <Helmet>
                <title>About | Adetunji Dahunsi</title>
                <meta name="description" content="About Tunji"/>
            </Helmet>
            <AppAppBar
                links={[{title: 'Home', link: '/'}, {title: 'About', link: '/about'}]}
            />
            <Container
                maxWidth="md"
                component="main"
                sx={{display: 'flex', flexDirection: 'column', my: 16,}}
            >
                <Avatar
                    src={clientConfig.rootIndexImage}
                    sx={{width: 160, height: 160, margin: 'auto'}}
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 4,
                        overflow: 'auto',
                        marginTop: 8,
                    }}
                >
                    <a
                        href="https://bsky.app/profile/tunji.dev"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <StyledIconButton aria-label="github">
                            <BlueskyIcon/>
                        </StyledIconButton>
                    </a>
                    <a
                        href="mailto:tjdah100@gmail.com"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <StyledIconButton aria-label="github">
                            <EmailIcon/>
                        </StyledIconButton>
                    </a>
                    <a
                        href="https://github.com/tunjid"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <StyledIconButton aria-label="github">
                            <GitHubIcon/>
                        </StyledIconButton>
                    </a>
                </Box>
                <ReactMarkdown
                    remarkPlugins={[gfm]}
                    rehypePlugins={[rehypeRaw]}
                    children={body}
                />
            </Container>
        </div>
    );
};

export default About;
