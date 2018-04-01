import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ContentService } from '../content.service';
import { Content } from '../content';

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.css']
})
export class ContentEditComponent implements OnInit {
  private editor;
  public videoInput;
  private editorOptions = {
    placeholder: 'insert content here'
  };
  separatorKeysCodes = [ENTER, COMMA, SPACE];
  public content: Content = {
    approved: false,
    body: `<h1>Nawwar :D<h1>`,
    category: '',
    section: '',
    creator: 'Reda',
    creatorAvatarLink: 'https://i.pinimg.com/originals/81/8a/74/818a7421837fabbce3cac4726b217df6.jpg',
    creatorProfileLink: 'https://www.facebook.com/Prog0X1',
    image: 'https://i.ytimg.com/vi/zqXwOA7QH48/maxresdefault.jpg',
    tags: [],
    title: '',
    touchDate: new Date(),
    type: 'resource'
  };
  constructor(private sanitizer: DomSanitizer, private contentService: ContentService) {
  }

  // Add a tag chip event handler
  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add tag
    if ((value || '').trim()) {
      this.content.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  // Remove a tag
  remove(tag: any): void {
    let index = this.content.tags.indexOf(tag);

    if (index >= 0) {
      this.content.tags.splice(index, 1);
    }
  }


  // create content
  createContent(content: Content): void {
    this.contentService.createContent(content).subscribe();
  }

  getSafeUrl() {
    this.content.video = this.videoInput;
  }
  ngOnInit() {
  }
}
