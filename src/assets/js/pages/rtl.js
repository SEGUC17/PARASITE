$(function () {
    new Chart(document.getElementById("bar_chart").getContext("2d"), getChartJs('bar'));    
});

function getChartJs(type) {
    var config = null;

    if (type === 'bar') {
        config = {
            type: 'bar',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    data: [28, 48, 40, 19, 86, 27, 90],
                    backgroundColor: '#26c6da',
                    strokeColor: "rgba(255,118,118,0.1)",
                }, {
                        label: "My Second dataset",
                        data: [10, 30, 80, 61, 26, 75, 40],
                        backgroundColor: '#8a8a8b',
                        strokeColor: "rgba(255,118,118,0.1)",
                    }]
            },
            options: {
                responsive: true,
                legend: false
            }
        }
    }   
    return config;
}
