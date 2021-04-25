import axios from 'axios';
import { ArchiveKind, ArchiveLike, UserLike } from "../common/Models";
import { SignInArgs } from "../actions/Auth";

const transport = axios.create({
    withCredentials: true
})

const session = () => transport.get<UserLike>(`/api/session`);
const signIn = (args: SignInArgs) => transport.post<UserLike>(`/api/sign-in`, args);
const fetchArchive = (path:string) => transport.get<ArchiveLike>(`/api${path}`);
const fetchArchives = (kind: ArchiveKind) => transport.get<ArchiveLike[]>(`/api/${kind}`);
const saveArchive = (archive: ArchiveLike) => transport.put<ArchiveLike>(`/api/${archive.kind}/${archive.key}`, archive);

const ApiService = {session, signIn, saveArchive, fetchArchive, fetchArchives};

export default ApiService;
