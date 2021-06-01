import { Express, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import promise from 'bluebird';
import scraper from 'open-graph-scraper';
import { ArchiveKind, ArchiveLike, describeRoute, OpenGraphScrapeEndpoint, RouteDescription } from '@tunji-web/common';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { App, ArchiveActions, serverStore, StoreState } from '@tunji-web/client';

import { Article } from '../models/ArticleSchema';
import { Project } from '../models/ProjectSchema';
import { Talk } from '../models/TalkSchema';

import { getErrorMessage } from '../controllers/Common';
import { Provider } from 'react-redux';
import { ArchiveDocument } from '@tunji-web/server/src/models/Archive';
import { Store } from 'redux';

import config from '../config/config';

interface OpenGraphParams {
    title: string;
    description: string;
    image: string;
    url: string;
    siteName: string;
}

const archiveModels = [Article, Project, Talk];

export default function (app: Express): void {
    const indexHtml = fs.readFileSync(path.join(__dirname, '../../', 'client', 'public', 'index.html'), 'utf8');
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
        '*',
        async (req: Request, res: Response) => {
            let webPage = indexHtml;
            const sheets = new ServerStyleSheets();
            const connectedStore = serverStore(req.path);

            const params = await openGraphParams(connectedStore.store, describeRoute(req.path));

            const app = ReactDOMServer.renderToString(
                sheets.collect(
                    <Provider store={connectedStore.store}>
                        <App history={connectedStore.history}/>
                    </Provider>
                )
            );

            // replace the special strings with server generated strings
            webPage = webPage.replace(/\$PUBLIC_URL/g, config.apiEndpoint);
            webPage = webPage.replace(/\$OG_TITLE/g, params.title);
            webPage = webPage.replace(/\$OG_DESCRIPTION/g, params.description);
            webPage = webPage.replace(/\$OG_IMAGE/g, params.image);
            webPage = webPage.replace(/\$OG_URL/g, params.url);
            webPage = webPage.replace(/\$OG_SITE_NAME/g, params.siteName);
            webPage = webPage.replace(
                '<style id="jss-server-side"></style>',
                `<style id="jss-server-side">${sheets.toString()}</style>`
            );
            webPage = webPage.replace(
                '<div id="root"></div>',
                `<div id="root">${app}</div>`
            );
            webPage = webPage.replace(
                ' <script>window.__PRELOADED_STATE__ = undefined</script>',
                `<script nonce="${req.serverReduxStateNonce}">window.__PRELOADED_STATE__ = ${JSON.stringify(connectedStore.store.getState()).replace(
                    /</g,
                    '\\u003c'
                )}</script>`
            );

            res.send(webPage);
        }
    );
}

async function openGraphParams(
    store: Store<StoreState>,
    {root, archiveId}: RouteDescription
): Promise<OpenGraphParams> {
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
            const kind: ArchiveKind = root.toLowerCase() as ArchiveKind;
            const modelAndId = archiveId
                ? archiveModels
                    .map(model => ({model, id: archiveId}))
                    .find(modelAndId => modelAndId.model.getKind() === root)
                : undefined;

            const document: ArchiveDocument | null | undefined = modelAndId
                ? await modelAndId.model.findById(modelAndId.id)
                    .populate('author')
                    .exec()
                : undefined;

            const documents: ArchiveDocument[] | null | undefined = archiveId
                ? undefined
                : await archiveModels.find(model => model.getKind() === kind)
                    ?.find()
                    ?.limit(13)
                    ?.sort({'created': -1})
                    ?.populate('author', 'firstName lastName fullName imageUrl')
                    .exec();

            if (document) store.dispatch(ArchiveActions.setArchiveDetail({
                kind,
                item: document.toJSON()
            }));
            if (documents) store.dispatch(ArchiveActions.addArchives({
                kind,
                item: documents.map(it => it.toJSON())
            }));

            return {
                title: document?.title || `${root} by Tunji`,
                description: document?.description || `An archive of my ${root}`,
                image: document?.thumbnail || config.archiveListDefaultImage,
                url: document?.link || `https://tunjid.com/${root.toLowerCase()}`,
                siteName: 'tunjid.com',
            };
        }
        default: {
            const archives: { item: ArchiveLike[]; kind: ArchiveKind }[] = await promise.all(archiveModels.map(async model => {
                const archives = await model.find()
                    .limit(6)
                    .sort({'created': -1})
                    .populate('author', 'firstName lastName fullName imageUrl')
                    .exec();
                return {
                    kind: model.getKind(),
                    item: archives
                };
            }));

            archives.map(it => ArchiveActions.addArchives(it))
                .forEach(action => store.dispatch(action));

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
