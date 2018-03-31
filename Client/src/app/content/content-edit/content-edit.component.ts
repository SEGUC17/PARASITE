import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
<<<<<<< HEAD
=======
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ContentService } from '../content.service';
import { Content } from '../content';
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.css']
})
export class ContentEditComponent implements OnInit {
<<<<<<< HEAD
  public editor;
  public content;
  public editorOut;
  public editorContent = `<h1>Hello there, I am Reda :D<h1>`;
  public editorOptions = {
    placeholder: 'insert content here'
  };
  constructor(private sanitizer: DomSanitizer) {
  }
  onEditorBlured(quill) {
    console.log('editor blur!', quill);
  }
  onEditorFocused(quill) {
    console.log('editor focused!', quill);
  }
  onEditorCreated(quill) {
    this.editor = quill;
    console.log('quill is here', quill);
  }
  onContentChanged({ quill, html, text }) {
    console.log('content changed dude', quill, html, text);
    this.editorOut = this.sanitizer.bypassSecurityTrustHtml(this.editorContent);
=======
  private editor;
  public editorOut;
  public editorContent = `<h1>Nawwar :D<h1>`;
  private editorOptions = {
    placeholder: 'insert content here'
  };
  separatorKeysCodes = [ENTER, COMMA, SPACE];
  public content: Content = {
    approved: false,
    body: '',
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
  onContentChanged(quill) {
    this.editorOut = this.sanitizer.bypassSecurityTrustHtml(this.editorContent);
    this.content.body = String(this.editorOut);
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
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
  }
  ngOnInit() {
  }
}
