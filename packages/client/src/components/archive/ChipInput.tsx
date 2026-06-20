import React, { useState } from 'react';
import { ArchiveKind } from '@tunji-web/common';
import { Link, useNavigate } from 'react-router-dom';
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
    editor?: ChipEditor,
    // Render chips as buttons that navigate via onClick instead of as <Link> anchors. Use when ChipInput
    // is nested inside another anchor (e.g. an ArchiveCard whose body is a detail <Link>), where an <a>
    // inside an <a> is invalid HTML. A <div role="button"> chip is valid there and still navigates.
    linkless?: boolean,
}

export default function ChipInput({name, chips, type, kind, editor, linkless}: Props) {
    const [textValue, setText] = useState('');
    const navigate = useNavigate();
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
                linkless
                    ? <Chip
                        key={text}
                        label={text}
                        clickable
                        onClick={(event: React.MouseEvent) => {
                            // Nested inside another <Link>: cancel the anchor's default navigation and
                            // stop the click reaching the outer Link's handler, then navigate ourselves.
                            event.preventDefault();
                            event.stopPropagation();
                            navigate(`/${kind}/?${type}=${text}`, {viewTransition: true});
                        }}
                        onDelete={deleteChip?.(text)}
                        size="small"/>
                    : <Link
                        to={`/${kind}/?${type}=${text}`}
                        key={text}
                        viewTransition
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
