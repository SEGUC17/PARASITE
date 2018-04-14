import { Component, OnInit } from '@angular/core';
import { Content } from '../content';
import { ContentService } from '../content.service';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../../auth/user';


@Component({
  selector: 'app-content-view',
  templateUrl: './content-view.component.html',
  styleUrls: ['./content-view.component.scss']
})
export class ContentViewComponent implements OnInit {
  // the content that the user is viewing
  content: Content;

  // the signed-in user if he/she exists
  currentUser: User;

  // comments
  comments: any;
  viewedReplies: boolean[] = [];
  changingComment: String;
  somePlaceholder: String = '';
  showReplies: String = 'Show replies';
  hideReplies: String = 'Hide replies';
  // inject the needed services
  constructor(private contentService: ContentService, private route: ActivatedRoute,
    private adminService: AdminService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const self = this;
    self.changingComment = '';
    // retrieve the user data
    this.authService.getUserData(['username', 'isAdmin']).
      subscribe(function (user) {
        self.currentUser = user.data;
      });
    // retrieve the id of the content from the current path and request content
    this.route.params.subscribe(function (params) {
      console.log('Object Requested with Id: ' + params.id);
      self.getContentById(params.id);
      self.refreshComments();
      self.somePlaceholder = 'Leave a Comment';

    });
  }
  // retrieve the content from the server
  getContentById(id: any): void {
    const self = this;
    this.contentService.getContentById(id).subscribe(function (retrievedContent) {
      self.content = retrievedContent.data;
      console.log('Retrieved: ' + retrievedContent.data);
    });
  }

  // admin is done with reviewing the content, send him back to his page
  returnToContentRequests(): void {
    this.router.navigate(['admin/ContentRequests']);
  }

  addComment(inputtext: String) {
    let self = this;

    function isEmpty(str) {
      return (!str || 0 === str.length || !str.trim() );
  }
    console.log(inputtext);
    if (isEmpty(inputtext)) {
    console.log('Empty comment/reply');
    }
    if (!isEmpty(inputtext)) {
    const comment = {
      creator : this.currentUser.username,
      text : self.changingComment
    };
    self.comments.push(comment);
      self.changingComment = '';
  }
}
  onReply(): any {
    let self = this;
    let element = document.getElementById('target');
    element.scrollIntoView();
    let input = document.getElementById('lala');
    self.somePlaceholder = 'leave a reply';
    input.focus();
  }
  refreshComments(): any {
    let self = this;
    self.comments = [];


    const replies11 = {
      creator : 'ahmed',
      text: '2aa msh awee'
    };
    const replies12 = {
      creator : 'lala',
      text : '2hii ahmed'
    };
    const replies1 = [];
    replies1.push(replies11);
    replies1.push(replies12);
    const comment1 = {
      creator: 'salma',
      text: '1ana ba7eb sharmoofers awe',
      replies : replies1
    };

    const replies21 = {
      creator : 'ahmed',
      text: '2aa msh awee'
    };
    const replies22 = {
      creator : 'lala',
      text : '2hii ahmed'
    };
    const replies2 = [];
    replies2.push(replies21);
    replies2.push(replies22);

    const comment2 = {
      creator: 'salma',
      text: '2ana ba7eb sharmoofers awee',
      replies: replies2
    };
    const comment3 = {
      creator: 'salma',
      text: 'ana ba7eb sharmoofers aweee',
      replies: []
    };
    self.comments.push(comment1);
    self.comments.push(comment2);
    self.comments.push(comment3);
    self.viewedReplies.push(false);
    self.viewedReplies.push(false);
    self.viewedReplies.push(false);


  }
  showReply(i: number) {
    this.viewedReplies[i] = !this.viewedReplies[i];
  }

}
