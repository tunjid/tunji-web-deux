import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { theme } from "../../styles/PersistentUi";
import ReactMarkdown from 'react-markdown'
import { responsiveWidth } from "../common/Common";
import gfm from "remark-gfm";
import { Avatar } from "@material-ui/core";
import { horizontalMargin, StylelessAnchor, verticalMargin } from "../../styles/Common";
import { Helmet } from "react-helmet";
import EmailIcon from '@material-ui/icons/Email';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import { MarkdownBody, MarkdownComponents } from "../common/Markdown";
import clientConfig from '../../config'

const useStyles = makeStyles((theme) => createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        body: {
            ...responsiveWidth(theme),
            ...MarkdownBody,
        },
        avatar: {
            ...verticalMargin(theme.spacing(8)),
            width: '200px',
            height: '200px',
        },
        socials: {
            ...responsiveWidth(theme),
            '& > *': {
                ...horizontalMargin(theme.spacing(1)),
            },
            display: 'flex'
        },
        socialIcons: {
            ...StylelessAnchor
        }
    }
));

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
`

const About = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
            appBarTitle: 'About',
            appBarColor: theme.palette.primary.dark,
            hasHomeIcon: true,
            hasAppBarShadow: true,
            hasAppBarSpacer: true,
            menuItems: [],
            fab: undefined
        }));
    }, [dispatch]);

    return (
        <div className={classes.root}>
            <Helmet>
                <title>About | Adetunji Dahunsi</title>
                <meta name="description" content="About Tunji"/>
            </Helmet>
            <Avatar
                className={classes.avatar}
                src={clientConfig.rootIndexImage}
            />
            <div className={classes.socials}>
                <a className={classes.socialIcons}
                   href='mailto:tjdah100@gmail.com'
                   target="_blank"
                   rel="noreferrer"
                >
                    <EmailIcon/>
                </a>
                <a className={classes.socialIcons}
                   href='https://twitter.com/Tunji_D'
                   target="_blank"
                   rel="noreferrer"
                >
                    <TwitterIcon/>
                </a>
                <a className={classes.socialIcons}
                   href='https://github.com/tunjid'
                   target="_blank"
                   rel="noreferrer"
                >
                    <GitHubIcon/>
                </a>
            </div>
            <ReactMarkdown
                className={classes.body}
                remarkPlugins={[gfm]}
                children={body}
                components={MarkdownComponents}
            />
        </div>
    );
}

export default About;
