
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
			res.write(createLine()); //write a response to the client
			res.end();
		});
	

    }

    
}).listen(3000);


function createLine() {
var startJS = `
<!DOCTYPE html>
<html lang="en">

<head>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>
<body>
<div class="chart-container" style="position: relative; height:30vh; width:30vw">
    <canvas id="myChart"></canvas>
</div>
<div class="chart-container" style="position: relative; height:30vh; width:30vw">
    <div id="plotlyDiv"></div>
</div>
`

var endJS = `
</body>
</html>
`;
return startJS + createPlotlyLine() + createChartjsLine() + endJS;

}

function createPlotlyLine() {
var baseJS = `
<script>
var trace3 = {
  x: [1, 2, 3, 4],
  y: [12, 9, 15, 12],
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
            data: [{
                x: -10,
                y: 0
            }, {
                x: 0,
                y: 10
            }, {
                x: 10,
                y: 5
            }]
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


