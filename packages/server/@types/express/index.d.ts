import { ArchiveDocument } from '@tunji-web/server/src/models/Archive';
import { UserDocument } from '@tunji-web/server/src/models/UserSchema';
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
            fileOldUrl: string | undefined
        }
    }
}
