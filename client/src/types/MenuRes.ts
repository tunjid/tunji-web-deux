import * as React from 'react';
import { SynchronousAppAction } from "../actions";

export interface MenuRes {
    id: string;
    text: string;
    icon?: React.ReactNode;
    action: SynchronousAppAction;
}
