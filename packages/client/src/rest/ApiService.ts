import axios from 'axios';
import clientConfig from '../config';
import {
    ArchiveKind,
    ArchiveLike,
    ArchiveSummary,
    UserLike,
    OpenGraphScrapeQueryKey,
    ArchiveFile
} from '@tunji-web/common';
import { SignInArgs } from '../actions/Auth';
import { ArchivesQuery, IncrementArchiveLikesRequest, yearAndMonthParam } from '../actions/Archive';
import { OpenGraphData } from '../reducers/OpenGraph';
import { PopulatedArchive } from '@tunji-web/client/src/models/PopulatedArchive';

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

    return transport.get<PopulatedArchive[]>(`${API_ENDPOINT}/api/${query.kind}?${query.params.toString()}`);
};
const createArchive = (archive: ArchiveLike) => transport.post<PopulatedArchive>(`${API_ENDPOINT}/api/${archive.kind}/${archive.key}`, archive);
const readArchive = (kind: ArchiveKind, id: string) => transport.get<PopulatedArchive>(`${API_ENDPOINT}/api/${kind}/${id}?populateAuthor=true`);
const archiveSummaries = (kind: ArchiveKind) => transport.get<ArchiveSummary[]>(`${API_ENDPOINT}/api/${kind}/summary`);
const updateArchive = (archive: ArchiveLike) => transport.put<PopulatedArchive>(`${API_ENDPOINT}/api/${archive.kind}/${archive.key}?populateAuthor=true`, archive);
const incrementArchiveLikes = (request: IncrementArchiveLikesRequest) => transport.post<PopulatedArchive>(`${API_ENDPOINT}/api/${request.kind}/${request.id}/incrementLikes?populateAuthor=true`, {increment: request.increment});
const deleteArchive = (archive: ArchiveLike) => transport.delete<ArchiveLike>(`${API_ENDPOINT}/api/${archive.kind}/${archive.key}`);
const archiveFiles = (kind: ArchiveKind, id: string) => transport.get<ArchiveFile[]>(`${API_ENDPOINT}/api/${kind}/${id}/files`);

const scrapeOpenGraph = (url: string) => transport.get<OpenGraphData>(`${API_ENDPOINT}/${OpenGraphScrapeQueryKey}?url=${url}`);

const ApiService = {
    session,
    signIn,
    createArchive,
    readArchive,
    updateArchive,
    deleteArchive,
    archiveFiles,
    incrementArchiveLikes,
    fetchArchives,
    archiveSummaries,
    scrapeOpenGraph,
};

export default ApiService;
