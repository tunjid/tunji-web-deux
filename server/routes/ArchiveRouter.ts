import { Express } from 'express';
import archiveController from '../controllers/ArchiveController';
import * as users from '../controllers/UserController';

import { ArchiveModel } from '../models/Archive';

export default function (app: Express, model: ArchiveModel): void {
    const archives = archiveController(model);
    const routeName = `${model.modelName.toLowerCase()}s`;

    app.route(`/api/${routeName}/archives`)
        .get(archives.archives);

    app.route(`/api/${routeName}/recentTags`)
        .get(archives.tagsOrCategories);

    app.route(`/api/${routeName}`)
        .post(users.requiresLogin, archives.create)
        .get(archives.find);

    app.route(`/api/${routeName}/:archiveId`)
        .get(archives.get)
        .put(users.requiresLogin, archives.put)
        .delete(users.requiresLogin, archives.hasAuthorization, archives.remove);

    app.param('archiveId', archives.archiveById);
}
