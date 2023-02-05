import { Express } from 'express';
import { UserController } from '../controllers/UserController';

import { ArchiveDocument, ArchiveModel } from '../models/Archive';
import archiveFileController from '@tunji-web/server/src/controllers/ArchiveFileController';
import archiveController from '@tunji-web/server/src/controllers/ArchiveController';
import { FileDeleter, FileReader } from '@tunji-web/server/src/controllers/UploadController';

export default function <T extends ArchiveDocument>(app: Express, model: ArchiveModel<T>, userController: UserController): void {
    const fileModel = model.fileModel();
    const archives = archiveController(model);
    const archiveFiles = archiveFileController(model);
    const modelPath = fileModel.modelName.toLowerCase();
    const routeName = `${modelPath}s`;
    const paramName = `${modelPath}Id`;


    app.route(`/api/${routeName}`)
        .get(userController.requiresLogin, archiveFiles.find);

    app.route(`/api/${routeName}/:${paramName}`)
        .get(archiveFiles.sendArchiveFile)
        .delete(
            userController.requiresLogin,
            archives.hasAuthorization,
            archiveFiles.remove,
            FileDeleter,
            archiveFiles.sendArchiveFile
        );

    app.route('/files/*')
        .get(
            archiveFiles.fileByPath,
            FileReader
        );
    
    app.param(paramName, archiveFiles.byId);
}
