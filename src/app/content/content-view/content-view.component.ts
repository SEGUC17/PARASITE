import { Component, OnInit } from '@angular/core';
import { Content } from '../content';
import { ContentService } from '../content.service';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../../auth/user';
import { DiscussionService } from '../../discussion.service';
import { VideoIdExtractorPipe } from '../video-id-extractor.pipe';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-content-view',
  templateUrl: './content-view.component.html',
  styleUrls: ['./content-view.component.scss']
})
export class ContentViewComponent implements OnInit {
  // the content that the user is viewing
  content: Content;
  recommendedContent: Content[];

  // the signed-in user if he/she exists
  currentUser: User;

  // comments
  comments: any;
  viewedReplies: boolean[] = [];
  changingComment: String = '';
  somePlaceholder: String = 'LEAVE_A_COMMENT';
  showReplies: String = 'Show replies';
  hideReplies: String = 'Hide replies';
  defaultPP: String = '../../../assets/images/profile-view/defaultPP.png';
  isReplying: boolean;
  commentReplyingOn: any;
  public YT: any;
  public videoId: any;
  public player: any;

  // inject the needed services
  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute,
    private videoIdExtractorPipe: VideoIdExtractorPipe,
    private authService: AuthService,
    private discussionService: DiscussionService,
    private toasterService: ToastrService,
    private router: Router,
    private translate: TranslateService
  ) { }


  ngOnInit() {
    const self = this;
    window.scrollTo(0, 0);
    // retrieve the user data
    this.authService.getUserData(['username', 'isAdmin', 'avatar', 'verified']).
      subscribe(function (user) {
        self.currentUser = user.data;
      }, function (error) {
        // user is not signed in
        // do nothing
      });
    // retrieve the id of the content from the current path and request content
    this.route.params.subscribe(function (params) {
      self.getContentById(params.id);
    });
  }
  // retrieve the content from the server
  getContentById(id: any): void {
    const self = this;
    this.contentService.getContentById(id).subscribe(function (retrievedContent) {
      self.content = retrievedContent.data;
      self.comments = retrievedContent.data.discussion;

      if (self.content) {
        self.getRecommendedContent();
      }
    }, function (error) {
      if (error.status === 404) {
        self.translate.get('CONTENT.TOASTER.NOT_FOUND').subscribe(
          function (translation) {
            self.toasterService.error(translation);
          }
        );
      }
    });
  }

  // admin is done with reviewing the content, send him back to his page
  returnToContentRequests(): void {
    this.router.navigate(['/admin/content-req']);
  }

  // delete Content function
  deleteContentById(id: any): void {
    const self = this;
    this.contentService.deleteContentById(id).subscribe(function (retrievedContent) {
      self.router.navigate(['/content/list']);
    });
  }

  addComment(inputtext: String) {
    let self = this;
    function isEmpty(str) {
      return (!str || 0 === str.length || !str.trim());
    }
    if (!isEmpty(inputtext)) {
      if (this.isReplying) {
        this.discussionService.postReplyOnCommentOnContent(
          this.content._id,
          this.commentReplyingOn,
          self.changingComment).subscribe(function (err) {
            if (err.msg !== 'reply created successfully') {
              self.refreshComments(false);
            }
            self.refreshComments(false);
            self.changingComment = '';
            let input = document.getElementById('input');
            self.somePlaceholder = 'LEAVE_A_COMMENT';
            self.isReplying = false;

          });
      } else {
        this.discussionService.postCommentOnContent(this.content._id, self.changingComment).subscribe(function (err) {
          if (err.msg === 'reply created successfully') {
          }
          self.refreshComments(false);
          self.changingComment = '';
        });
      }
    }
  }
  onReply(id: any): any {
    let self = this;
    let element = document.getElementById('target');
    element.scrollIntoView();
    let input = document.getElementById('inputArea');
    self.somePlaceholder = 'LEAVE_A_REPLY';
    input.focus();
    this.isReplying = true;
    this.commentReplyingOn = id;
  }
  onDelete(i: any) {
    let self = this;
    this.discussionService.deleteCommentOnContent(this.content._id, i).subscribe(function (err) {
      if (err) {
        console.log(err);
      }
      self.refreshComments(false);
    });
  }
  onDeleteReply(commentId: any, replyId: any) {
    let self = this;
    this.discussionService.deleteReplyOnCommentOnContent(this.content._id, commentId, replyId).subscribe(function (err) {
      if (err) {
        console.log(err);
      }
      self.refreshComments(false);
    });
  }
  refreshComments(refreshViewReplies: boolean): any {
    let self = this;
    this.contentService.getContentById(this.content._id).subscribe(function (retrievedContent) {
      self.comments = retrievedContent.data.discussion;
      if (refreshViewReplies) {
        self.viewedReplies = [];
        for (let i = 0; i < this.content.discussion.length; i++) {
          this.viewedReplies.push(false);
        }
      }
    });
  }
  cancel() {
    this.changingComment = '';
    this.isReplying = false;
    let input = document.getElementById('inputArea');
    this.somePlaceholder = 'LEAVE_A_COMMENT';
    input.blur();

  }
  showReply(i: number) {
    this.viewedReplies[i] = !this.viewedReplies[i];
  }

  // admin or owner user of content wishes to edit the content
  redirectToContentEdit(): void {
    this.router.navigateByUrl('/content/edit/' + this.content._id);
  }

  // retrieve the recommended content related to the content the user is viewing
  getRecommendedContent(): void {
    const self = this;
    // remove unnecessary spaces
    let searchQuery =
      this.content.title + ' ' +
      this.content.category + ' ' +
      this.content.section + ' ' +
      this.content.tags.join(' ');

    // retrieve search page from the server
    this.contentService.getSearchPage(
      1,
      8,
      searchQuery,
      '',
      '',
      'relevance',
      this.content.language
    ).subscribe(function (res) {
      // update the recommended content array
      self.recommendedContent = res.data.contents.docs.slice(1);
    });

  }
  onPlayerStateChange(event) {
    const self = this;
    if (event.data === window['YT'].PlayerState.ENDED && this.currentUser) {
      this.contentService.addLearningScore(self.content._id, self.content.video).subscribe(function (res) {
        if (!res) {
          return;
        }
        if (res.msg === '') {
          self.translate.get('CONTENT.TOASTER.ALREADY_WATCHED').subscribe(
            function (translation) {
              self.toasterService.success(translation);
            }
          );
        } else {
          self.translate.get('CONTENT.TOASTER.LEARNING_POINTS_ADDED', { total: res.msg }).subscribe(
            function (translation) {
              self.toasterService.success(translation + res.msg);
            }
          );
        }
      });
    }
  }
}
