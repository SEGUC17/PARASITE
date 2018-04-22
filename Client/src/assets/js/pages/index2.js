$(function() {
    "use strict";
    MorrisArea();
    Jknob();
});
//=====
function MorrisArea() {
    Morris.Area({
        element: 'm_area_chart2',
        data: [{
                period: '2012',
                SiteA: 25,
                SiteB: 0,

            }, {
                period: '2013',
                SiteA: 105,
                SiteB: 89,

            }, {
                period: '2014',
                SiteA: 78,
                SiteB: 55,

            }, {
                period: '2015',
                SiteA: 89,
                SiteB: 185,

            }, {
                period: '2016',
                SiteA: 175,
                SiteB: 105,

            }, {
                period: '2017',
                SiteA: 102,
                SiteB: 148,

            }
        ],
        xkey: 'period',
        ykeys: ['SiteA', 'SiteB'],
        labels: ['Site A', 'Site B'],
        pointSize: 0,
        fillOpacity: 0.5,
        pointStrokeColors: ['#b6b8bb', '#26c6da'],
        behaveLikeLine: true,
        gridLineColor: '#4e4e4e',
        lineWidth: 0,
        smooth: false,
        hideHover: 'auto',
        lineColors: ['#b6b8bb', '#26c6da'],
        resize: true
    });
}
//=====
$(window).on('scroll',function() {
    $('.card .sparkline').each(function() {
        var imagePos = $(this).offset().top;

        var topOfWindow = $(window).scrollTop();
        if (imagePos < topOfWindow + 400) {
            $(this).addClass("pullUp");
        }
    });
});

//=====
function Jknob() {
    $(".dial1").knob();
    $({animatedVal: 0}).animate({animatedVal: 66}, {
        duration: 4000,
        easing: "swing", 
        step: function() { 
            $(".dial1").val(Math.ceil(this.animatedVal)).trigger("change"); 
        }
    });
    $(".dial2").knob();
    $({animatedVal: 0}).animate({animatedVal: 26}, {
        duration: 4500,
        easing: "swing", 
        step: function() { 
            $(".dial2").val(Math.ceil(this.animatedVal)).trigger("change"); 
        }
    });
    $(".dial3").knob();
    $({animatedVal: 0}).animate({animatedVal: 76}, {
        duration: 3800,
        easing: "swing", 
        step: function() { 
            $(".dial3").val(Math.ceil(this.animatedVal)).trigger("change"); 
        }
    });
    $(".dial4").knob();
    $({animatedVal: 0}).animate({animatedVal: 88}, {
        duration: 5200,
        easing: "swing", 
        step: function() { 
            $(".dial4").val(Math.ceil(this.animatedVal)).trigger("change"); 
        }
    });
}