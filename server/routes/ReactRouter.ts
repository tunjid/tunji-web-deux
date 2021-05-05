import { Express, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import util from 'util';
import { describeRoute, RouteDescription } from '../../client/src/client-server-common/RouteUtilities';

import { Article } from '../models/ArticleSchema';
import { Project } from '../models/ProjectSchema';
import { Talk } from '../models/TalkSchema';
import { ArchiveKind } from '../../client/src/client-server-common/Models';

interface OpenGraphParams {
    title: string
    description: string
    image: string
}

const archiveModels = [Article, Project, Talk];

const readFilePromise = util.promisify<string, string>((argument, callback) => fs.readFile(argument, 'utf8', callback));

export default function (app: Express): void {
    const indexPath = path.join(__dirname, '../../../', 'build', 'client', 'index.html');
    app.all(
        '/*',
        async (req: Request, res: Response) => {
            let webPage = await readFilePromise(indexPath);

            const params = await openGraphParams(describeRoute(req.path));
            // replace the special strings with server generated strings
            webPage = webPage.replace(/\$OG_TITLE/g, params.title);
            webPage = webPage.replace(/\$OG_DESCRIPTION/g, params.description);
            webPage = webPage.replace(/\$OG_IMAGE/g, params.image);
            res.send(webPage);
        }
    );
}

async function openGraphParams({root, archiveLookup}: RouteDescription): Promise<OpenGraphParams> {
    switch (root.toLowerCase()) {
        case 'about': {
            return {
                title: 'About Tunji',
                description: 'What I\'ve been up to',
                image: ''
            };
        }
        case ArchiveKind.Articles:
        case ArchiveKind.Projects:
        case ArchiveKind.Talks: {
            const modelAndId = archiveLookup
                ? archiveModels
                    .map(model => ({model, id: archiveLookup.archiveId}))
                    .find(modelAndId => modelAndId.model.getKind() === archiveLookup.kind)
                : undefined;

            const document = modelAndId ? await modelAndId.model.findById(modelAndId.id).exec() : undefined;

            return {
                title: document?.title || `${root} by Tunji`,
                description: document?.description || `An archive of my ${root}`,
                image: document?.thumbnail || ''
            };
        }
        default: {
            return {
                title: 'Tunji\'s Web Corner',
                description: 'Adetunji Dahunsi\'s Portfolio',
                image: ''
            };
        }
    }
}
