import { CardInfo, CardStyle } from "../components/cards/Card";



export interface ProjectsState {
    cards: CardInfo[];
}

export function projectsReducer(state = {
    cards: [
        {
            title: 'Digilux',
            body: 'Digilux Fingerprint Sensor app',
            thumbnail: 'https://www.tunjid.com/public/images/projects/digilux-1.png',
            style: CardStyle.horizontal,
            categories: [] as string[],
        },
        {
            title: 'Digilux',
            body: 'Digilux Fingerprint Sensor app',
            thumbnail: 'https://www.tunjid.com/public/images/projects/digilux-1.png',
            style: CardStyle.horizontal,
            categories: [] as string[],
        },
        {
            title: 'Digilux',
            body: 'Digilux Fingerprint Sensor app',
            thumbnail: 'https://www.tunjid.com/public/images/projects/digilux-1.png',
            style: CardStyle.horizontal,
            categories: [] as string[],
        },
        {
            title: 'Digilux',
            body: 'Digilux Fingerprint Sensor app',
            thumbnail: 'https://www.tunjid.com/public/images/projects/digilux-1.png',
            style: CardStyle.horizontal,
            categories: [] as string[],
        },
        {
            title: 'Digilux',
            body: 'Digilux Fingerprint Sensor app',
            thumbnail: 'https://www.tunjid.com/public/images/projects/digilux-1.png',
            style: CardStyle.horizontal,
            categories: [] as string[],
        },
        {
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
