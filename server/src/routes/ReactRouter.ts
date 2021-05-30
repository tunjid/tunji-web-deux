import { Express, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import util from 'util';
import scraper from 'open-graph-scraper';
import ReactDOMServer from 'react-dom/server';
import { App, store } from 'client';

import {
    describeRoute,
    OpenGraphScrapeEndpoint,
    RouteDescription,
    ArchiveKind
} from 'common';

import { Article } from '../models/ArticleSchema';
import { Project } from '../models/ProjectSchema';
import { Talk } from '../models/TalkSchema';

import config from '../config/config';
import { getErrorMessage } from '../controllers/Common';

interface OpenGraphParams {
    title: string;
    description: string;
    image: string;
    url: string;
    siteName: string;
}

const archiveModels = [Article, Project, Talk];

const readFilePromise = util.promisify<string, string>((argument, callback) => fs.readFile(argument, 'utf8', callback));

export default function (app: Express): void {
    const indexPath = path.join(__dirname, '../../../', 'build', 'client', 'index.html');
    app.route(`/${OpenGraphScrapeEndpoint}`)
        .get(async (req: Request, res: Response) => {
            const url = req.query.url as unknown as string | undefined;
            if (!url) return res.status(400).send({
                message: getErrorMessage('There is no url to scrape')
            });
            const {error, result} = await scraper({url});

            return error ? res.status(400).send({
                message: getErrorMessage(`Error scraping for open graph results: ${JSON.stringify(error)}`)
            }) : res.json(result);
        });

    app.all(
        '/*',
        async (req: Request, res: Response) => {
            let webPage = await readFilePromise(indexPath);

            const params = await openGraphParams(describeRoute(req.path));
            // replace the special strings with server generated strings
            webPage = webPage.replace(/\$OG_TITLE/g, params.title);
            webPage = webPage.replace(/\$OG_DESCRIPTION/g, params.description);
            webPage = webPage.replace(/\$OG_IMAGE/g, params.image);
            webPage = webPage.replace(/\$OG_URL/g, params.url);
            webPage = webPage.replace(/\$OG_SITE_NAME/g, params.siteName);
            res.send(webPage);
        }
    );
}

async function openGraphParams({root, archiveId}: RouteDescription): Promise<OpenGraphParams> {
    switch (root.toLowerCase()) {
        case 'about': {
            return {
                title: 'About Tunji',
                description: 'What I\'ve been up to',
                image: config.rootIndexImage,
                url: 'https://tunjd.com/about',
                siteName: 'tunjid.com',
            };
        }
        case ArchiveKind.Articles:
        case ArchiveKind.Projects:
        case ArchiveKind.Talks: {
            const modelAndId = archiveId
                ? archiveModels
                    .map(model => ({model, id: archiveId}))
                    .find(modelAndId => modelAndId.model.getKind() === root)
                : undefined;

            const document = modelAndId ? await modelAndId.model.findById(modelAndId.id).exec() : undefined;

            return {
                title: document?.title || `${root} by Tunji`,
                description: document?.description || `An archive of my ${root}`,
                image: document?.thumbnail || config.archiveListDefaultImage,
                url: document?.link || `https://tunjid.com/${root.toLowerCase()}`,
                siteName: 'tunjid.com',
            };
        }
        default: {
            return {
                title: 'Tunji\'s Web Corner',
                description: 'Adetunji Dahunsi\'s Portfolio',
                image: config.rootIndexImage,
                url: 'https://tunjd.com',
                siteName: 'tunjid.com',
            };
        }
    }
}
