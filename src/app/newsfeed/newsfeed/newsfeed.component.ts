import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NewsfeedService } from '../newsfeed.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Tag } from './tag';
@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.scss']
})
export class NewsfeedComponent implements OnInit {
  posts: any[];
  currentPageNumber: number;
  entriesPerPage = 5;
  totalNumberOfPages = 0;
  people: any[];
  tags: String[]; // interests are in here
  user: any;
  allTags: Tag[];
  // tagsIdonthave: allTags - tags;
  tagsIdonthave: Tag[];

  constructor(private sanitizer: DomSanitizer, public router: Router,
    private newsfeedService: NewsfeedService, private authService: AuthService,
    public translate: TranslateService) {
  }

  ngOnInit() {
    const self = this;
    const userDataColumns = ['username', 'isParent', 'interests'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.user = res.data;
      if (!self.user) {
        self.router.navigateByUrl('/content/view');
      } else {
        self.newsfeedService.getPeople().subscribe(function (people) {
          self.people = people.data;
        });
        // self.tags = self.user.interests;
        self.tags = self.user.interests;
        self.currentPageNumber = 1;
        self.firstNewsfeedPage();
        self.getTags();
      }
    });
  }

  //        start of  page actions       //

  // sets the current page to the first page
  // gets the current page products
  firstNewsfeedPage(): void {
    const self = this;
    self.currentPageNumber = 1;
    self.posts = [];
    self.getNewsfeedPage();
  }

  // gets the content of the current newsfeed page from the newsfeed service (DB)
  // restrict the products to the ones following the delimiters given
  getNewsfeedPage(): void {
    // scroll to the top
    window.scrollTo(0, 0);
    const self = this;
    self.newsfeedService.getNewsfeedPage(self.tags, self.entriesPerPage,
      self.currentPageNumber)
      .subscribe(function (posts) {
        self.totalNumberOfPages = posts.data.pages;
        self.posts = posts.data.docs;
        for (let post of self.posts) {
          post.description = (self.sanitizer.bypassSecurityTrustHtml(post.description));
        }
      });
  }

  //        end of newsfeed page actions       //

  //         start of pagination actions         //

  // change the current page on user click on pagination
  changePage(pageNum: number): any {
    this.currentPageNumber = pageNum;
    this.getNewsfeedPage();
  }

  // calculate the number of pages to display in pagination
  getPaginationRange(): any {

    let pageNumbers = [];
    let counter = 1;

    if (this.currentPageNumber < 3) {
      // we are in page 1 or 2
      while (counter < 6 && counter <= this.totalNumberOfPages) {
        pageNumbers.push(counter);
        counter += 1;
      }
    } else {
      // we are in a page greater than 2
      pageNumbers.push(this.currentPageNumber - 2);
      pageNumbers.push(this.currentPageNumber - 1);
      pageNumbers.push(this.currentPageNumber);
      if (this.currentPageNumber + 1 <= this.totalNumberOfPages) {
        pageNumbers.push(this.currentPageNumber + 1);
      }
      if (this.currentPageNumber + 2 <= this.totalNumberOfPages) {
        pageNumbers.push(this.currentPageNumber + 2);
      }
    }
    return pageNumbers;
  }

  //         end of pagination actions         //

  deleteInterest(interestText): any {
    let self = this;
    self.newsfeedService.deleteInterest(interestText).subscribe(function () {
      self.authService.getUserData(['interests']).subscribe(function (res) {
        self.tags = res.data.interests;
        self.getTags();
      });
    });
  }

  addInterest(interestText): any {
    let self = this;
    self.newsfeedService.addInterest(interestText).subscribe(function () {
      self.authService.getUserData(['interests']).subscribe(function (res) {
        self.tags = res.data.interests;
        self.getTags();
          });
        });
  }
  getTags(): any {
    let self = this;
    self.newsfeedService.getTags().subscribe(function(res) {
      self.allTags = res.data;
      self.tagsIdonthave = self.allTags.filter(function(notFound) {
        if(self.tags.indexOf(notFound.name) < 0){
          return notFound;
        }
      });
    });
  }
}
      // self.tagsIdonthave = self.allTags.filter(function(res) {
      //   if (self.tags.find(res) < 0) {
      //     return res;
      //   } 
      // })
      
      // item => self.tags.indexOf(item) < 0
