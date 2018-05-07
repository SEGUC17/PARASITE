function addLoadEvent(e){var a=window.onload;"function"!=typeof window.onload?window.onload=e:window.onload=function(){a(),e()}}function loadTracking(){var e,a,t,n,i,s;e=window,a=document,t="script",n="ga",e.GoogleAnalyticsObject=n,e.ga=e.ga||function(){(e.ga.q=e.ga.q||[]).push(arguments)},e.ga.l=1*new Date,i=a.createElement(t),s=a.getElementsByTagName(t)[0],i.async=1,i.src="https://www.google-analytics.com/analytics.js",s.parentNode.insertBefore(i,s),ga("create",trackingId,"auto"),ga("send","pageview")}function initSparkline(){$(".sparkline").each(function(){var e=$(this);e.sparkline("html",e.data())})}function initCounters(){$(".count-to").countTo()}function skinChanger(){$(".right-sidebar .choose-skin li").on("click",function(){var e=$("body"),a=$(this),t=$(".right-sidebar .choose-skin li.active").data("theme");$(".right-sidebar .choose-skin li").removeClass("active"),e.removeClass("theme-"+t),a.addClass("active"),e.addClass("theme-"+a.data("theme"))})}function CustomScrollbar(){$(".sidebar .menu .list").slimscroll({height:"calc(100vh - 65px)",color:"rgba(0,0,0,0.2)",position:"left",size:"2px",alwaysVisible:!1,borderRadius:"3px",railBorderRadius:"0"}),$(".navbar-left .dropdown-menu .body .menu").slimscroll({height:"300px",color:"rgba(0,0,0,0.2)",size:"3px",alwaysVisible:!1,borderRadius:"3px",railBorderRadius:"0"}),$(".cwidget-scroll").slimscroll({height:"306px",color:"rgba(0,0,0,0.4)",size:"2px",alwaysVisible:!1,borderRadius:"3px",railBorderRadius:"2px"}),$(".right_chat .chat_body .chat-widget").slimscroll({height:"calc(100vh - 145px)",color:"rgba(0,0,0,0.1)",size:"2px",alwaysVisible:!1,borderRadius:"3px",railBorderRadius:"2px",position:"left"}),$(".right-sidebar .slim_scroll").slimscroll({height:"calc(100vh - 60px)",color:"rgba(0,0,0,0.4)",size:"2px",alwaysVisible:!1,borderRadius:"3px",railBorderRadius:"0"})}function CustomPageJS(){$(".boxs-close").on("click",function(){$(this).parents(".card").addClass("closed").fadeOut()}),$(".theme-light-dark .t-light").on("click",function(){$("body").removeClass("menu_dark")}),$(".theme-light-dark .t-dark").on("click",function(){$("body").addClass("menu_dark")}),$(".menu-sm").on("click",function(){$("body").toggleClass("menu_sm")}),$(document).ready(function(){$(".btn_overlay").on("click",function(){$(".overlay_menu").fadeToggle(200),$(this).toggleClass("btn-open").toggleClass("btn-close")})}),$(".overlay_menu").on("click",function(){$(".overlay_menu").fadeToggle(200),$(".overlay_menu button.btn").toggleClass("btn-open").toggleClass("btn-close"),open=!1}),$(".form-control").on("focus",function(){$(this).parent(".input-group").addClass("input-group-focus")}).on("blur",function(){$(this).parent(".input-group").removeClass("input-group-focus")})}if("undefined"==typeof jQuery)throw new Error("jQuery plugins need to be before this file");$(function(){"use strict";$.AdminsQuare.browser.activate(),$.AdminsQuare.leftSideBar.activate(),$.AdminsQuare.rightSideBar.activate(),$.AdminsQuare.rightchat.activate(),$.AdminsQuare.navbar.activate(),$.AdminsQuare.select.activate(),setTimeout(function(){$(".page-loader-wrapper").fadeOut()},50)}),$.AdminsQuare={},$.AdminsQuare.options={colors:{red:"#ec3b57",pink:"#E91E63",purple:"#ba3bd0",deepPurple:"#673AB7",indigo:"#3F51B5",blue:"#2196f3",lightBlue:"#03A9F4",cyan:"#00bcd4",green:"#4CAF50",lightGreen:"#8BC34A",yellow:"#ffe821",orange:"#FF9800",deepOrange:"#f83600",grey:"#9E9E9E",blueGrey:"#607D8B",black:"#000000",blush:"#dd5e89",white:"#ffffff"},leftSideBar:{scrollColor:"rgba(0,0,0,0.5)",scrollWidth:"4px",scrollAlwaysVisible:!1,scrollBorderRadius:"0",scrollRailBorderRadius:"0"},dropdownMenu:{effectIn:"fadeIn",effectOut:"fadeOut"}},$.AdminsQuare.leftSideBar={activate:function(){var e=this,a=$("body"),t=$(".overlay");$(window).on("click",function(n){var i=$(n.target);"i"===n.target.nodeName.toLowerCase()&&(i=$(n.target).parent()),!i.hasClass("bars")&&e.isOpen()&&0===i.parents("#leftsidebar").length&&(i.hasClass("js-right-sidebar")||t.fadeOut(),a.removeClass("overlay-open"))}),$.each($(".menu-toggle.toggled"),function(e,a){$(a).next().slideToggle(0)}),$.each($(".menu .list li.active"),function(e,a){var t=$(a).find("a:eq(0)");t.addClass("toggled"),t.next().show()}),$(".menu-toggle").on("click",function(e){var a=$(this),t=a.next();if($(a.parents("ul")[0]).hasClass("list")){var n=$(e.target).hasClass("menu-toggle")?e.target:$(e.target).parents(".menu-toggle");$.each($(".menu-toggle.toggled").not(n).next(),function(e,a){$(a).is(":visible")&&($(a).prev().toggleClass("toggled"),$(a).slideUp())})}a.toggleClass("toggled"),t.slideToggle(320)}),e.checkStatuForResize(!0),$(window).resize(function(){e.checkStatuForResize(!1)}),Waves.attach(".menu .list a",["waves-block"]),Waves.init()},checkStatuForResize:function(e){var a=$("body"),t=$(".navbar .navbar-header .bars"),n=a.width();e&&a.find(".content, .sidebar").addClass("no-animate").delay(1e3).queue(function(){$(this).removeClass("no-animate").dequeue()}),n<1170&&(a.addClass("ls-closed"),t.fadeIn())},isOpen:function(){return $("body").hasClass("overlay-open")}},$.AdminsQuare.rightSideBar={activate:function(){var e=this,a=$("#rightsidebar"),t=$(".overlay");$(window).on("click",function(n){var i=$(n.target);"i"===n.target.nodeName.toLowerCase()&&(i=$(n.target).parent()),!i.hasClass("js-right-sidebar")&&e.isOpen()&&0===i.parents("#rightsidebar").length&&(i.hasClass("bars")||t.fadeOut(),a.removeClass("open"))}),$(".js-right-sidebar").on("click",function(){a.toggleClass("open"),e.isOpen()?t.fadeIn():t.fadeOut()})},isOpen:function(){return $(".right-sidebar").hasClass("open")}},$.AdminsQuare.rightchat={activate:function(){var e=this,a=$("#rightchat"),t=$(".overlay");$(window).on("click",function(n){var i=$(n.target);"i"===n.target.nodeName.toLowerCase()&&(i=$(n.target).parent()),!i.hasClass("js-right-chat")&&e.isOpen()&&0===i.parents("#rightchat").length&&(i.hasClass("bars")||t.fadeOut(),a.removeClass("open"))}),$(".js-right-chat").on("click",function(){a.toggleClass("open"),e.isOpen()?t.fadeIn():t.fadeOut()})},isOpen:function(){return $(".right_chat").hasClass("open")}},$.AdminsQuare.navbar={activate:function(){var e=$("body"),a=$(".overlay");$(".bars").on("click",function(){e.toggleClass("overlay-open"),e.hasClass("overlay-open")?a.fadeIn():a.fadeOut()}),$('.nav [data-close="true"]').on("click",function(){var e=$(".navbar-toggle").is(":visible"),a=$(".navbar-collapse");e&&a.slideUp(function(){a.removeClass("in").removeAttr("style")})})}},$.AdminsQuare.select={activate:function(){$.fn.selectpicker&&$("select:not(.ms)").selectpicker()}};var edge="Microsoft Edge",ie10="Internet Explorer 10",ie11="Internet Explorer 11",opera="Opera",firefox="Mozilla Firefox",chrome="Google Chrome",safari="Safari";$.AdminsQuare.browser={activate:function(){""!==this.getClassName()&&$("html").addClass(this.getClassName())},getBrowser:function(){var e=navigator.userAgent.toLowerCase();return/edge/i.test(e)?edge:/rv:11/i.test(e)?ie11:/msie 10/i.test(e)?ie10:/opr/i.test(e)?opera:/chrome/i.test(e)?chrome:/firefox/i.test(e)?firefox:navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)?safari:void 0},getClassName:function(){var e=this.getBrowser();return e===edge?"edge":e===ie11?"ie11":e===ie10?"ie10":e===opera?"opera":e===chrome?"chrome":e===firefox?"firefox":e===safari?"safari":""}},addLoadEvent(loadTracking);var trackingId="UA-30038099-6";$(function(){"use strict";skinChanger(),CustomScrollbar(),initSparkline(),initCounters(),CustomPageJS()}),$(function(){"use strict";function e(){var e=screenfull.element;$("#status").text("Is fullscreen: "+screenfull.isFullscreen),e&&$("#element").text("Element: "+e.localName+(e.id?"#"+e.id:"")),screenfull.isFullscreen||($("#external-iframe").remove(),document.body.style.overflow="auto")}if($("#supported").text("Supported/allowed: "+!!screenfull.enabled),!screenfull.enabled)return!1;$("#request").on("click",function(){screenfull.request($("#container")[0])}),$("#exit").on("click",function(){screenfull.exit()}),$('[data-provide~="boxfull"]').on("click",function(){screenfull.toggle($(".box")[0])}),$('[data-provide~="fullscreen"]').on("click",function(){screenfull.toggle($("#container")[0])});var a='[data-provide~="fullscreen"]';$(a).each(function(){$(this).data("fullscreen-default-html",$(this).html())}),document.addEventListener(screenfull.raw.fullscreenchange,function(){screenfull.isFullscreen?$(a).each(function(){$(this).addClass("is-fullscreen")}):$(a).each(function(){$(this).removeClass("is-fullscreen")})}),screenfull.on("change",e),e()});