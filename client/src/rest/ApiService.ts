import axios from 'axios';
import { ArchiveLike, UserLike } from "../../../common/Models";
import { SignInArgs } from "../actions/Auth";
import { ArchiveKind } from "../reducers/Archive";

const transport = axios.create({
    withCredentials: true
})

const session = () => transport.get<UserLike>(`/api/session`);
const signIn = (args: SignInArgs) => transport.post<UserLike>(`/api/sign-in`, args);
const fetchArchives = (kind: ArchiveKind) => transport.get<ArchiveLike[]>(`/api/${kind}`);

const ApiService = {session, signIn, fetchArchives};

export default ApiService;
