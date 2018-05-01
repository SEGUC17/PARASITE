
/**
 * Interface for the player configuration
 */

import {EventEmitter} from '@angular/core';

export interface PlayerConfig {
    elementId: string;
    width: number;
    height: number;
    videoId: string;
    outputs: {
        ready: EventEmitter<any>,
        change: EventEmitter<any>
    };
}
