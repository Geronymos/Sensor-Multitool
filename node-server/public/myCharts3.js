var socket;

class Piechart {
    constructor(elem) {
        var pieConfig = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [1,3],
                    backgroundColor: [
                        window.chartColors.grey,
                        window.chartColors.yellow,
                    ],
                    label: 'Dataset 1'
                }],
                labels: [
                    'CO2',
                    'Luftqualität',
                ]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    // display: true,
                    // text: 'Chart.js Doughnut Chart'
                    text: 'Donutdiagramm 😋 - Luftverschmutzung Anteil'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };
        this.chart = new Chart(elem, pieConfig);
    }
}



class Linechart {
    constructor(elem) {
        var lineConfig = {
            type: 'line',
            data: {
                labels: [
                ],
                datasets: [
                    {
                        label: 'CO2',
                        backgroundColor: "rgba(201, 203, 207, 0.5)",
                        borderColor: chartColors.grey,
                        data: []
                    },
                    {
                        label: 'Luftverschmutzung',
                        backgroundColor: "rgba(255, 205, 86, 0.5)",
                        borderColor: chartColors.yellow,
                        data: []
                    }
                ]
            },
            options: {
                title: {
                    // text: 'Chart.js Time Scale'
                    // display: true,
                    text: 'Liniendiagramm - Luftverschmutzung über Zeit'
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Zeit',
                        },
                        ticks: {
                            autoSkipPadding: 50
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'parts per million (ppm)'
                        }
                    }]
                },
            }
        };
        this.chart = new Chart(elem, lineConfig);
    }
}

class Sensordata {
    constructor(name, unit) {
        this.name = name;
        this.unit = unit;
        this.data = [];
    }
    add(data) {
        var dataObj = {
            value: data,
            time: performance.now()
        };
        this.data = [...this.data, dataObj]
    }
}

var lineCtx = document.getElementById('lineChart').getContext('2d');
var pieCtx = document.getElementById('pieChart').getContext('2d');

var data = {
    co2: [],
    airQuality: []
}






var lineChart = new Chart(lineCtx, lineConfig);
var pieChart = new Chart(pieCtx, pieConfig);


var showFinal = false;

function demo() {
    showFinal = false;
    reset();

    $('#demo-chart-btn').addClass('active');
    $('#demo-chart-btn > .spinner-grow').show();

    $('#final-chart-btn').removeClass('active');
    $('#final-chart-btn > .spinner-grow').hide();
    

    demoValues = createDemoValues();
}


function final() {
    reset();

    $('#final-chart-btn').addClass('active');
    $('#final-chart-btn > .spinner-grow').show();
    
    $('#demo-chart-btn').removeClass('active');
    $('#demo-chart-btn > .spinner-grow').hide();

    showFinal = true;
    
    socket = io();

    socket.on('sensor', function(msg){
        console.log(msg);

        if( showFinal ) {

            
            if( msg.includes('Co2: ') ) {
                
                var value = msg.split('Co2: ')[1]*1;
                data.co2.push( value );
                console.log('Co2: ', value);
                
            }
            
            else if( msg.includes('LABR: ') ) {
                
                var value = msg.split('LABR: ')[1]*1;
                data.airQuality.push( value );
                console.log('LABR:', value);
            }
            
            
            lineConfig.data.labels.push( ~~(performance.now()/1000) + " Sek" );
            
            updateCharts();
        }
    });
}

function reset() {

    clearInterval(demoValues);

    data.co2 = [];
    data.airQuality = [];

    lineConfig.data.labels = [];
    lineConfig.data.datasets[0].data = [];
    lineConfig.data.datasets[1].data = [];

    pieConfig.data.datasets[0].data[0] = [];
    pieConfig.data.datasets[0].data[1] = [];

    step = 0;

    lineChart.update();
    pieChart.update();
}

var step = 0;
var demoValues;

var createDemoValues = () => setInterval(()=>{

    data.co2.push(Math.random()*12);
    data.airQuality.push(Math.random()*12);
    
    lineConfig.data.labels.push(step*3+ " Sek");
    
    updateCharts();

    step++;
    
}, 3000);


function updateCharts() {

    lineConfig.data.datasets[0].data.push(data.co2[data.co2.length-1]);
    lineConfig.data.datasets[1].data.push(data.airQuality[data.airQuality.length-1]);
    
    pieConfig.data.datasets[0].data[0] = data.co2[data.co2.length-1];
    pieConfig.data.datasets[0].data[1] = data.airQuality[data.airQuality.length-1];

    lineChart.update();
    pieChart.update();

}



demo();