import * as React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';


export interface Props {
    initialCount: number;
    onClose: (count: number) => void;
}

const LikeButton = ({initialCount, onClose}: Props) => {
    const [count, setCount] = React.useState(0);

    const handleDismiss = () => {
        if (count > 0) onClose(count);
        setCount(0);
    };

    const handleIncrementCount = () => {
        setCount(count + 1);
    };

    return (
        <Badge badgeContent={count} color="primary">
            <Button
                variant="outlined"
                disableRipple
                size="small"
                onClick={handleIncrementCount}
                onMouseLeave={handleDismiss}
                endIcon={<FavoriteIcon/>}
            >
                {initialCount}
            </Button>
        </Badge>
    );
};

export default LikeButton;
