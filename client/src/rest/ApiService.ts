import axios from 'axios';
import { ArchiveKind, ArchiveLike, UserLike } from "../common/Models";
import { SignInArgs } from "../actions/Auth";

const transport = axios.create({
    withCredentials: true
})

const session = () => transport.get<UserLike>(`/api/session`);
const signIn = (args: SignInArgs) => transport.post<UserLike>(`/api/sign-in`, args);
const fetchArchives = (kind: ArchiveKind) => transport.get<ArchiveLike[]>(`/api/${kind}`);
const createArchive = (archive: ArchiveLike) => transport.post<ArchiveLike>(`/api/${archive.kind}/${archive.key}`, archive);
const readArchive = (kind: ArchiveKind, id: string) => transport.get<ArchiveLike>(`/api/${kind}/${id}`);
const updateArchive = (archive: ArchiveLike) => transport.put<ArchiveLike>(`/api/${archive.kind}/${archive.key}`, archive);
const deleteArchive = (archive: ArchiveLike) => transport.delete<ArchiveLike>(`/api/${archive.kind}/${archive.key}`);

const ApiService = {
    session,
    signIn,
    createArchive,
    readArchive,
    updateArchive,
    deleteArchive,
    fetchArchives
};

export default ApiService;
