import { ADD_OPEN_GRAPH_DATA, OpenGraphAction } from '@tunji-web/client/src/actions/OpenGraph';

export interface OpenGraphData {
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterCard: string;
    twitterSiteId: string;
    ogSiteName: string,
    ogImage: OgImage;
    twitterImage: TwitterImage;
    ogLocale: string;
    charset: string;
    requestUrl: string;
    success: boolean;
}

export interface OgImage {
    url: string;
    width?: null;
    height?: null;
    type: string;
}

export interface TwitterImage {
    url: string;
    width?: null;
    height?: null;
    alt?: null;
}

export interface OpenGraphState {
    graphData: Record<string, OpenGraphData>;
}

export function openGraphReducer(state = {
    graphData: {}
}, action: OpenGraphAction): OpenGraphState {
    switch (action.type) {
        case ADD_OPEN_GRAPH_DATA: {
            return {
                ...state,
                graphData: {
                    ...state.graphData,
                    [action.url]: action.data
                },
            };
        }
    }
    return state;
}
