import { ArchiveDocument } from '@tunji-web/server/src/models/Archive';
import { UserDocument } from '@tunji-web/server/src/models/UserSchema';
import { UserLike } from '@tunji-web/common';
import { ChangeListModel } from '@tunji-web/server/src/models/ChangeListSchema';
import { ArchiveFileDocument } from '@tunji-web/server/src/models/ArchiveFileSchema';

declare global {
    namespace Express {

        interface User extends UserLike{
            id: string
        }

        interface Request {
            pathUser: UserDocument
            archive: ArchiveDocument
            archiveFile: ArchiveFileDocument
            changeListModel: ChangeListModel
            serverReduxStateNonce: string
            filePublicUrl: string
            fileOldUrl: string | undefined
        }
    }
}
