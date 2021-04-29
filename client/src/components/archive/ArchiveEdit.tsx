import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { theme } from "../../styles/PersistentUi";
import MEDitor from '@uiw/react-md-editor';
import { ArchiveActions } from "../../actions/Archive";
import { archiveSelector, responsiveWidth } from "./Common";
import _ from 'lodash';
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import ChipInput, { ChipType } from "./ChipInput";
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => createStyles({
        root: {
            ...responsiveWidth(theme),
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
        },
        date: {
            'margin-top': theme.spacing(4),
            'margin-bottom': theme.spacing(2),
        },
        title: {
            ...responsiveWidth(theme),
            margin: theme.spacing(1),
        },
        description: {
            ...responsiveWidth(theme),
            margin: theme.spacing(1),
        },
        chips: {
            alignSelf: 'flex-start',
            display: 'flex',
            'flex-direction': 'column',
        },
        headerImageSize: {
            fontSize: 14
        },
        cardBackground: {
            ...responsiveWidth(theme),
            height: '50vh',
            margin: theme.spacing(0.5),
        },
        editor: {
            ...responsiveWidth(theme),
            'max-width': '800',
            margin: theme.spacing(0.5),
        },
        cardImage: {
            ...responsiveWidth(theme),
            height: '50vh',
        },
    }
));

interface ChipChange {
    text: string;
    added: boolean;
    isTag: boolean
}

export interface Props {
    isCreating: boolean
}

const ArchiveCreateOrEdit = ({isCreating}: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {isSignedIn, kind, archiveId, archive} = useSelector(archiveSelector('edit'), shallowEqual);

    const onChipChanged = ({text, added, isTag}: ChipChange) => {
        const existing = isTag ? archive?.tags : archive?.categories;
        if (!existing) return;
        const newChips = added
            ? _.uniq([...existing, text])
            : existing.filter(item => item !== text)
        const chipEdits = isTag
            ? {tags: newChips}
            : {categories: newChips}
        dispatch(ArchiveActions.editArchive({
            kind,
            ...chipEdits
        }));
    };

    const onTitleChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(ArchiveActions.editArchive({
            kind,
            title: event.target.value
        }));
    };

    const onDescriptionChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(ArchiveActions.editArchive({
            kind,
            description: event.target.value
        }));
    };

    const onHeaderImageChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(ArchiveActions.editArchive({
            kind,
            thumbnail: event.target.value
        }));
    };

    const onBodyChanged = (markdown: string | undefined) => {
        dispatch(ArchiveActions.editArchive({
            kind,
            body: markdown || ''
        }));
    }

    useEffect(() => {
        if (!isCreating && archiveId) dispatch(ArchiveActions.readArchive({kind, view: "edit", id: archiveId}));
    }, [archiveId, dispatch, isCreating, kind]);

    useEffect(() => {
        const menuItems = [];
        if (!isCreating) menuItems.push({
            id: 'delete',
            text: 'Delete',
            icon: <DeleteIcon/>,
            action: ArchiveActions.deleteArchive(kind),
        });
        dispatch(PersistentUiActions.modifyAppBar({
            hasAppBarShadow: true,
            hasAppBarSpacer: true,
            appBarColor: theme.palette.primary.dark,
            menuItems,
            fab: isSignedIn ? {
                id: isCreating ? 'create' : 'update',
                text: isCreating ? 'Create' : 'Update',
                icon: <SaveIcon/>,
                action: isCreating ? ArchiveActions.createArchive(kind) : ArchiveActions.updateArchive(kind),
            } : undefined
        }));
    }, [kind, isCreating, isSignedIn, dispatch]);

    return (
        <div className={classes.root}>
            <Typography className={classes.date} gutterBottom variant="subtitle1">
                {archive?.created?.toDateString() || ''}
            </Typography>

            <TextField
                className={classes.title}
                id="standard-basic"
                size='medium'
                label='Title'
                multiline
                rowsMax={Infinity}
                value={archive?.title}
                onChange={onTitleChanged}
                InputProps={{
                    disableUnderline: true
                }}
            />

            <TextField
                className={classes.description}
                id="standard-basic"
                size='medium'
                label='Description'
                value={archive?.description}
                onChange={onDescriptionChanged}
                InputProps={{
                    disableUnderline: true
                }}
            />

            <div className={classes.chips}>
                <ChipInput
                    name='Categories: '
                    chips={archive?.categories}
                    type={ChipType.Category}
                    kind={archive?.kind}
                    editor={{
                        onChipDeleted: (text) => onChipChanged({text, added: false, isTag: false}),
                        onChipAdded: (text) => onChipChanged({text, added: true, isTag: false})
                    }}
                />
                <ChipInput
                    name='Tags: '
                    chips={archive?.tags}
                    type={ChipType.Tag}
                    kind={archive?.kind}
                    editor={{
                        onChipDeleted: (text) => onChipChanged({text, added: false, isTag: true}),
                        onChipAdded: (text) => onChipChanged({text, added: true, isTag: true})
                    }}
                />
            </div>

            <TextField
                className={classes.description}
                id="standard-basic"
                size='medium'
                label='Header Image'
                value={archive?.thumbnail}
                onChange={onHeaderImageChanged}
                InputProps={{
                    classes: {input: classes.headerImageSize},
                    disableUnderline: true
                }}
            />

            <Card className={classes.cardBackground} elevation={1}>
                <CardMedia
                    className={classes.cardImage}
                    image={archive?.thumbnail}
                    title={archive?.title}
                />
            </Card>

            <div className={classes.editor}>
                <MEDitor
                    value={archive?.body || ''}
                    onChange={onBodyChanged}
                    height={1000}
                />
            </div>

            {/*<MEDditor.Markdown source={value} />*/}

        </div>
    );
}

export const ArchiveEdit = () => ArchiveCreateOrEdit({isCreating: false});

export const ArchiveCreate = () => ArchiveCreateOrEdit({isCreating: true});
