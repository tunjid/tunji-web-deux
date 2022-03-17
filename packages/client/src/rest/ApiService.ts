import axios from 'axios';
import clientConfig from '../config';
import { ArchiveKind, ArchiveLike, ArchiveSummary, UserLike, OpenGraphScrapeQueryKey } from '@tunji-web/common';
import { SignInArgs } from '../actions/Auth';
import { ArchivesQuery, IncrementArchiveLikesRequest, yearAndMonthParam } from '../actions/Archive';
import { OpenGraphData } from '../reducers/OpenGraph';

const API_ENDPOINT = clientConfig.apiEndpoint || '';

const transport = axios.create({
    withCredentials: true
});

const session = () => transport.get<UserLike>(`${API_ENDPOINT}/api/session`);
const signIn = (args: SignInArgs) => transport.post<UserLike>(`${API_ENDPOINT}/api/sign-in`, args);
const fetchArchives = (query: ArchivesQuery) => {
    const yearAndMonth = yearAndMonthParam(query);
    if (yearAndMonth) {
        query.params.append('month', yearAndMonth.month.toString());
        query.params.append('year', yearAndMonth.year.toString());
    }

    return transport.get<ArchiveLike[]>(`${API_ENDPOINT}/api/${query.kind}?${query.params.toString()}`);
};
const createArchive = (archive: ArchiveLike) => transport.post<ArchiveLike>(`${API_ENDPOINT}/api/${archive.kind}/${archive.key}`, archive);
const readArchive = (kind: ArchiveKind, id: string) => transport.get<ArchiveLike>(`${API_ENDPOINT}/api/${kind}/${id}`);
const archiveSummaries = (kind: ArchiveKind) => transport.get<ArchiveSummary[]>(`${API_ENDPOINT}/api/${kind}/summary`);
const updateArchive = (archive: ArchiveLike) => transport.put<ArchiveLike>(`${API_ENDPOINT}/api/${archive.kind}/${archive.key}`, archive);
const incrementArchiveLikes = (request: IncrementArchiveLikesRequest) => transport.post<ArchiveLike>(`${API_ENDPOINT}/api/${request.kind}/${request.id}/incrementLikes`, {increment: request.increment});
const deleteArchive = (archive: ArchiveLike) => transport.delete<ArchiveLike>(`${API_ENDPOINT}/api/${archive.kind}/${archive.key}`);
const scrapeOpenGraph = (url: string) => transport.get<OpenGraphData>(`${API_ENDPOINT}/${OpenGraphScrapeQueryKey}?url=${url}`);

const ApiService = {
    session,
    signIn,
    createArchive,
    readArchive,
    updateArchive,
    deleteArchive,
    incrementArchiveLikes,
    fetchArchives,
    archiveSummaries,
    scrapeOpenGraph,
};

export default ApiService;
