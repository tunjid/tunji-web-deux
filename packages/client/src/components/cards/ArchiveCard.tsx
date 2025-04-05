import { ArchiveCardInfo } from './ArchiveCardInfo';
import { UserLike } from '@tunji-web/common';
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ChipInput, { ChipType } from '@tunji-web/client/src/components/archive/ChipInput';
import { Link } from 'react-router-dom';

const SyledCard = styled(Card)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: (theme.vars || theme).palette.background.paper,
    '&:hover': {
        backgroundColor: 'transparent',
        cursor: 'pointer',
    },
    '&:focus-visible': {
        outline: '3px solid',
        outlineColor: 'hsla(210, 98%, 48%, 0.5)',
        outlineOffset: '2px',
    },
}));

const SyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
        paddingBottom: 16,
    },
});

const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

const TitleTypography = styled(Typography)(({theme}) => ({
    position: 'relative',
    textDecoration: 'none',
    '&:hover': {cursor: 'pointer'},
    '& .arrow': {
        visibility: 'hidden',
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
    },
    '&:hover .arrow': {
        visibility: 'visible',
        opacity: 0.7,
    },
    '&:focus-visible': {
        outline: '3px solid',
        outlineColor: 'hsla(210, 98%, 48%, 0.5)',
        outlineOffset: '3px',
        borderRadius: '8px',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        width: 0,
        height: '1px',
        bottom: 0,
        left: 0,
        backgroundColor: (theme.vars || theme).palette.text.primary,
        opacity: 0.3,
        transition: 'width 0.3s ease, opacity 0.3s ease',
    },
    '&:hover::before': {
        width: '100%',
    },
}));

function Author(
    {author, published}: { author: UserLike, published?: string }
) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
            }}
        >
            <Box
                sx={{display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center'}}
            >
                <Avatar
                    alt={author.fullName}
                    src={author.imageUrl}
                    sx={{width: 24, height: 24}}
                />
                <Typography variant="caption">
                    {author.fullName}
                </Typography>
            </Box>
            <Typography variant="caption">{published}</Typography>
        </Box>
    );
}
interface State {
    cardInfo: ArchiveCardInfo;
}

export default function ArchiveCard({cardInfo}: State) {
    const [isFocused, setFocused] = React.useState<boolean>(
        false,
    );

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        setFocused(false);
    };

    const chips = <ChipInput
        name={''}
        chips={cardInfo.categories}
        type={ChipType.Category}
        kind={cardInfo.kind}
    />

    return (
        <Grid key={cardInfo.id} size={cardInfo.breakPoints}>
            <Link
                to={`/${cardInfo.kind}/${cardInfo.link}`}
                style={{ textDecoration: 'none' }}
            >
            {
                cardInfo.showThumbnail
                    ? <SyledCard
                        variant="outlined"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        tabIndex={0}
                        className={isFocused ? 'Mui-focused' : ''}
                    >
                        <CardMedia
                            component="img"
                            alt="green iguana"
                            image={cardInfo.thumbnail}
                            sx={{
                                aspectRatio: '16 / 9',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            }}
                        />
                        <SyledCardContent>
                            {chips}
                            <Typography gutterBottom variant="h6" component="div">
                                {cardInfo.title}
                            </Typography>
                            <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                {cardInfo.description}
                            </StyledTypography>
                        </SyledCardContent>
                        <Author author={cardInfo.author} published={cardInfo.date}/>
                    </SyledCard>
                    : <SyledCard
                        variant="outlined"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        tabIndex={0}
                        className={isFocused ? 'Mui-focused' : ''}
                    > <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 1,
                            height: '100%',
                        }}
                    >
                        {chips}
                        <TitleTypography
                            gutterBottom
                            variant="h6"
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            tabIndex={0}
                            className={isFocused ? 'Mui-focused' : ''}
                        >
                            {cardInfo.title}
                            <NavigateNextRoundedIcon
                                className="arrow"
                                sx={{fontSize: '1rem'}}
                            />
                        </TitleTypography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            {cardInfo.description}
                        </StyledTypography>

                        <Author author={cardInfo.author} published={cardInfo.date}/>
                    </Box>
                    </SyledCard>
            }
            </Link>
        </Grid>
    );
}
