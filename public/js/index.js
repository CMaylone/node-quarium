var temperatureChart;
var phChart;
$(function () {
  $(document).ready(function () {
    $('#queryHistoricData').click(requestHistoricData);

    $('#startDate').datetimepicker();
    $('#endDate').datetimepicker();
    $("#startDate").on("dp.change", function (e) {
      $('#endDate').data("DateTimePicker").setMinDate(e.date);
    });
    $("#endDate").on("dp.change", function (e) {
      $('#startDate').data("DateTimePicker").setMaxDate(e.date);
    });

    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });

    $('#temperatureContainer').highcharts({
      chart: {
        type: 'spline',
        renderTo: 'temperatureContainer',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
          load: function () {
            temperatureChart = this;
            requestTemperatureData();
          }
        }
      },
      title: {
        text: 'Temperature (F\xB0)'
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

    $('#phContainer').highcharts({
      chart: {
        type: 'spline',
        renderTo: 'phContainer',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
          load: function () {
            phChart = this;
            requestPhData();
          }
        }
      },
      title: {
        text: 'PH'
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
        min: 0,
        max: 14,
        title: {
          text: 'PH'
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
            value: 10,
            dashStyle: 'ShortDash'
          }
        ]
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>' +
            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
            Highcharts.numberFormat(this.y, 2);
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
          name: 'PH data',
          data: []
        }
      ]
    });
  });
});

/**
 * Request new temperature data from the server and load it into the live graph.
 */
function requestTemperatureData() {
  $.ajax({
    url: '/api/temperature',
    success: function (data) {
      var series = temperatureChart.series[0],
        shift = series.data.length > 20; // shift if the series is
      // longer than 20

      // add the point
      temperatureChart.series[0].addPoint([new Date().getTime(), data.fahrenheit], true, shift);

      // call it again after five seconds
      setTimeout(requestTemperatureData, 5000);
    },
    cache: false
  });
}

function requestPhData() {
  $.ajax({
    url: '/api/ph',
    success: function (data) {
      var series = phChart.series[0],
        shift = series.data.length > 20; // shift if the series is
      // longer than 20

      // add the point
      phChart.series[0].addPoint([new Date().getTime(), data.ph], true, shift);

      // call it again after five seconds
      setTimeout(requestPhData, 5000);
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
      for (var i = 0; i < data.length; i++) {
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
