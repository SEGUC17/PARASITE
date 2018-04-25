import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
  name: 'videoIdExtractor'
})
export class VideoIdExtractorPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    if (!url || url === '') {
      return;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    let videoId: any = 0;
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else {
      videoId = 'error';
    }
    if (videoId === 'error') {
      return null;
    }
    return videoId;
  }
}
