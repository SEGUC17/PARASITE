$(function() {
    "use strict";
    MorrisArea();
});

//======
function MorrisArea() {
   
    Morris.Area({
        element: 'm_area_chart',
        data: [{
                period: '2011',
                Profit: 8,
                Expense: 45,
            }, {
                period: '2012',
                Profit: 159,
                Expense: 19,
            }, {
                period: '2013',
                Profit: 18,
                Expense: 79,
            }, {
                period: '2014',
                Profit: 189,
                Expense: 89,
            }, {
                period: '2015',
                Profit: 68,
                Expense: 22,
            }, {
                period: '2016',
                Profit: 37,
                Expense: 187,
            },{
                period: '2017',
                Profit: 215,
                Expense: 69,
            }
        ],
        xkey: 'period',
        ykeys: ['Profit', 'Expense'],
        labels: ['Profit', 'Expense'],
        pointSize: 3,
        fillOpacity: 0,
        pointStrokeColors: ['#FFC107 ', '#60bafd'],
        behaveLikeLine: true,
        gridLineColor: '#262f3d',
        lineWidth: 2,
        hideHover: 'auto',
        lineColors: ['#FFC107 ', '#60bafd'],
        resize: true
    
    });
}
//======
$(window).on('scroll',function() {
    $('.card .sparkline').each(function() {
        var imagePos = $(this).offset().top;

        var topOfWindow = $(window).scrollTop();
        if (imagePos < topOfWindow + 400) {
            $(this).addClass("pullUp");
        }
    });
});
//======

/*VectorMap Init*/

$(function() {
	"use strict";
	var mapData = {
			"US": 298,
			"SA": 200,
			"AU": 760,
			"IN": 2000000,
			"GB": 120,
		};
	
	if( $('#world-map-markers').length > 0 ){
		$('#world-map-markers').vectorMap(
		{
			map: 'world_mill_en',
			backgroundColor: 'transparent',
			borderColor: '#fff',
			borderOpacity: 0.25,
			borderWidth: 0,
			color: '#e6e6e6',
			regionStyle : {
				initial : {
				  fill : '#f4f4f4'
				}
			  },

			markerStyle: {
			  initial: {
							r: 5,
							'fill': '#fff',
							'fill-opacity':1,
							'stroke': '#000',
							'stroke-width' : 1,
							'stroke-opacity': 0.4
						},
				},
		   
			markers : [{
				latLng : [21.00, 78.00],
				name : 'INDIA : 350'
			  
			  },
			  {
				latLng : [-33.00, 151.00],
				name : 'Australia : 250'
				
			  },
			  {
				latLng : [36.77, -119.41],
				name : 'USA : 250'
			  
			  },
			  {
				latLng : [55.37, -3.41],
				name : 'UK   : 250'
			  
			  },
			  {
				latLng : [25.20, 55.27],
				name : 'UAE : 250'
			  
			  }],

			series: {
				regions: [{
					values: {
						"US": '#2CA8FF',
						"SA": '#888888',
						"AU": '#18ce0f',
						"IN": '#f96332',
						"GB": '#FFB236',
					},
					attribute: 'fill'
				}]
			},
			hoverOpacity: null,
			normalizeFunction: 'linear',
			zoomOnScroll: false,
			scaleColors: ['#000000', '#000000'],
			selectedColor: '#000000',
			selectedRegions: [],
			enableZoom: false,
			hoverColor: '#fff',
		});
	}
});
 