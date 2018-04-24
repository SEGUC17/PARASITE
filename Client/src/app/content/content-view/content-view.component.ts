import { Component, OnInit } from '@angular/core';
import { Content } from '../content';
import { ContentService } from '../content.service';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../../auth/user';
import { DiscussionService } from '../../discussion.service';


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
  somePlaceholder: String = 'Leave a comment';
  showReplies: String = 'Show replies';
  hideReplies: String = 'Hide replies';
  Comment: String = 'Comment';
  Reply: String = 'Reply';
  isReplying: boolean;
  commentReplyingOn: any;

  // inject the needed services
  constructor(private contentService: ContentService, private route: ActivatedRoute,
    private adminService: AdminService, private authService: AuthService,
    private discussionService: DiscussionService, private router: Router) { }

  ngOnInit() {
    const self = this;
    // retrieve the user data
    this.authService.getUserData(['username', 'isAdmin']).
      subscribe(function (user) {
        self.currentUser = user.data;
      });
    // retrieve the id of the content from the current path and request content
    this.route.params.subscribe(function (params) {
      console.log('Object Requested with Id: ' + params.id);
      self.getContentById(params.id);
    });
  }
  // retrieve the content from the server
  getContentById(id: any): void {
    const self = this;
    this.contentService.getContentById(id).subscribe(function (retrievedContent) {
      self.content = retrievedContent.data;
      if (self.content) {
        self.getRecommendedContent();
        self.comments = retrievedContent.data.discussion;
      }
      let input = document.getElementById('input');
      input.addEventListener('keyup', function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          document.getElementById('commentBtn').click();
        }
        if (event.keyCode === 27) {
          document.getElementById('cancelBtn').click();
        }
      });
      console.log('Retrieved: ' + retrievedContent.data);
    });
  }

  // admin is done with reviewing the content, send him back to his page
  returnToContentRequests(): void {
    this.router.navigate(['admin/ContentRequests']);
  }

  // delete Content function
  deleteContentById(id: any): void {
    const self = this;
    this.contentService.deleteContentById(id).subscribe(function (retrievedContent) {
      self.router.navigate(['/content-list-view']);
    });
  }

  addComment(inputtext: String) {
    let self = this;
    function isEmpty(str) {
      return (!str || 0 === str.length || !str.trim());
    }
    if (!isEmpty(inputtext)) {
      if (this.isReplying) {
        console.log('replying');
        this.discussionService.postReplyOnCommentOnContent(
          this.content._id,
          this.commentReplyingOn,
          self.changingComment).subscribe(function (err) {
            if (err.msg !== 'reply created successfully') {
              console.log('err in posting');
              self.refreshComments(false);
            }
            console.log('no error elhamdulla ');
            self.refreshComments(false);
            self.changingComment = '';
            let input = document.getElementById('input');
            self.somePlaceholder = 'leave a comment';
            self.isReplying = false;

          });
      } else {
        console.log('commenting');
        this.discussionService.postCommentOnContent(this.content._id, self.changingComment).subscribe(function (err) {
          if (err.msg === 'reply created successfully') {
            console.log('err in posting');
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
    let input = document.getElementById('input');
    self.somePlaceholder = 'leave a reply';
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
    let input = document.getElementById('input');
    this.somePlaceholder = 'leave a comment';
    input.blur();

  }
  showReply(i: number) {
    this.viewedReplies[i] = !this.viewedReplies[i];
  }

  // admin or owner user of content wishes to edit the content
  redirectToContentEdit(): void {
    this.router.navigateByUrl('/content-edit/' + this.content._id);
  }

  // retrieve the recommended content related to the content the user is viewing
  getRecommendedContent(): void {
    const self = this;
    // remove unnecessary spaces
    let searchQuery =
      this.content.category + ' ' +
      this.content.section + ' ' +
      this.content.tags.join(' ');

    // print statements for debugging
    console.log('Query Tags: ' + searchQuery);

    // retrieve search page from the server
    this.contentService.getSearchPage(
      1,
      8,
      searchQuery,
      '',
      '',
      'relevance'
    ).subscribe(function (res) {
      // update the recommended content array
      self.recommendedContent = res.data.contents.docs.slice(1);
    });

  }
}
