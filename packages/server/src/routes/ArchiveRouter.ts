import { Express } from 'express';
import archiveController from '../controllers/ArchiveController';
import { UserController } from '../controllers/UserController';
import ImageUploader, { FileDeleter } from '@tunji-web/server/src/controllers/UploadController';

import { ArchiveDocument, ArchiveModel } from '../models/Archive';
import { serverMessage } from '@tunji-web/server/src/controllers/Common';
import archiveFileController from '@tunji-web/server/src/controllers/ArchiveFileController';

export default function <T extends ArchiveDocument>(app: Express, model: ArchiveModel<T>, userController: UserController): void {
    const archives = archiveController(model);
    const archiveFiles = archiveFileController(model);
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
            archives.hasAuthorization,
            archives.put,
            archives.sendArchive
        )
        .post(
            userController.requiresLogin,
            archives.hasAuthorization,
            ...ImageUploader(
                {
                    key: 'photo',
                    pathFunction: (req) => `${routeName}/${req.archive.key}`,
                    permittedMimeTypes: [
                        'image/jpeg',
                        'image/png',
                        'image/gif',
                    ],
                    handlers: [
                        archiveFiles.create,
                        archives.updateThumbnail,
                        archiveFiles.removeByUrl,
                        FileDeleter,
                        archives.sendArchive
                    ]
                }
            ),
        )
        .delete(
            archives.remove,
            archives.sendArchive
        );

    app.route(`/api/${routeName}/:${paramName}/files`)
        .get(archives.filesForId)
        .post(
            userController.requiresLogin,
            archives.hasAuthorization,
            ...ImageUploader(
                {
                    key: 'file',
                    pathFunction: (req) => `${routeName}/${req.archive.key}`,
                    permittedMimeTypes: undefined,
                    handlers: [
                        archiveFiles.create,
                        (req, res) => {
                            serverMessage(res, {
                                statusCode: 200,
                                message: 'Uploaded file',
                            });
                        }
                    ]
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
