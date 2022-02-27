import { Express } from 'express';
import changeListController from '@tunji-web/server/src/controllers/ChangeListController';

export default function (app: Express): void {
    const changeList = changeListController();

    app.route('/api/:model/changelist')
        .get(changeList.changes);

    app.param('model', changeList.modelMatch);
}
