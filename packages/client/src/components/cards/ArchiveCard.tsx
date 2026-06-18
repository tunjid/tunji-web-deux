import { ArchiveCardInfo } from './ArchiveCardInfo';
import { describeRoute, UserLike } from '@tunji-web/common';
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
import { Link, useViewTransitionState } from 'react-router-dom';
import { useGridTransition } from '@tunji-web/client/src/hooks/UseGridTransition';

const StyledCard = styled(Card)(({theme}) => ({
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

const StyledCardContent = styled(CardContent)({
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

const StyledCategories = styled(ChipInput)({
    display: 'flex',
    flex: '1 1 auto',
});

function Author(
    {author, published, avatarVtName}: { author: UserLike, published?: string, avatarVtName?: string }
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
                    sx={{width: 24, height: 24, viewTransitionName: avatarVtName}}
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

    const to = `/${cardInfo.kind}/${cardInfo.link}`;
    const archiveId = describeRoute(to).archiveId;

    // Two mutually-exclusive morph modes, chosen by which screens the view transition runs between
    // (React Router replays the transition on browser Back/Forward too, so both fire in reverse):
    //  - card <-> detail: the clicked card's image/title/author morph into the detail hero. Gated on this
    //    card's OWN detail route, so only the clicked card is named (the rest stay in the page cross-fade).
    //  - grid <-> grid (Home <-> list): the WHOLE card morphs to/from its slot in the other grid. The
    //    browser morphs cards whose `archive-card-<id>` is present on both screens and enters/exits the rest.
    // They never overlap: a grid<->grid nav has no detail endpoint, and a card<->detail nav has only one
    // grid endpoint (so useGridTransition() is false). See UseGridTransition.ts.
    const detailActive = useViewTransitionState(to);
    const isGridMorph = useGridTransition();
    const vtName = (slot: string): string | undefined =>
        detailActive && archiveId ? `archive-${slot}-${archiveId}` : undefined;
    const cardName = isGridMorph && archiveId ? `archive-card-${archiveId}` : undefined;

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        setFocused(false);
    };

    const categoriesAndReadTime = <Box
        sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            justifyContent: 'space-between',
            alignItems: 'center'
        }}
    >
        <StyledCategories
            name={''}
            chips={cardInfo.categories}
            type={ChipType.Category}
            kind={cardInfo.kind}
        />
        <Typography
            variant="caption"
            sx={{
                flex: '0 0 auto',
            }}
        >
            {cardInfo.readTime}
        </Typography>
    </Box>;

    return (
        <Grid key={cardInfo.id} size={cardInfo.breakPoints}>
            <Link
                to={to}
                viewTransition
                style={{textDecoration: 'none'}}
            >
                {
                    cardInfo.showThumbnail
                        ? <StyledCard
                            variant="outlined"
                            sx={{viewTransitionName: cardName}}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            tabIndex={0}
                            className={isFocused ? 'Mui-focused' : ''}
                        >
                            <CardMedia
                                component="img"
                                alt={cardInfo.title}
                                image={cardInfo.thumbnail}
                                sx={{
                                    aspectRatio: '16 / 9',
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    viewTransitionName: vtName('image'),
                                }}
                            />
                            <StyledCardContent>
                                {categoriesAndReadTime}
                                <Typography gutterBottom variant="h6" component="div"
                                            sx={{viewTransitionName: vtName('title')}}>
                                    {cardInfo.title}
                                </Typography>
                                <StyledTypography variant="body2" color="text.secondary" gutterBottom
                                                  sx={{viewTransitionName: vtName('description')}}>
                                    {cardInfo.description}
                                </StyledTypography>
                            </StyledCardContent>
                            <Author author={cardInfo.author} published={cardInfo.date} avatarVtName={vtName('author')}/>
                        </StyledCard>
                        : <StyledCard
                            variant="outlined"
                            sx={{viewTransitionName: cardName}}
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
                            {categoriesAndReadTime}
                            <TitleTypography
                                gutterBottom
                                variant="h6"
                                sx={{viewTransitionName: vtName('title')}}
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
                            <StyledTypography variant="body2" color="text.secondary" gutterBottom
                                              sx={{viewTransitionName: vtName('description')}}>
                                {cardInfo.description}
                            </StyledTypography>

                            <Author author={cardInfo.author} published={cardInfo.date} avatarVtName={vtName('author')}/>
                        </Box>
                        </StyledCard>
                }
            </Link>
        </Grid>
    );
}
