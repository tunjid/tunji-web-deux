import { ArchiveDocument } from 'server/models/Archive'
import { UserDocument } from 'server/models/UserSchema'

declare global {
    namespace Express {
        interface Request {
            user: UserDocument
            archive: ArchiveDocument
        }
    }
}
