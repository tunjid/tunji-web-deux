import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from "react-router-dom";
import { ArchiveKind } from "../../reducers/Archive";
import { ArchiveLike } from "../../../../common/Models";
import axios from "axios";
import { Chip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() => createStyles({
        root: {},
    }
));

interface ArchiveDetailParams {
    archiveId: string
}

const ArchiveDetail = () => {
    const classes = useStyles();
    const {pathname} = useLocation();
    const {archiveId} = useParams<ArchiveDetailParams>();
    const [archive, setArchive] = useState<ArchiveLike>();

    console.log('WHEREEEEE');

    const kind = Object.keys(ArchiveKind).find((key) => key === pathname)!!;

    console.log(`UMMMMMM. Path name: ${pathname}; kind: ${kind}`);

    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get<ArchiveLike>(`/api${pathname}`);
            const status = response.status;
            console.log(`DONEEEE; ${JSON.stringify(response)}`)
            if (status < 200 || status > 399) return;
            setArchive({...response.data, created: new Date(response.data.created)})
        }
        fetch();
        console.log('LOADINGGG');
    }, [archiveId, kind]);

    return (
        <div className={classes.root}>
            <div>{'HELLO HI HOW ARE YOU'}</div>
            <Typography gutterBottom variant="h1">
                {'HELLO HI HOW ARE YOU'}
            </Typography>
            {(archive?.categories || []).map((label) => <Chip
                label={label}
                color="secondary"
                style={{backgroundColor: '#4282F1'}}
                size="small"/>
            )}
        </div>
    );
}

export default ArchiveDetail;
