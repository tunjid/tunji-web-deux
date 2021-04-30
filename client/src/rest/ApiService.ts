import axios from 'axios';
import { ArchiveKind, ArchiveLike, ArchiveSummary, UserLike } from "../common/Models";
import { SignInArgs } from "../actions/Auth";
import { ArchivePayload, ArchivesQuery, yearAndMonthParam } from "../actions/Archive";

const transport = axios.create({
    withCredentials: true
})

const session = () => transport.get<UserLike>(`/api/session`);
const signIn = (args: SignInArgs) => transport.post<UserLike>(`/api/sign-in`, args);
const fetchArchives = (payload: ArchivePayload<ArchivesQuery>) => {
    const {category} = payload.item;
    const categoryQuery = category ? [`category=${category}`] : [];
    const yearAndMonth = yearAndMonthParam(payload.item);
    const yearAndMonthQuery = yearAndMonth ? [`year=${yearAndMonth.year}`, `month=${yearAndMonth.month}`] : [];
    const queryString = [...categoryQuery, ...yearAndMonthQuery].map((query, index) => {
        return index === 0 ? `?${query}` : `&${query}`
    }).join('')

    return transport.get<ArchiveLike[]>(`/api/${payload.kind}${queryString}`);
};
const createArchive = (archive: ArchiveLike) => transport.post<ArchiveLike>(`/api/${archive.kind}/${archive.key}`, archive);
const readArchive = (kind: ArchiveKind, id: string) => transport.get<ArchiveLike>(`/api/${kind}/${id}`);
const archiveSummary = (kind: ArchiveKind) => transport.get<ArchiveSummary[]>(`/api/${kind}/summary`);
const updateArchive = (archive: ArchiveLike) => transport.put<ArchiveLike>(`/api/${archive.kind}/${archive.key}`, archive);
const deleteArchive = (archive: ArchiveLike) => transport.delete<ArchiveLike>(`/api/${archive.kind}/${archive.key}`);

const ApiService = {
    session,
    signIn,
    createArchive,
    readArchive,
    updateArchive,
    deleteArchive,
    fetchArchives,
    archiveSummaries: archiveSummary
};

export default ApiService;
