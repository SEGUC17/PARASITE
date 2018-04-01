import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ContentService } from '../content.service';
import { Content } from '../content';
import { Router } from '@angular/router';
import { Category } from '../category';
import { Section } from '../section';
@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.css']
})
export class ContentEditComponent implements OnInit {
  private editor;
  public videoInput: string;
  public categories: Category[];
  public requiredSections: Section[];
  private editorOptions: Object = {
    placeholder: 'insert content here'
  };
  separatorKeysCodes = [ENTER, COMMA, SPACE];
  public content: Content = {
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
  constructor(private sanitizer: DomSanitizer, private contentService: ContentService, private router: Router) {
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
    const self = this;
    this.contentService.createContent(content).subscribe(function (res) {
      // TODO(Universal Error Handler/ Modal Errors)
      if (!res) {
        return;
      }
      self.router.navigateByUrl('content-view/' + res.data._id);
    });
  }

  // retrieve all categories from server
  getCategories(): void {
    const self = this;
    this.contentService.getCategories().subscribe(function (res) {
      if (!res || !res.data) {
        return [];
      }
      self.categories = res.data;
    });
  }

  // transfer video link input to security bypass URL
  getSafeUrl() {
    this.content.video = this.videoInput;
  }

  getSections() {
    console.log('I am here');
    const self = this;
    console.log(self.content.category);
    const matchCategoryName = function (category) {
      return category.name === self.content.category;
    };
    const selectedCategory: Category = this.categories.filter(matchCategoryName)[0];

    this.requiredSections = selectedCategory.sections;
  }


  ngOnInit() {
    this.getCategories();
  }
}
