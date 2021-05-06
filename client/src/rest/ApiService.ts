import axios from 'axios';
import { ArchiveKind, ArchiveLike, ArchiveSummary, UserLike } from "../client-server-common/Models";
import { SignInArgs } from "../actions/Auth";
import { ArchivesQuery, yearAndMonthParam } from "../actions/Archive";
import { OpenGraphData } from "../components/open-graph/OpenGraph";
import { OpenGraphScrapeEndpoint } from "../client-server-common/RouteUtilities";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

const transport = axios.create({
    withCredentials: true
})

const createQueryString = (params: Record<string, string>) => Object.entries(params)
    .map(([key, value], index) => index === 0 ? `?${key}=${value}` : `&${key}=${value}`)
    .join('');

const session = () => transport.get<UserLike>(`${API_ENDPOINT}/api/session`);
const signIn = (args: SignInArgs) => transport.post<UserLike>(`${API_ENDPOINT}/api/sign-in`, args);
const fetchArchives = (query: ArchivesQuery) => {
    const yearAndMonth = yearAndMonthParam(query);
    const {dateInfo, ...sanitizedQuery} = query.params;
    const finalQuery = yearAndMonth
        ? {...sanitizedQuery, month: yearAndMonth.month.toString(), year: yearAndMonth.year.toString()}
        : sanitizedQuery;

    const queryString = createQueryString(finalQuery);

    return transport.get<ArchiveLike[]>(`${API_ENDPOINT}/api/${query.kind}${queryString}`);
};
const createArchive = (archive: ArchiveLike) => transport.post<ArchiveLike>(`${API_ENDPOINT}/api/${archive.kind}/${archive.key}`, archive);
const readArchive = (kind: ArchiveKind, id: string) => transport.get<ArchiveLike>(`${API_ENDPOINT}/api/${kind}/${id}`);
const archiveSummaries = (kind: ArchiveKind) => transport.get<ArchiveSummary[]>(`${API_ENDPOINT}/api/${kind}/summary`);
const updateArchive = (archive: ArchiveLike) => transport.put<ArchiveLike>(`${API_ENDPOINT}/api/${archive.kind}/${archive.key}`, archive);
const deleteArchive = (archive: ArchiveLike) => transport.delete<ArchiveLike>(`${API_ENDPOINT}/api/${archive.kind}/${archive.key}`);
const scrapeOpenGraph = (url: string) => transport.get<OpenGraphData>(`${API_ENDPOINT}/${OpenGraphScrapeEndpoint}?url=${url}`);

const ApiService = {
    session,
    signIn,
    createArchive,
    readArchive,
    updateArchive,
    deleteArchive,
    fetchArchives,
    archiveSummaries,
    scrapeOpenGraph,
};

export default ApiService;
