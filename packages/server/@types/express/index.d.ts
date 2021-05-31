import { ArchiveDocument } from 'server/models/Archive';
import { UserDocument } from 'server/models/UserSchema';
import { UserLike } from '@tunji-web/common';

declare global {
    namespace Express {

        interface User extends UserLike{
            id: string
        }

        interface Request {
            pathUser: UserDocument
            archive: ArchiveDocument
        }
    }
}
