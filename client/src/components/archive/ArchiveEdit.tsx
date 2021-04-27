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
import { archiveSelector } from "./Common";
import _ from 'lodash';
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import ChipInput from "./ChipInput";
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => createStyles({
        root: {
            display: 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
            'justify-content': 'center',
        },
        date: {
            'margin-top': theme.spacing(4),
            'margin-bottom': theme.spacing(2),
        },
        title: {
            width: '90vw',
            margin: theme.spacing(1),
        },
        titleSize: {
            fontSize: 50
        },
        description: {
            width: '90vw',
            margin: theme.spacing(1),
        },
        descriptionSize: {
            fontSize: 30
        },
        headerImageSize: {
            fontSize: 14
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
            width: '90vw',
        },
        cardBackground: {
            height: '50vh',
            width: '90vw',
            margin: theme.spacing(0.5),
        },
        editor: {
            width: '90vw',
            'max-width': '800',
            margin: theme.spacing(0.5),
        },
        cardImage: {
            height: '50vh',
            width: '90vw',
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
        const existing = isTag ? archive.tags : archive.categories;
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
        if (!isCreating) dispatch(ArchiveActions.readArchive({kind, view: "edit", id: archiveId}));
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
                value={archive?.title}
                onChange={onTitleChanged}
                InputProps={{
                    classes: {input: classes.titleSize},
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
                    classes: {input: classes.descriptionSize},
                    disableUnderline: true
                }}
            />

            <ChipInput
                name='Categories: '
                chips={archive?.categories}
                chipColor={'#4282F1'}
                onChipDeleted={(text) => onChipChanged({text, added: false, isTag: false})}
                onChipAdded={(text) => onChipChanged({text, added: true, isTag: false})}
            />

            <ChipInput
                name='Tags: '
                chips={archive?.tags}
                chipColor={theme.palette.secondary.dark}
                onChipDeleted={(text) => onChipChanged({text, added: false, isTag: true})}
                onChipAdded={(text) => onChipChanged({text, added: true, isTag: true})}
            />

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
