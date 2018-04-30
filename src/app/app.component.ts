import { Component, ChangeDetectorRef, Renderer2, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './auth/auth.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/filter';
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
  links = [
    {
      url: '/content/list',
      name: 'Content',
      icon: 'book'
    },
    {
      url: '/profile',
      name: 'Profile',
      icon: 'account'
    },
    {
      url: '/message',
      name: 'Messaging',
      icon: 'email'
    },
    {
      url: '/market',
      name: 'Market',
      icon: 'shopping-cart'
    },
    {
      url: '/psychologist',
      name: 'Psychologists',
      icon: 'hospital'
    },
    {
      url: '/activities',
      name: 'Activities',
      icon: 'run'
    },
    {
      url: '/admin',
      name: 'Admin',
      icon: 'accounts-list'
    },
    {
      url: '/search',
      name: 'Connect Parents',
      icon: 'accounts'
    },
    {
      url: '/scheduling/study-plan/published',
      name: 'Study Plans',
      icon: 'graduation-cap'
    }
  ];
  constructor(private router: Router, private authService: AuthService,
    private translate: TranslateService) {
    const self = this;

    // this fallback language if any translation is not found
    translate.setDefaultLang('ara');

    // the language to use on load
    translate.use('ara');

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
    $(function () {
      'use strict';
      skinChanger();
      CustomScrollbar();
      initCounters();
      CustomPageJS();
    });
    // Counters JS
    function initCounters() {
      $('.count-to').countTo();
    }
    // Skin changer
    function skinChanger() {
      $('.right-sidebar .choose-skin li').on('click', function () {
        const $body = $('body');
        const $this = $(this);

        const existTheme = $('.right-sidebar .choose-skin li.active').data(
          'theme'
        );
        $('.right-sidebar .choose-skin li').removeClass('active');
        $body.removeClass('theme-' + existTheme);
        $this.addClass('active');
        $body.addClass('theme-' + $this.data('theme'));
      });
    }
    // All Custom Scrollbar JS
    function CustomScrollbar() {
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
        size: '3px',
        alwaysVisible: false,
        borderRadius: '3px',
        railBorderRadius: '0'
      });

      $('.right_chat .chat_body .chat-widget').slimscroll({
        height: 'calc(100vh - 145px)',
        color: 'rgba(0,0,0,0.1)',
        size: '2px',
        alwaysVisible: false,
        borderRadius: '3px',
        railBorderRadius: '2px',
        position: 'left'
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
    function CustomPageJS() {
      $('.boxs-close').on('click', function () {
        const element = $(this);
        const cards = element.parents('.card');
        cards.addClass('closed').fadeOut();
      });
      $('.menu-sm').on('click', function () {
        $('body').toggleClass('menu_sm');
      });
      // Chat widget js ====
      $(document).ready(function () {
        $('.btn_overlay').on('click', function () {
          $('.overlay_menu').fadeToggle(200);
          $(this)
            .toggleClass('btn-open')
            .toggleClass('btn-close');
        });
      });
      $('.overlay_menu').on('click', function () {
        $('.overlay_menu').fadeToggle(200);
        $('.overlay_menu button.btn')
          .toggleClass('btn-open')
          .toggleClass('btn-close');
      });
      // =========
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
    // Fullscreen
    $(function () {
      'use strict';
      $('#supported').text('Supported/allowed: ' + !!screenfull.enabled);

      if (!screenfull.enabled) {
        return false;
      }

      $('#request').on('click', function () {
        screenfull.request($('#container')[0]);
        // Does not require jQuery. Can be used like this too:
        // screenfull.request(document.getElementById('container'));
      });

      $('#exit').on('click', function () {
        screenfull.exit();
      });

      $('[data-provide~="boxfull"]').on('click', function () {
        screenfull.toggle($('.box')[0]);
      });

      $('[data-provide~="fullscreen"]').on('click', function () {
        screenfull.toggle($('#container')[0]);
      });

      // var selector = '[data-provide~='boxfull']';
      const selector = '[data-provide~="fullscreen"]';

      $(selector).each(function () {
        $(this).data('fullscreen-default-html', $(this).html());
      });

      document.addEventListener(screenfull.raw.fullscreenchange, function () {
        if (screenfull.isFullscreen) {
          $(selector).each(function () {
            $(this).addClass('is-fullscreen');
          });
        } else {
          $(selector).each(function () {
            $(this).removeClass('is-fullscreen');
          });
        }
      });

      function fullscreenchange() {
        const elem = screenfull.element;

        $('#status').text('Is fullscreen: ' + screenfull.isFullscreen);

        if (elem) {
          $('#element').text(
            'Element: ' + elem.localName + (elem.id ? '#' + elem.id : '')
          );
        }

        if (!screenfull.isFullscreen) {
          $('#external-iframe').remove();
          document.body.style.overflow = 'auto';
        }
      }

      screenfull.on('change', fullscreenchange);

      // Set the initial values
      fullscreenchange();
    }); // End of use strict

    this.isSignedIn();
  }

  isSignedIn(): void {
    console.log('triggered');
    const self = this;
    this.authService.getUserData(['username', 'firstName', 'lastName', 'avatar', 'isAdmin']).subscribe(function (res) {
      self.username = res.data.username;
      self.avatar = res.data.avatar;
      self.firstName = res.data.firstName;
      self.lastName = res.data.lastName;
      self.isAdmin = res.data.isAdmin;
    }, function (error) {
      console.log(error);
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

  // method to change the website's language
  changeLanguage(): void {
    if (this.translate.currentLang === 'en') {
      this.translate.use('ara');
    } else {
      this.translate.use('en');
    }

  }
}
