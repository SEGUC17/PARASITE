/**
 * Class representing the Youtube player.
 */

import { NgZone, Injectable } from '@angular/core';
import { isUndefined } from 'util';

import { YoutubeApiService } from './youtube-api.service';
import { PlayerConfig } from './playerconfig';
declare const YT;
@Injectable()
export class YoutubePlayer {
    private defaultWidth = 320;
    private defaultHeight = 240;

    constructor(private zone: NgZone, private youtubeApi: YoutubeApiService) { }

    /**
     * (Wrapper function to) Load a new player using the youtube JS api
     */
    load(playerConfig: PlayerConfig) {
        if (isUndefined((window as any).YT)) {
            // Subscribe to the emitter who emits the window.YT OBJECT AS SOON AS IT IS LOADED/AVAILABLE.
            // 'data => window.YT' => We actually don't need to use it here, just make sure the function is called AFTER
            // the OBJECT is available
            this.youtubeApi.apiEmitter.subscribe(
                data => {
                    // Using this.zone.run() causes Angular to perform change detection which will update the view
                    this.zone.run(() => this.newPlayer(playerConfig));
                }
            );
        } else {
            // The YT class is already loaded, no need to wait for it to get streamed
            this.zone.run(() => this.newPlayer(playerConfig));
        }
    }


    private newPlayer(playerConfig: PlayerConfig) {
        // tslint:disable-next-line:no-unused-expression
        new (window as any).YT.Player(playerConfig.elementId, {
            width: playerConfig.width || this.defaultWidth,
            height: playerConfig.height || this.defaultHeight,
            videoId: playerConfig.videoId,
            playerVars: { origin: 'http://localhost:4200'},
            events: {
                onReady: (event) => {
                    // ev.target = the 'real' player of the Youtbe API
                    playerConfig.outputs.ready.emit(event.target);
                },
                onStateChange: (event) => {
                    playerConfig.outputs.change.emit(event);
                }
            }
        });

    }

    /**
     * Generate a unique ID.
     * It's needed when working with multiple players.
     * Source: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/8809472#8809472
     *
     * @return {string}
     */
    generateUUID() {
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === 'function') {
            d += performance.now(); // use high-precision timer if available
        }
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

        return uuid;
    }
}
