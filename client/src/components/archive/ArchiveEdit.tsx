import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { Chip, TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { theme } from "../../styles/PersistentUi";
import MEDitor from '@uiw/react-md-editor';
import { ArchiveActions } from "../../actions/Archive";
import { archiveSelector } from "./Common";
import _ from 'lodash';

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
            margin: theme.spacing(2),
        },
        titleSize: {
            fontSize: 50
        },
        description: {
            width: '90vw',
            margin: theme.spacing(2),
        },
        descriptionSize: {
            fontSize: 30
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
            'align-items': 'center',
            '& > *': {
                margin: theme.spacing(0.5),
            },
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

    const onChipChanged = ({text, added, isTag}: ChipChange) => () => {
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
        if (isSignedIn) menuItems.push({
            id: isCreating ? 'create' : 'update',
            text: isCreating ? 'Create' : 'Update',
            action: isCreating ? ArchiveActions.createArchive(kind) : ArchiveActions.updateArchive(kind),
        });
        if (!isCreating) menuItems.push({
            id: 'delete',
            text: 'Delete',
            action: ArchiveActions.deleteArchive(kind),
        });
        dispatch(PersistentUiActions.modifyAppBar({
            hasAppBarShadow: true,
            hasAppBarSpacer: true,
            appBarColor: theme.palette.primary.dark,
            menuItems,
        }));
    }, [kind, isCreating, isSignedIn, dispatch]);

    return (
        <div className={classes.root}>
            <Typography className={classes.date} gutterBottom variant="subtitle1">
                {archive?.created?.toDateString() || ''}
            </Typography>

            <div className={classes.chips}>
                {(archive?.categories || []).map((text) => <Chip
                    key={text}
                    label={text}
                    color="secondary"
                    onDelete={onChipChanged({text, added: false, isTag: false})}
                    style={{backgroundColor: '#4282F1'}}
                    size="small"/>
                )}
            </div>

            <div className={classes.chips}>
                {(archive?.tags || []).map((text) => <Chip
                    key={text}
                    label={text}
                    color="secondary"
                    onDelete={onChipChanged({text, added: false, isTag: true})}
                    style={{backgroundColor: theme.palette.secondary.dark}}
                    size="small"/>
                )}
            </div>

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

            <div className={classes.editor}>
                <MEDitor
                    value={archive?.body || ''}
                    onChange={onBodyChanged}
                />
            </div>

            {/*<MEDditor.Markdown source={value} />*/}

        </div>
    );
}

export const ArchiveEdit = () => ArchiveCreateOrEdit({isCreating: false});

export const ArchiveCreate = () => ArchiveCreateOrEdit({isCreating: true});
