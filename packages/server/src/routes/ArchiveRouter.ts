import { Express } from 'express';
import archiveController from '../controllers/ArchiveController';
import { UserController } from '../controllers/UserController';

import { ArchiveDocument, ArchiveModel } from '../models/Archive';

export default function <T extends ArchiveDocument>(app: Express, model: ArchiveModel<T>, userController: UserController): void {
    const archives = archiveController(model);
    const modelPath = model.modelName.toLowerCase();
    const routeName = `${modelPath}s`;
    const paramName = `${modelPath}Id`;

    app.route(`/api/${routeName}/summary`)
        .get(archives.summary);

    app.route(`/api/${routeName}/recentTags`)
        .get(archives.tagsOrCategories);

    app.route(`/api/${routeName}`)
        .post(userController.requiresLogin, archives.create)
        .get(archives.find);

    app.route(`/api/${routeName}/:${paramName}`)
        .get(archives.get)
        .put(userController.requiresLogin, archives.put)
        .delete(userController.requiresLogin, archives.hasAuthorization, archives.remove);

    app.route(`/api/${routeName}/:${paramName}/incrementLikes`)
        .post(archives.incrementLikes);

    app.param(paramName, archives.byId);
}
