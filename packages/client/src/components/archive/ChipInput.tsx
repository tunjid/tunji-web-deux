import React, { useState } from 'react';
import { ArchiveKind } from '@tunji-web/common';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { InputBase } from '@mui/material';

export enum ChipType {
    Category = 'category',
    Tag = 'tag'
}

interface ChipEditor {
    onChipDeleted: (chip: string) => void;
    onChipAdded: (chip: string) => void;
}

export interface Props {
    name: string,
    chips?: string[],
    type: ChipType,
    kind?: ArchiveKind,
    editor?: ChipEditor
}

export default function ChipInput({name, chips, type, kind, editor}: Props) {
    const [textValue, setText] = useState('');
    const {onChipDeleted, onChipAdded} = editor || {}

    const deleteChip = onChipDeleted
        ? (text: string) => (event: Event) => {
            event.preventDefault()
            onChipDeleted(text);
        }
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
            placeholder={`Add ${type}`}
            value={textValue}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={addChip}
            inputProps={{'aria-label': 'search google maps'}}
        />
        : undefined;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 1,
                alignItems: 'center',
            }}
        >
            {name}
            {(chips || []).map((text) =>
                <Link
                    to={`/${kind}/?${type}=${text}`}
                    key={text}
                >
                    <Chip
                        label={text}
                        onDelete={deleteChip?.(text)}
                        size="small"/>
                </Link>
            )}

            {editField}
        </Box>
    );
}
