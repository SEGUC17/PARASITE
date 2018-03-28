import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.css']
})
export class ContentEditComponent implements OnInit {
  public editor;
  public content;
  public editorOut;
  public trustedOut;
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
    this.editorOut = html;
    this.trustedOut = this.sanitizer.bypassSecurityTrustHtml(this.editorOut);
  }
  ngOnInit() {
    setTimeout(() => {
      this.editorContent = '<h1>content changed!</h1>';
      console.log('you can use the quill instance object to do something', this.editor);
      // this.editor.disable();
    }, 2800);


  }
}
