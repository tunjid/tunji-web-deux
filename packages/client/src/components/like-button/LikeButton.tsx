import * as React from 'react';
import { Fab, Tooltip } from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { verticalMargin } from '@tunji-web/client/src/styles/Common';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...verticalMargin(theme.spacing(2)),
    },
    initialLikeCount: {
        ...verticalMargin(theme.spacing(2)),
    },
}));

export interface Props {
    initialCount: number
    onClose: (count: number) => void
}

const LikeButton = ({initialCount, onClose}: Props) => {
    const classes = useStyles();

    const [count, setCount] = React.useState(0);
    const open = count > 0;
    const title = count > 0 ? count.toString() : '';

    const handleDismiss = () => {
        if (count > 0) onClose(count);
        setCount(0);
    };

    const handleIncrementCount = () => {
        setCount(count + 1);
    };

    return (
        <div className={classes.root}>
            <Tooltip
                PopperProps={{
                    disablePortal: true,
                }}
                onClose={handleDismiss}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                enterDelay={0}
                title={title}
                arrow
                placement="top"
            >
                <Fab
                    color="secondary"
                    aria-label="edit"
                    onClick={handleIncrementCount}
                    onMouseLeave={handleDismiss}
                >
                    <ThumbUpIcon/>
                </Fab>
            </Tooltip>
            <Typography className={classes.initialLikeCount} component="p">
                {initialCount}
            </Typography>
        </div>
    );
};

export default LikeButton;
