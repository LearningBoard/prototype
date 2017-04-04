define(['util', 'temps/Template', 'bootstrap-dialog', 'highcharts'], function (util, Template, BootstrapDialog, Highcharts) {

  var ActivityAnalyticsTemplate = function(activityId) {
    var html = $(`
      <div>
        <button class="btn btn-default btn-sm">Usage Statistics</button>
      </div>
    `);
    Template.call(this, html);

    // logic
    util.get('/analytics/activity/' + activityId, function(dataSet) {
      dataSet = dataSet.data;

      // chart
      html.find('button').on('click', function() {
        BootstrapDialog.show({
          title: '[Chart] Usage Statistics',
          message: '<div id="analyticsChartDialog"></div>',
          buttons: [{
              label: 'Close',
              action: function(dialogRef) {
                dialogRef.close();
              }
          }],
          onshown: function(dialogRef) {
            var dataPrepared = {};
            for (var key in dataSet.session) {
              for (var value in dataSet.session[key]) {
                var action = dataSet.session[key][value].data.action;
                if (!dataPrepared[action]) {
                  dataPrepared[action] = 0;
                }
                dataPrepared[action]++;
              }
            }
            var dataToRender = [];
            for (var key in dataPrepared) {
              dataToRender.push({
                name: key,
                y: dataPrepared[key]
              });
            }
            if (dataToRender.length < 1) {
              dataToRender.push({
                name: 'No data available',
                y: 1
              });
            }
            Highcharts.chart('analyticsChartDialog', {
              chart: {
                type: 'pie'
              },
              title: {
                text: null
              },
              tooltip: {
                pointFormat: '{series.name}: {point.y} ({point.percentage:.1f}%)'
              },
              plotOptions: {
                pie: {
                  dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}%'
                  }
                }
              },
              series: [
                {
                  name: 'Times',
                  data: dataToRender
                }
              ]
            });
          }
        });
      });
    }, function(err) {
      // Could not retrieve analytics data
    });
  };

  $.extend(ActivityAnalyticsTemplate.prototype, Template.prototype);

  return ActivityAnalyticsTemplate;

});
