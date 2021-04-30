import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { theme } from "../../styles/PersistentUi";
import ReactMarkdown from 'react-markdown'
import { responsiveWidth } from "../archive/Common";
import gfm from "remark-gfm";
import { Avatar } from "@material-ui/core";
import { verticalMargin } from "../../styles/Common";
import { Helmet } from "react-helmet";

const useStyles = makeStyles((theme) => createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        body: {
            ...responsiveWidth(theme),
        },
        avatar: {
            ...verticalMargin(theme.spacing(8)),
            width: '200px',
            height: '200px',
        },
    }
));

const body = `

# About Me
I love to build things, like bad puns, and enjoy football. 

# Career
Mechanical Engineering undergrad, Manufacturing engineering in grad school, software engineering professionally.

Some things I've done:

1. Led teams and orchestrated large level refactors.
2. Onboarded, taught and mentored junior engineers.
3. Haggled with product managers on pushing delivery of a feature in the short term to better scale in the long term.
4. Worked with low level apis for live video streaming, and made them consumable them in a high level API.
5. Worked across the full stack from the backend to both web and mobile frontend clients.
5. Dabbled in home automation.
6. Tried my hand at a startup.

This website is my latest attempt at learning the web frontend flavor du jour after the original Angular in the 2010's.

# Socials

I retweet a lot of football related things [here](https://twitter.com/Tunji_D).

# People I really cannot thank enough:

* Mayiawo Aken'Ova
* Barry Belmont
* Lukonde Mulenga
* Alex Grabski
* Adam McNeilly
* Lola Odelola
* Ron Fessler
* Matt Chowning
* Ben Yesley
`

const About = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
            appBarTitle: 'About',
            hasHomeIcon: true,
            hasAppBarShadow: true,
            hasAppBarSpacer: true,
            appBarColor: theme.palette.primary.dark,
            fab: undefined
        }));
    }, [dispatch]);

    return (
        <div className={classes.root}>
            <Helmet>
                <title>About | Adetunji Dahunsi</title>
                <meta name="description" content="About Tunji" />
            </Helmet>
            <Avatar className={classes.avatar} src={'https://pbs.twimg.com/profile_images/1368773620386922502/XN6-njLn_400x400.jpg'}/>
            <ReactMarkdown
                className={classes.body}
                remarkPlugins={[gfm]}
                children={body}
                components={{
                    img: ({node, ...props}) => (<img{...props} style={{maxWidth: '10vw'}}/>),
                    p: ({node, ...props}) => (<p{...props} style={{fontSize: '150%'}}/>),
                    li: ({node, ...props}) => (<p{...props} style={{fontSize: '150%'}}/>),
                    h1: ({node, ...props}) => (<h1{...props} style={{fontSize: '150%'}}/>),
                    h2: ({node, ...props}) => (<h2{...props} style={{fontSize: '150%'}}/>),
                    h3: ({node, ...props}) => (<h3{...props} style={{fontSize: '150%'}}/>),
                    h4: ({node, ...props}) => (<h4{...props} style={{fontSize: '150%'}}/>),
                    h5: ({node, ...props}) => (<h5{...props} style={{fontSize: '150%'}}/>),
                    h6: ({node, ...props}) => (<h6{...props} style={{fontSize: '150%'}}/>),
                }}
            />
        </div>
    );
}

export default About;
