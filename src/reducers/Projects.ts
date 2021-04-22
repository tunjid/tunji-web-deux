import { CardInfo, CardStyle } from "../components/cards/Card";



export interface ProjectsState {
    cards: CardInfo[];
}

export function projectsReducer(state = {
    cards: [
        {
            id: '1',
            title: 'Digilux',
            body: 'Digilux Fingerprint Sensor app',
            thumbnail: 'https://www.tunjid.com/public/images/projects/digilux-1.png',
            style: CardStyle.horizontal,
            categories: [] as string[],
        },
        {
            id: '2',
            title: 'Digilux',
            body: 'Digilux Fingerprint Sensor app',
            thumbnail: 'https://www.tunjid.com/public/images/projects/digilux-1.png',
            style: CardStyle.horizontal,
            categories: [] as string[],
        },
        {
            id: '3',
            title: 'Digilux',
            body: 'Digilux Fingerprint Sensor app',
            thumbnail: 'https://www.tunjid.com/public/images/projects/digilux-1.png',
            style: CardStyle.horizontal,
            categories: [] as string[],
        },
        {
            id: '4',
            title: 'Digilux',
            body: 'Digilux Fingerprint Sensor app',
            thumbnail: 'https://www.tunjid.com/public/images/projects/digilux-1.png',
            style: CardStyle.horizontal,
            categories: [] as string[],
        },
        {
            id: '5',
            title: 'Digilux',
            body: 'Digilux Fingerprint Sensor app',
            thumbnail: 'https://www.tunjid.com/public/images/projects/digilux-1.png',
            style: CardStyle.horizontal,
            categories: [] as string[],
        },
        {
            id: '6',
            title: 'Digilux',
            body: 'Digilux Fingerprint Sensor app',
            thumbnail: 'https://www.tunjid.com/public/images/projects/digilux-1.png',
            style: CardStyle.horizontal,
            categories: [] as string[],
        },
    ],
}, action: any): ProjectsState {

    return state;
}
