import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ContentService } from '../content.service';
import { Content } from '../content';
import { Section } from '../section';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from '../category';
import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../../admin.service';
@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.scss']
})
export class ContentEditComponent implements OnInit {
  private editor;
  private isUpdate = false;
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
    discussion: [],
    section: '',
    creator: '',
    creatorAvatarLink: 'https://i.pinimg.com/originals/81/8a/74/818a7421837fabbce3cac4726b217df6.jpg',
    creatorProfileLink: 'https://www.facebook.com/Prog0X1',
    image: '',
    tags: [],
    title: '',
    touchDate: new Date(),
    type: 'resource'
  };
  constructor(private sanitizer: DomSanitizer,
    private contentService: ContentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService) {
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


  // on content edit form submit
  onSubmit(): void {
    const self = this;
    if (this.authService.getToken() === '') {
      // TODO: (Universal Error Handler/ Modal Errors)
      console.log('Please sign in first');
      return;
    }
    // get username of the registered user
    this.authService.getUserData(['username']).subscribe(function (authRes) {
      self.content.creator = authRes.data.username;
      // create content for for that registered user

      if (self.isUpdate) {
        self.updateContent();
      } else {
        self.createContent();
      }
    });
  }
  // create content
  createContent(): void {
    const self = this;
    self.contentService.createContent(self.content).subscribe(function (contentRes) {
      // TODO: (Universal Error Handler/ Modal Errors)
      if (!contentRes) {
        return;
      }
      if (contentRes.data.content) {
        self.router.navigateByUrl('/content-view/' + contentRes.data.content._id);
        return;
      }
      self.router.navigateByUrl('/content-view/' + contentRes.data._id);
    });
  }

  // update content
  updateContent(): void {
    const self = this;
    self.contentService.updateContent(self.content).subscribe(function (contentRes) {
      // TODO: (Universal Error Handler/ Modal Errors)
      if (!contentRes || !contentRes.data) {
        return;
      }
      if (contentRes.data.content) {
        self.router.navigateByUrl('/content-view/' + contentRes.data.content._id);
      }
      self.router.navigateByUrl('/content-view/' + contentRes.data._id);
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
    const self = this;
    const matchCategoryName = function (category) {
      return category.name === self.content.category;
    };
    const selectedCategory: Category = this.categories.filter(matchCategoryName)[0];

    this.requiredSections = selectedCategory.sections;
  }


  initUpdateView(contentID) {
    const self = this;
    self.contentService.getCategories().subscribe(function (res) {
      if (!res || !res.data) {
        return [];
      }
      self.categories = res.data;
      self.contentService.getContentById(contentID).subscribe(function (contentResponse) {
        if (!contentResponse) {
          console.log('couldn\'t find the content');
          return;
        }
        self.isUpdate = true;
        self.content = contentResponse.data;
        self.getSections();
      });
    });

  }

  ngOnInit() {
    const contentID = this.route.snapshot.params.id;
    if (contentID) {
      this.isUpdate = true;
      this.initUpdateView(contentID);
    }
    this.getCategories();
  }
}
