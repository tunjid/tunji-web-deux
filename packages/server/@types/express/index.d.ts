import { ArchiveDocument } from 'server/models/Archive';
import { UserDocument } from 'server/models/UserSchema';
import { UserLike } from '@tunji-web/common';
import { ChangeListModel } from '@tunji-web/server/src/models/ChangeListSchema';

declare global {
    namespace Express {

        interface User extends UserLike{
            id: string
        }

        interface Request {
            pathUser: UserDocument
            archive: ArchiveDocument
            changeListModel: ChangeListModel
            serverReduxStateNonce: string
            filePublicUrl: string
        }
    }
}
