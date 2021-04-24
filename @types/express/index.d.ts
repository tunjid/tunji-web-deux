import { ArchiveDocument } from 'server/models/Archive'
import { UserDocument } from 'server/models/UserSchema'

declare global {
    namespace Express {

        interface User {
            id: string
        }

        interface Request {
            signedInUser: UserDocument
            archive: ArchiveDocument
        }
    }
}
