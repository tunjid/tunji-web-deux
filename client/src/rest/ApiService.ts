import axios from 'axios';
import { ArchiveKind, ArchiveLike, ArchiveSummary, UserLike } from "../client-server-common/Models";
import { SignInArgs } from "../actions/Auth";
import { ArchivesQuery, yearAndMonthParam } from "../actions/Archive";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

const transport = axios.create({
    withCredentials: true
})

const session = () => transport.get<UserLike>(`${API_ENDPOINT}/api/session`);
const signIn = (args: SignInArgs) => transport.post<UserLike>(`${API_ENDPOINT}/api/sign-in`, args);
const fetchArchives = (query: ArchivesQuery) => {
    const {category} = query.params;
    const categoryQuery = category ? [`category=${category}`] : [];
    const yearAndMonth = yearAndMonthParam(query);
    const yearAndMonthQuery = yearAndMonth ? [`year=${yearAndMonth.year}`, `month=${yearAndMonth.month}`] : [];
    const queryString = [...categoryQuery, ...yearAndMonthQuery].map((param, index) => {
        return index === 0 ? `?${param}` : `&${param}`
    }).join('')

    return transport.get<ArchiveLike[]>(`${API_ENDPOINT}/api/${query.kind}${queryString}`);
};
const createArchive = (archive: ArchiveLike) => transport.post<ArchiveLike>(`${API_ENDPOINT}/api/${archive.kind}/${archive.key}`, archive);
const readArchive = (kind: ArchiveKind, id: string) => transport.get<ArchiveLike>(`${API_ENDPOINT}/api/${kind}/${id}`);
const archiveSummary = (kind: ArchiveKind) => transport.get<ArchiveSummary[]>(`${API_ENDPOINT}/api/${kind}/summary`);
const updateArchive = (archive: ArchiveLike) => transport.put<ArchiveLike>(`${API_ENDPOINT}/api/${archive.kind}/${archive.key}`, archive);
const deleteArchive = (archive: ArchiveLike) => transport.delete<ArchiveLike>(`${API_ENDPOINT}/api/${archive.kind}/${archive.key}`);

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
