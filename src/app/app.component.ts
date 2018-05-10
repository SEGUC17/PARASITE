import { Component, ChangeDetectorRef, Renderer2, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './auth/auth.service';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Notification } from './notification';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/filter';
import { not } from '@angular/compiler/src/output/output_ast';
import { LandingService } from './landing.service';
declare const $: any;
declare const jquery: any;
declare const screenfull: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  username: string;
  avatar: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  notifications: Notification[];
  messagesNotifications: Notification[];
  unreadNotificationsNumber: number; // Number of unread notifications to display on top of icon
  unreadNotificationsNumberMessages: number; // Number of unread messages to display on top of icon
  discussion_C: String = 'discussion content';
  discussion_A: String = 'discussion activity';
  message: String = 'message';
  link: String = 'link';
  study_plan: String = 'study plan';
  study_plan_A: String = 'study plan A';
  product: String = 'product';
  content: String = 'content';
  activity: String = 'activity';
  contributer: String = 'contributer';

  links = [
    {
      url: '/newsfeed',
      name: 'APP.NEWSFEED',
      icon: 'collection-text'
    },
    {
      url: '/content/list',
      name: 'APP.CONTENT',
      icon: 'book'
    },
    {
      url: '/profile',
      name: 'APP.PROFILE',
      icon: 'account'
    },
    {
      url: '/message',
      name: 'APP.MESSAGING',
      icon: 'email'
    },
    {
      url: '/market',
      name: 'APP.MARKET',
      icon: 'shopping-cart'
    },
    {
      url: '/psychologist',
      name: 'APP.PSYCHOLOGISTS',
      icon: 'hospital'
    },
    {
      url: '/activities',
      name: 'APP.ACTIVITIES',
      icon: 'run'
    },
    {
      url: '/admin',
      name: 'APP.ADMIN',
      icon: 'accounts-list'
    },
    {
      url: '/search',
      name: 'APP.CONNECT_PARENTS',
      icon: 'accounts'
    },
    {
      url: '/scheduling/study-plan/published',
      name: 'APP.STUDY_PLANS',
      icon: 'graduation-cap'
    },
    {
      url: '/scheduling/schedule',
      name: 'APP.SCHEDULE',
      icon: 'calendar'
    }
  ];
  constructor(
    private router: Router,
    public authService: AuthService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    public landingService: LandingService
  ) {
    const self = this;
    // this fallback language if any translation is not found
    translate.setDefaultLang('en');

    // the language to use on load
    if (!localStorage.getItem('cachedLang')) {
      localStorage.setItem('cachedLang', this.translate.currentLang);
      translate.use('en');
    } else {
      this.translate.use(localStorage.getItem('cachedLang'));
      if (this.translate.currentLang === 'en') {
        $('body').removeClass('rtl');
      } else {
        $('body').addClass('rtl');
      }
    }

    router.events
      .filter(function (event) {
        return event instanceof NavigationEnd;
      }).subscribe(function (routerData: NavigationEnd) {
        if (routerData.url === '/content/list') {
          self.isSignedIn();
        }
      });
  }
  ngOnInit() {
    this.CustomScrollbar();
    $(function () {
      'use strict';
      CustomPageJS();
    });
    function CustomPageJS() {
      $('.boxs-close').on('click', function () {
        const element = $(this);
        const cards = element.parents('.card');
        cards.addClass('closed').fadeOut();
      });
      $('.menu-sm').on('click', function () {
        $('body').toggleClass('menu_sm');
      });
      $('.form-control')
        .on('focus', function () {
          $(this)
            .parent('.input-group')
            .addClass('input-group-focus');
        })
        .on('blur', function () {
          $(this)
            .parent('.input-group')
            .removeClass('input-group-focus');
        });
    }
    this.isSignedIn();
  }
  // All Custom Scrollbar JS
  public CustomScrollbar(): void {
    $('.sidebar .menu .list').slimscroll({
      height: 'calc(100vh - 65px)',
      color: 'rgba(0,0,0,0.2)',
      position: 'left',
      size: '6px',
      alwaysVisible: true,
      borderRadius: '3px',
      railBorderRadius: '0'
    });

    $('.navbar-left .dropdown-menu .body .menu').slimscroll({
      height: '300px',
      color: 'rgba(0,0,0,0.2)',
      size: '6px',
      alwaysVisible: true,
      borderRadius: '3px',
      railBorderRadius: '0'
    });
    $('.right-sidebar .slim_scroll').slimscroll({
      height: 'calc(100vh - 60px)',
      color: 'rgba(0,0,0,0.4)',
      size: '2px',
      alwaysVisible: false,
      borderRadius: '3px',
      railBorderRadius: '0'
    });
  }

  public isSignedIn(): void {
    const self = this;
    this.authService.getUserData(['username', 'firstName', 'lastName', 'avatar', 'isAdmin']).subscribe(function (res) {
      self.username = res.data.username;
      self.avatar = res.data.avatar;
      self.firstName = res.data.firstName;
      self.lastName = res.data.lastName;
      self.isAdmin = res.data.isAdmin;
      self.getNotifications();
    }, function (error) {
      if (error.status === 401) {
        self.authService.setToken(null);
        self.username = null;
        self.avatar = null;
        self.firstName = null;
        self.lastName = null;
        self.isAdmin = null;
        return;
      }
    });
  }
  modifyNotification(notificationId, isRead): void {
    let self = this;
    this.authService.modifyNotification(notificationId, self.username, isRead).subscribe(function (res) {
      self.getNotifications();
    });

  }
  getNotifications(): void {
    const self = this;
    this.authService.getUserData(['notifications']).subscribe(function (res) {
      // all notification except of type message
      let retrievednotifications = res.data.notifications.filter(function (notMessage) {
        return notMessage.type !== 'message';
      });
      // all notification that aren't read (not messages)
      let unreadNots = retrievednotifications.filter(function (notRead) {
        return notRead.isRead === false;
      });
      // unread notifications number
      self.unreadNotificationsNumber = unreadNots.length;

      // all notifications that are of type message and aren't read
      let messagesNotifications = res.data.notifications.filter(function (messageNotification) {
        return messageNotification.type === 'message' && messageNotification.isRead === false;
      });
      self.messagesNotifications = messagesNotifications;
      // unread messages number
      self.unreadNotificationsNumberMessages = messagesNotifications.length;

      for (let i = 0; i < retrievednotifications.length; i++) {
        let type = retrievednotifications[i].type;
        let itemId = retrievednotifications[i].itemId;
        let itemUsername = retrievednotifications[i].itemUsername;
        ///////////// all profile must be usernamesss
        // handle translating commenting

        // translate the body of the notification
        if (self.translate.currentLang === 'ara' && retrievednotifications[i].body.indexOf('commented on your') !== -1) {
          retrievednotifications[i].body = 'قام أحدهم بالتعليق على إحدى مساهماتك على الموقع';
        }

        if (self.translate.currentLang === 'ara' && retrievednotifications[i].body.indexOf('replied to your comment on') !== -1) {
          retrievednotifications[i].body = 'قام أحدهم بالرد على إحدى تعليقاتك';
        }

        if (self.translate.currentLang === 'ara' && retrievednotifications[i].body.indexOf('Verified Contributer') !== -1) {
          retrievednotifications[i].body = 'أصبحت الآن مساهم موثَّق';
        }

        if (self.translate.currentLang === 'ara' && retrievednotifications[i].body.indexOf('unlinked you') !== -1) {
          retrievednotifications[i].body = 'تم فصل حسابك الشخصي عن حساب متصل به بنجاح';
        }

        if (self.translate.currentLang === 'ara' && retrievednotifications[i].body.indexOf('booked your activity') !== -1) {
          retrievednotifications[i].body = 'تمَّ حجز مكان في أحد أنشطتك';
        }
        if (self.translate.currentLang === 'ara' && retrievednotifications[i].body.indexOf('activity was accepted') !== -1) {
          retrievednotifications[i].body = 'تمَّ قبول طلب إنشاء أحد أنشطتك';
        }

        if (self.translate.currentLang === 'ara' && retrievednotifications[i].body.indexOf('content was accepted') !== -1) {
          retrievednotifications[i].body = 'تمَّ قبول طلب إنشاء أحد مساهماتك التعليمية';
        }

        if (self.translate.currentLang === 'ara' &&
          retrievednotifications[i].body.indexOf('updated Content has been successfully') !== -1) {
          retrievednotifications[i].body = 'تم تحديث أحد مساهماتك التعليمية بنجاح';
        }

        if (self.translate.currentLang === 'ara' && retrievednotifications[i].body.indexOf('assigned you to') !== -1) {
          retrievednotifications[i].body = 'تمَّ وضع خطة دراسية لك';
        }

        if (self.translate.currentLang === 'ara' && retrievednotifications[i].body.indexOf('study plan is now published') !== -1) {
          retrievednotifications[i].body = 'تم نشر أحد خططك الدراسية بنجاح';
        }

        if (self.translate.currentLang === 'ara' && retrievednotifications[i].body.indexOf('unassigned you from a Study Plan') !== -1) {
          retrievednotifications[i].body = 'تمَّت إزالة خطة دراسية قد كانت معينة لك';
        }

        // attach links to notifications
        if ((type === 'link' || type === 'contributer') && itemUsername) {
          retrievednotifications[i].link = '/profile/' + retrievednotifications[i].itemUsername;
        } else if ((type === 'activity' || type === 'discussion activity') && itemId) {
          retrievednotifications[i].link = '/activities/' + retrievednotifications[i].itemId;
        } else if ((type === 'content' || type === 'discussion content') && itemId) {
          retrievednotifications[i].link = '/content/view/' + retrievednotifications[i].itemId;
        } else if (type === 'study plan A' && itemId) {
          retrievednotifications[i].link = '/scheduling/study-plan/personal/' + itemId;
        } else if (type === 'study plan' && itemId && itemUsername) {
          retrievednotifications[i].link = '/scheduling/study-plan/personal/' + itemId + '/' + itemUsername;
        } else if (type === 'product') {
          // do not need id in market
          retrievednotifications[i].link = '/market';
        } else {
          // if not any of these cases got to landing page
          retrievednotifications[i].link = '/profile';
        }
      }
      self.notifications = retrievednotifications.reverse();

    });
  }

  // method to change the website's language
  changeLanguage(): void {
    if (this.translate.currentLang === 'en') {
      this.translate.use('ara');
      localStorage.setItem('cachedLang', 'ara');
      $('body').addClass('rtl');
    } else {
      this.translate.use('en');
      localStorage.setItem('cachedLang', 'en');
      $('body').removeClass('rtl');
    }
    window.scrollTo(0, 0);
  }
  // method that makes all messages read
  onMessageIconClick() {
    let self = this;
    for (let i = 0; i < self.messagesNotifications.length; i++) {
      self.modifyNotification(self.messagesNotifications[i]._id, true);
    }
  }

}
