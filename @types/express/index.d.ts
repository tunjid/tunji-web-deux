import { ArchiveDocument } from 'server/models/Archive'
import { UserDocument } from 'server/models/UserSchema'
import { UserLike } from "../../common/Models";

declare global {
    namespace Express {

        interface User extends UserLike{
            id: string
        }

        interface Request {
            signedInUser: UserDocument
            archive: ArchiveDocument
        }
    }
}
