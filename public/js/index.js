var chart;
$(function () {
  $(document).ready(function () {
    $('#queryHistoricData').click(requestHistoricData);

    $('#startDate').datetimepicker();
    $('#endDate').datetimepicker();
    $("#startDate").on("dp.change",function (e) {
      $('#endDate').data("DateTimePicker").setMinDate(e.date);
    });
    $("#endDate").on("dp.change",function (e) {
      $('#startDate').data("DateTimePicker").setMaxDate(e.date);
    });

    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });

    $('#container').highcharts({
      chart: {
        type: 'spline',
        renderTo: 'container',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
          load: function () {
            chart = this;
            requestData();
          }
        }
      },
      title: {
        text: 'Live Aquarium Temperature (F\xB0)'
      },
      xAxis: {
        title: {
          text: 'Time'
        },
        type: 'datetime',
        tickPixelInterval: 150,
        labels: {
          rotation: 45,
          format: '{value:%I:%M:%S %p}'
        }
      },
      yAxis: {
        min: 60,
        max: 90,
        title: {
          text: 'Temperature (F\xB0)'
        },
        plotLines: [
          {
            value: 0,
            width: 1,
            color: '#808080'
          },
          {
            color: 'red',
            width: 3,
            value: 80,
            dashStyle: 'ShortDash'
          }
        ]
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>' +
            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
            Highcharts.numberFormat(this.y, 2) + ' F\xB0';
        }
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      series: [
        {
          name: 'Temperature data',
          data: []
        }
      ]
    });
  });
});

/**
 * Request new temperature data from the server and load it into the live graph.
 */
function requestData() {
  $.ajax({
    url: '/api/temperature',
    success: function (data) {
      var series = chart.series[0],
        shift = series.data.length > 20; // shift if the series is
      // longer than 20

      // add the point
      chart.series[0].addPoint([new Date().getTime(), data.fahrenheit], true, shift);

      // call it again after five seconds
      setTimeout(requestData, 5000);
    },
    cache: false
  });
}

function requestHistoricData(e) {
  e.preventDefault();
  $.ajax({
    url: '/api/historic/temperature',
    data: {
      startDate: $('#startDate').data("DateTimePicker").date.toISOString(),
      endDate: $('#endDate').data("DateTimePicker").date.toISOString()
    },
    success: function (data) {
      var chartData = [];
      for(var i = 0; i < data.length; i++) {
        chartData.push([new Date(data[i].timestamp).getTime(), data[i].temperatureFahrenheit])
      }

      console.log(chartData);

      loadHistoricalChart(chartData);
    },
    cache: false
  });
}

function loadHistoricalChart(chartData) {
  $('#historicalContainer').highcharts({
    chart: {
      type: 'spline',
      renderTo: 'container',
      animation: Highcharts.svg, // don't animate in old IE
      marginRight: 10,
    },
    title: {
      text: 'Historic Aquarium Temperature (F\xB0)'
    },
    xAxis: {
      title: {
        text: 'Time'
      },
      type: 'datetime',
      tickPixelInterval: 150,
      labels: {
        rotation: 45,
        format: '{value:%I:%M:%S %p}'
      }
    },
    yAxis: {
//      min: 60,
//      max: 90,
      title: {
        text: 'Temperature (F\xB0)'
      },
      plotLines: [
        {
          value: 0,
          width: 1,
          color: '#808080'
        },
        {
          color: 'red',
          width: 3,
          value: 80,
          dashStyle: 'ShortDash'
        }
      ]
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.series.name + '</b><br/>' +
          Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
          Highcharts.numberFormat(this.y, 2) + ' F\xB0';
      }
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    series: [
      {
        name: 'Temperature data',
        data: chartData
      }
    ]
  });
}
