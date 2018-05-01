import { Component, EventEmitter, Input, Output, AfterContentInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { YoutubeApiService } from '../youtube-api.service';
import { YoutubePlayer } from '../YoutubePlayer';
import { PlayerConfig } from '../playerconfig';

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.component.html',
  providers: [YoutubePlayer]
})
export class YoutubePlayerComponent implements OnInit {
  @Input() videoId = '';
  @Input() height: number;
  @Input() width: number;

  // Player (emitter) created and initialized - sends instance of the player
  // Emit player 'out of this component' so that other components can take control of the player
  @Output() ready = new EventEmitter();
  // state change: send the YT event with its state (like 'END, ISPLAYING, PAUSED, ...)'
  @Output() change = new EventEmitter();

  @ViewChild('playercontainer') private playercontainer: ElementRef;

  constructor(
    public youtubeApiService: YoutubeApiService,
    public youtubePlayer: YoutubePlayer
  ) { }

  ngOnInit() {
    // Get original div and set a unique ID for it.
    // That is important when working with multiple players
    let elementId = this.youtubePlayer.generateUUID();
    this.playercontainer.nativeElement.setAttribute('id', elementId);

    // Define configuration for the player
    let playerConfig = {
      elementId: elementId,
      width: this.width,
      height: this.height,
      videoId: this.videoId,
      outputs: {
        ready: this.ready,
        change: this.change
      }
    };

    // Load the Youtube API
    this.youtubeApiService.loadApi();

    // Load the youtube player
    this.youtubePlayer.load(playerConfig);
  }
}
