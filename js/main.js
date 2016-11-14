google.charts.load('current', { 'packages': ['corechart', 'bar', 'line'] });
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var searchParams = new URLSearchParams(location.search);
  var $accordion = $('#accordion');
  var $chartDiv = $('#chart-div');
  if (searchParams.has("uuid")) {
    var uuid = searchParams.get("uuid");
    var statURL = 'http://atoth.sote.hu/~tocsa/vdf2016r/uuid-' + uuid + '.jsonp';
    $.getJSON(statURL, function(stat) {
      var chartData = [
        [
          'Category',
          'Median',
          'Conference Median Avergae',
          'Average',
          'Conference Avergae'
        ]
      ];
      var rating = stat.rating;

      aggregateData.categoryNames.forEach(function(categoryName) {
        var categoryRating = rating[categoryName];
        if (categoryRating.values > 0) {
          chartData.push([
            categoryName,
            categoryRating.median,
            aggregateData[categoryName].median,
            categoryRating.avg,
            aggregateData[categoryName].avg
          ]);

          $accordion.append(
            '<div class="panel panel-default">' +
            '  <div class="panel-heading" role="tab" id="' + categoryName + 'Heading">' +
            '    <h4 class="panel-title">' +
            '      <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + categoryName + '" aria-expanded="true" aria-controls="collapse' + categoryName + '">' +
            '        ' + categoryName + ' rating distribution' +
            '      </a>' +
            '    </h4>' +
            '  </div>' +
            '  <div id="collapse' + categoryName + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + categoryName + 'Heading">' +
            '    <div class="panel-body">' +
            '      <div id="' + categoryName + 'Div" class="chart-div">' +
            '        <p>No data</p>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>'
          )

          // var distribData = [
          //   [
          //     'Rating',
          //     'Session',
          //     'Conference (normalized)'
          //   ]
          // ];
          var distribData = new google.visualization.DataTable();
          distribData.addColumn('string', 'Rating');
          distribData.addColumn('number', 'Session');
          distribData.addColumn('number', 'Conference (normalized)');
          var numRates = aggregateData.ratingTitles.length;
          sumAggrDistrib = aggregateData[categoryName].distribution.reduce(function(a, b) {return a + b});
          sumDistrib = categoryRating.distribution.reduce(function(a, b) {return a + b});
          for (var i = 0; i < numRates; i++) {
            // distribData.push([
            //   aggregateData.ratingTitles[i],
            //   categoryRating.distribution[i],
            //   aggregateData[categoryName].distribution[i] * sumDistrib / sumAggrDistrib
            // ]);
            distribData.addRow([
              aggregateData.ratingTitles[i],
              categoryRating.distribution[i],
              aggregateData[categoryName].distribution[i] * sumDistrib / sumAggrDistrib
            ]);
          }
          // var dData = google.visualization.arrayToDataTable(distribData);
          // var $chartDiv = $('#' + categoryName + 'Div');
          var options = {
            width: $chartDiv.width(),
            height: $chartDiv.height(),
            title: stat.title,
            subtitle: '',
            curveType: 'function',
            pointSize: 7
          }
          var dChart = new google.visualization.LineChart(document.getElementById(categoryName + 'Div'));
          dChart.draw(distribData, options);
        } else {
          chartData.push([categoryName, null, null, null, null]);
        }
      });
      if (stat.comments.length > 0) {
        var commentsHtml = '<ul>';
        stat.comments.forEach(function (comment) {
          commentsHtml += '<li>' + comment + '</li>';
        });
        commentsHtml += '</ul>';
        $('#commentBody').html(commentsHtml);
      }
      var data = google.visualization.arrayToDataTable(chartData);
      var options = {
        width: $chartDiv.width(),
        height: $chartDiv.height(),
        chart: {
          title: stat.title,
          subtitle: ''
        }
      }
      var chart = new google.charts.Bar(document.getElementById('chart-div'));
      chart.draw(data, options);
    }).fail(function() {
      $chartDiv.html("Couldn't download stat. Wrong GUID?");
    });
  } else {
    $chartDiv.html('Need UUID URL parameter');
  }
}
