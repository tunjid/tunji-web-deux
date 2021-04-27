import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import { Chip } from "@material-ui/core";
import { theme } from "../../styles/PersistentUi";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width:'90vw',
            '& > *': {
                margin: theme.spacing(0.5),
            },
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

export interface Props {
    name: string,
    chips?: string[],
    chipColor?: string,
    onChipDeleted: (chip: string) => void
    onChipAdded: (chip: string) => void
}

export default function ChipInput({name, chips, chipColor, onChipDeleted, onChipAdded}: Props) {
    const classes = useStyles();

    const [textValue, setText] = useState('');

    const deleteChip = (text: string) => () => {
        onChipDeleted(text);
    };

    const addChip: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onChipAdded(textValue);
            setText('');
        }
    };

    return (
        <div className={classes.root}>
            {name}
            {(chips || []).map((text) => <Chip
                key={text}
                label={text}
                color="secondary"
                onDelete={deleteChip(text)}
                style={{backgroundColor: chipColor || theme.palette.secondary.dark}}
                size="small"/>
            )}

            <InputBase
                className={classes.input}
                placeholder="Add item"
                value={textValue}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={addChip}
                inputProps={{'aria-label': 'search google maps'}}
            />
        </div>
    );
}
