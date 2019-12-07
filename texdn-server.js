
const https = require('https');
var fs = require("fs");
//var myParser = require("body-parser");
var qs = require('querystring');
const { exec } = require('child_process');



const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/tabdn.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/tabdn.com/fullchain.pem')
};


var express = require('express');
const flate = require('wasm-flate');

var app = express();
app.use('/',express.static('static'));

const server1 = https.createServer(options, app);

server1.listen(12312);






https.createServer(options, function(req, res) {
	if (req.url == "/createchart"){
		var data = '';
		var start = process.hrtime();
        req.on('data', function (chunk) {
            data += chunk;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (data.length > 1e6)
                req.connection.destroy();
        });

		// when we get data we want to store it in memory
		req.on('end', () => {
			//console.log(qs.parse(data).latexArea);
			var templateType = qs.parse(data).latexTemplate;
			var templateLoc = 'static/charts/'+templateType+'Chart.txt';
			console.log(qs.parse(data));
			fs.readFile(templateLoc, 'utf8', function(err, fileData) {
				fs.writeFile("texdnLatex/newtest2.tex", fileData, function (err) {
					fs.writeFile("texdnData/newdata.csv", qs.parse(data).dataArea, function (err) {
						var runtime = process.hrtime(start) // we also check how much time has passed
						console.info('Execution time (hr): %ds %dms', runtime[0], runtime[1] / 1000000);
						exec('latex -output-directory=texdnLatex texdnLatex/newtest2.tex && dvisvgm --output=static/%f-%p texdnLatex/newtest2.dvi --font-format=woff && python3 static/charts/pythonscript.py');
					});
				});
			});
			res.write(createLine(qs.parse(data).dataArea)); //write a response to the client
			res.end();
		});
	

    }

    
}).listen(3000);



function convertDataToFull(dataStr) {
	const parser = parse(dataStr, {
	  trim: true,
	  skip_empty_lines: true
	})
	console.log(parser);
	return parser;
}

function createLine(mydata) {

var startJS = `
<!DOCTYPE html>
<html lang="en">

<head>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.xkcd@1.1/dist/chart.xkcd.min.js"></script>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

</head>
<body>
<div class="chart-container" style="position: relative; height:50vh; width:30vw">
    <canvas id="myChart"></canvas>
</div>
<div class="chart-container" style="position: relative; height:50vh; width:30vw">
    <div id="plotlyDiv"></div>
</div>
<div class="chart-container" style="position: relative; height:50vh; width:30vw">
    <svg id="xkcdSvg"></svg>
</div>
<div class="chart-container" style="position: relative; height:50vh; width:30vw">
    <div id="googleChart"></div>
</div>
<div class="chart-container" style="position: relative; height:50vh; width:30vw">
    <object data="test4.svg" type="image/svg+xml">
	</object>
</div>
`

var endJS = `
</body>
</html>
`;


var fullArray = convertDataToFull(mydata);
console.log(fullArray);
var fullJS = startJS + createPlotlyLine() + createChartjsLine() + createXkcdLine() + createGoogleLine() + endJS;
fullJS = fullJS.replace(/replacexarray/g,'[1,2,3,4,5]');
fullJS = fullJS.replace(/replaceyarray/g,'[2,3,4,1,2]');
fullJS = fullJS.replace(/replaceyyarray/g,'[3,5,4,2,3]');
fullJS = fullJS.replace(/replacefullarray/g,'[["a","b","c"],[3,5,4],[4,2,3]]');
fullJS = fullJS.replace(/replaceobjectarray/g,'[{x: 0,y: 0}, {x: 5,y: 7}, {x: 10,y: 4}]');
return fullJS;
}











function createPlotlyLine() {
var baseJS = `
<script>
var trace3 = {
  x: replacexarray,
  y: replaceyarray,
  mode: 'lines+markers'
};

var data = [ trace3 ];

var layout = {
  title:'Line and Scatter Plot'
};

Plotly.newPlot('plotlyDiv', data, layout);
</script>
`;
return baseJS;

}

function createChartjsLine() {
var baseJS = `
<script>
var ctx = document.getElementById('myChart').getContext('2d');
var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Label',
            data: replaceobjectarray
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
});
</script>
`;
return baseJS;

}

function createXkcdLine() {
var baseJS = `
<script>
const lineChart = new chartXkcd.Line(document.querySelector('#xkcdSvg'), {
  title: 'Monthly income of an indie developer', // optional
  xLabel: 'Month', // optional
  yLabel: '$ Dollars', // optional
  data: {
    labels: ['1','2','7','4','5'],
    datasets: [{
      label: 'Plan',
      data: replaceyarray,
    }, {
      label: 'Reality',
      data: replaceyyarray,
    }],
  },
  options: { // optional
    yTickCount: 3,
    legendPosition: chartXkcd.config.positionType.upLeft
  }
})
</script>
`;
return baseJS;

}



function createGoogleLine() {
var baseJS = `
<script>
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
	var data = google.visualization.arrayToDataTable(replacefullarray);

	var options = {
	  title: 'Company Performance',
	  curveType: 'function',
	  legend: { position: 'bottom' }
	};

	var chart = new google.visualization.LineChart(document.getElementById('googleChart'));

	chart.draw(data, options);
  }
</script>
`;
return baseJS;

}