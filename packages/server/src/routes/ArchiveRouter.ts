import { Express } from 'express';
import archiveController from '../controllers/ArchiveController';
import { UserController } from '../controllers/UserController';
import ImageUploader from '@tunji-web/server/src/controllers/UploadController';

import { ArchiveDocument, ArchiveModel } from '../models/Archive';
import { serverMessage } from '@tunji-web/server/src/controllers/Common';

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
        .get(archives.sendArchive)
        .put(
            userController.requiresLogin,
            archives.put,
            archives.sendArchive
        )
        .post(
            userController.requiresLogin,
            ...ImageUploader(
                {
                    key: 'photo',
                    pathFunction: (req) => `${routeName}/${req.archive.key}`,
                    deleteAfterUpload: true,
                    postUpload: archives.uploadImage,
                    respond: archives.sendArchive,
                }
            ),
        )
        .delete(
            userController.requiresLogin,
            archives.hasAuthorization,
            archives.remove,
            archives.sendArchive
        );

    app.route(`/api/${routeName}/:${paramName}/photos`)
        .post(
            userController.requiresLogin,
            ...ImageUploader(
                {
                    key: 'photo',
                    pathFunction: (req) => `${routeName}/${req.archive.key}`,
                    deleteAfterUpload: false,
                    postUpload: (req, res, next) => next(),
                    respond: (req, res) => {
                        serverMessage(res, {
                            statusCode: 200,
                            message: 'Uploaded photo',
                        });
                    },
                }
            ),
        );

    app.route(`/api/${routeName}/:${paramName}/incrementLikes`)
        .post(
            archives.incrementLikes,
            archives.sendArchive
        );

    app.param(paramName, archives.byId);
}
