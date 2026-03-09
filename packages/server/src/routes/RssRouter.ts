import { Express } from 'express';
import RSS from 'rss';
import { Article } from '../models/ArticleSchema';
import { Project } from '../models/ProjectSchema';
import { Talk } from '../models/TalkSchema';
import { ArchiveDocument } from '../models/Archive';
import config from '../config/config';

export const rssRouter = (app: Express): void => {
    app.route('/rss')
        .get(async (req, res) => {
            const feed = new RSS({
                title: 'Adetunji Dahunsi',
                description: 'A collection of my thoughts and experiences.',
                feed_url: `${config.apiEndpoint}/rss`,
                site_url: config.apiEndpoint,
                image_url: 'https://storage.googleapis.com/tunji-web-public/article-media/avatar.jpg',
                managingEditor: 'tunji@tunji.dev (Adetunji Dahunsi)',
                webMaster: 'tunji@tunji.dev (Adetunji Dahunsi)',
                copyright: '2025 Adetunji Dahunsi',
                language: 'en',
                categories: ['Tech', 'Software', 'Art', 'Design'],
                pubDate: new Date(),
                ttl: 60 * 24 * 7, // 1 week in minutes
            });

            const [articles, projects, talks] = await Promise.all([
                Article.find().sort({created: -1}).limit(100).exec(),
                Project.find().sort({created: -1}).limit(100).exec(),
                Talk.find().sort({created: -1}).limit(100).exec(),
            ]);

            const archives: ArchiveDocument[] = [...articles, ...projects, ...talks].sort(
                (a, b) => b.created.getTime() - a.created.getTime()
            );

            archives.forEach((archive) => {
                feed.item({
                    title: archive.title,
                    description: archive.description,
                    url: `${config.apiEndpoint}/${archive.kind}/${archive.link}`,
                    categories: archive.categories,
                    author: 'Adetunji Dahunsi',
                    date: archive.created,
                    enclosure: {
                        url: archive.thumbnail,
                        type: 'image/*'
                    }
                });
            });

            res.set('Content-Type', 'application/rss+xml');
            res.send(feed.xml());
        });

    app.route('/.well-known/site.standard.publication')
        .get(async (req, res) => {
            res.send('at://did:plc:6q4y7p2wft3tncsffspts3m5/site.standard.publication/3ddckoeex22s5');
        });
};
