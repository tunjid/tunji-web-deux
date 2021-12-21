import ApiService from '../rest/ApiService';
import { AppThunk } from './index';
import { onHttpResponse } from './Common';
import { OpenGraphData } from '@tunji-web/client/src/reducers/OpenGraph';

export const ADD_OPEN_GRAPH_DATA = 'ADD_OPEN_GRAPH_DATA';

export interface AddOpenGraphData {
    type: typeof ADD_OPEN_GRAPH_DATA;
    url: string;
    data: OpenGraphData
}

export type OpenGraphAction = AddOpenGraphData;

interface IOpenGraphActions {
    openGraphScrape: (url: string) => AppThunk
}

export const OpenGraphActions: IOpenGraphActions = {
    openGraphScrape: (url: string) => async (dispatch) => {
        await onHttpResponse(
            ApiService.scrapeOpenGraph(url),
            (data) => dispatch({
                type: ADD_OPEN_GRAPH_DATA,
                url,
                data,
            })
        );
    }
};

