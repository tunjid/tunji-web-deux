import * as React from 'react';
import { AppAction } from '../actions';

export interface MenuRes {
    id: string;
    text: string;
    icon?: React.ReactNode;
    action: AppAction;
}
