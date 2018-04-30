/**
 * Service to provide the Youtube API
 */

import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class YoutubeApiService {
  private iframeScriptId = 'yt-iframe-api';
  public apiEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  /**
   * Load the Youtube iframe API into the DOM to get access.
   * Stream the YT object to inform all listeners when it's ready.
   */
  loadApi() {
    // Load API only once
    if (window.document.getElementById(this.iframeScriptId) == null) {
      // Create scripte element and load API
      let apiScriptTag = window.document.createElement('script');
      apiScriptTag.type = 'text/javascript';
      apiScriptTag.src = 'https://www.youtube.com/iframe_api';
      apiScriptTag.id = this.iframeScriptId;
      window.document.body.appendChild(apiScriptTag);
    }

    // Stream the YT code (which contains the js youtube framework)
    // Notice: window.YT.Player needs to be initialized WITHIN the scope of onYouTubeIframeAPIReady
    window['onYouTubeIframeAPIReady'] = () => {
      // Emit the youtube player Object so it can be used by all subscribing players
      this.apiEmitter.emit((window as any).YT);
    };
  }
}
