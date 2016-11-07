google.charts.load('current', { 'packages': ['bar'] });
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var searchParams = new URLSearchParams(location.search);
  var $chartDiv = $('chart_div');
  if (searchParams.has("uuid")) {
    var uuid = searchParams.get("uuid");
    var statURL = 'http://atoth.sote.hu/~tocsa/vdf2016r/uuid-' + uuid + '.jsonp';
    $.getJSON(statURL, function(stat) {
      var chartData = [
        [
          'Category',
          'Median',
          'Conference Avergae Median',
          'Average',
          'Conference Avergae'
        ]
      ];
      var rating = stat.rating;
      var contentRating = rating['content'];
      if (contentRating.values.length > 0) {
        chartData.push([
          'Content',
          contentRating.median,
          contentRating.conferenceMedian,
          contentRating.avg,
          contentRating.conferenceAvg
        ]);
        $('#contentBody').html(JSON.stringify(contentRating.values));
      } else {
        chartData.push(['Content', null, null, null, null]);
      }
      var presentationRating = rating['presentation'];
      if (presentationRating.values.length > 0) {
        chartData.push([
          'Presentation',
          presentationRating.median,
          presentationRating.conferenceMedian,
          presentationRating.avg,
          presentationRating.conferenceAvg
        ]);
        $('#presentationBody').html(JSON.stringify(presentationRating.values));
      } else {
        chartData.push(['Presentation', null, null]);
      }
      var venueRating = rating['venue'];
      if (venueRating.values.length > 0) {
        chartData.push([
          'Venue',
          venueRating.median,
          venueRating.conferenceMedian,
          venueRating.avg,
          venueRating.conferenceAvg
        ]);
        $('#venueBody').html(JSON.stringify(venueRating.values));
      } else {
        chartData.push(['Venue', null, null]);
      }
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
      var chart = new google.charts.Bar(document.getElementById('chart_div'));
      chart.draw(data, options);
    }).fail(function() {
      $chartDiv.html("Couldn't download stat. Wrong GUID?");
    });
  } else {
    $chartDiv.html('Need UUID URL parameter');
  }
}
