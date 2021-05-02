import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import { Chip } from "@material-ui/core";
import { theme } from "../../styles/PersistentUi";
import { ArchiveKind } from "../../common/Models";
import { StylelessAnchor } from "../../styles/Common";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            '& > *': {
                margin: theme.spacing(0.5),
            },
        },
        chipAnchor: {
            ...StylelessAnchor,
        },
        input: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
        iconButton: {
            padding: 10,
        },
    }),
);

export enum ChipType {
    Category = 'category',
    Tag = 'Tag'
}

interface ChipEditor {
    onChipDeleted: (chip: string) => void
    onChipAdded: (chip: string) => void
}

export interface Props {
    name: string,
    chips?: string[],
    type: ChipType,
    kind?: ArchiveKind,
    editor?: ChipEditor
}

export default function ChipInput({name, chips, type, kind, editor}: Props) {
    const classes = useStyles();

    const [textValue, setText] = useState('');

    const chipColor = type === ChipType.Category ? '#4282F1' : theme.palette.secondary.dark;
    const {onChipDeleted, onChipAdded} = editor || {}

    const deleteChip = onChipDeleted
        ? (text: string) => () => onChipDeleted(text)
        : undefined;

    const addChip: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined = onChipAdded
        ? (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                onChipAdded(textValue);
                setText('');
            }
        }
        : undefined;

    const editField = editor
        ? <InputBase
            className={classes.input}
            placeholder="Add item"
            value={textValue}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={addChip}
            inputProps={{'aria-label': 'search google maps'}}
        />
        : undefined;

    return (
        <div className={classes.root}>
            {name}
            {(chips || []).map((text) =>
                <Link
                    className={classes.chipAnchor}
                    to={`/${kind}/?category=${text}`}
                    key={text}
                >
                    <Chip
                        label={text}
                        color="secondary"
                        onDelete={deleteChip?.(text)}
                        style={{backgroundColor: chipColor}}
                        size="small"/>
                </Link>
            )}

            {editField}
        </div>
    );
}
