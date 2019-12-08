
const https = require('https');
var fs = require("fs");
//var myParser = require("body-parser");
var qs = require('querystring');
const { exec } = require('child_process');
var parse = require('csv-parse');
var nunjucks = require('nunjucks');


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


nunjucks.configure('templates', {
    autoescape: false
});



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
			fs.readFile(templateLoc, 'utf8', function(err, fileData) {
				fs.writeFile("texdnLatex/newtest2.tex", fileData, function (err) {
					fs.writeFile("texdnData/newdata.csv", qs.parse(data).dataArea, function (err) {
						var runtime = process.hrtime(start) // we also check how much time has passed
						console.info('Execution time (hr): %ds %dms', runtime[0], runtime[1] / 1000000);
						//exec('latex -output-directory=texdnLatex texdnLatex/newtest2.tex && dvisvgm --output=static/%f-%p texdnLatex/newtest2.dvi --font-format=woff && python3 static/charts/pythonscript.py');
						exec('latex -output-directory=texdnLatex texdnLatex/newtest2.tex && dvisvgm --output=static/%f-%p texdnLatex/newtest2.dvi --font-format=woff');

					});
				});
			});
			//res.write(createLine(qs.parse(data))); //write a response to the client
			res.write(nunjucks.render('createchart.html',{
				chartScript:createLine(qs.parse(data)), 
				dataAreaText: qs.parse(data).dataArea,
			}));
			res.end();
		});
	

    }

    
}).listen(3000);



function convertDataToFull(dataStr) {
	const parser = parse(dataStr, {
	  trim: true,
	  skip_empty_lines: true
	})
	retArray = [];
	var cols = [];
	var objArray = [];
	while (2 == 2) {
		var tempA = parser.read();
		if (!tempA){break;}
		if (cols.length == 0){
			for (var i=0;i<tempA.length;i++) {
				cols.push([]);
				
			}
		}
		else {
			for (var i=0;i<tempA.length;i++) {
				var cell = tempA[i];
				if (!isNaN(parseFloat(cell))){
					if ((parseFloat(cell)%1)===0) {
						cols[i].push(parseInt(cell));
						tempA[i] = parseInt(cell);
					}
					else {
						cols[i].push(parseFloat(cell));
						tempA[i] = parseFloat(cell);
					}
				}
				else {
					cols[i].push(cell);
				}
			}
			var xval = tempA[0];
			var yval = tempA[1];
			objArray.push({x:xval,y:yval});
		}
		retArray.push(tempA);
	}
	return [retArray,cols,objArray];
}

function createLine(alldata) {
var mydata = alldata.dataArea;
var frameworks = alldata.framework;
var title = alldata.title;
var stepSizeX = alldata.stepSizeX;
var stepSizeY = alldata.stepSizeY;





var bothArrays = convertDataToFull(mydata);
var fullArray = bothArrays[0];
var colArrays = bothArrays[1];

var fullJS = '';

for (var i=0;i<frameworks.length;i++){
	var options = {};
	if (frameworks[i] == 'latex'){
		fullJS += '';
	}
	else if (frameworks[i] == 'xkcd'){
		if (title != '' && title != 'notitle') {options['title'] = 'title: "'+title+'",';}
		fullJS += nunjucks.renderString(createXkcdLine(),options);
	}
	else if (frameworks[i] == 'google'){
		if (title != '' && title != 'notitle') {options['title'] = 'title: "'+title+'",';}
		fullJS += nunjucks.renderString(createGoogleLine(),options);
	}
	else if (frameworks[i] == 'plotly'){
		if (title != '' && title != 'notitle') {options['title'] = 'title: "'+title+'",';}
		if (stepSizeX != '' && stepSizeX != 'default') {options['xaxis'] = 'xaxis: {dtick: 1},' }
		fullJS += nunjucks.renderString(createPlotlyLine(),options);
	}
	else if (frameworks[i] == 'chartjs'){
		if (title != '' && title != 'notitle') {options['title'] = 'title: {display: true, text: "'+title+'"},';}
		fullJS += nunjucks.renderString(createChartjsLine(),options);
	}
}
//fullJS += endJS;

fullJS = fullJS.replace(/replacexarray/g,JSON.stringify(colArrays[0]));
fullJS = fullJS.replace(/replaceyarray/g,JSON.stringify(colArrays[1]));
fullJS = fullJS.replace(/replaceyyarray/g,JSON.stringify(colArrays[2]));
fullJS = fullJS.replace(/replacefullarray/g,JSON.stringify(fullArray));
fullJS = fullJS.replace(/replaceobjectarray/g,JSON.stringify(bothArrays[2]));


//ChartJS
if (stepSizeX != '' && stepSizeX != 'default') {
	fullJS = fullJS.replace(/replacestepx/g,'stepSize: '+stepSizeX+',');
}
else {
	fullJS = fullJS.replace(/replacestepx/g,'');
}
if (stepSizeY != '' && stepSizeY != 'default') {
	fullJS = fullJS.replace(/replacestepy/g,'stepSize: '+stepSizeY+',');
}
else {
	fullJS = fullJS.replace(/replacestepy/g,'');
}



return fullJS;
}











function createPlotlyLine() {
var baseJS = `
<script>
document.getElementById('plotlyDiv').style.display = 'block';
var trace3 = {
  x: replacexarray,
  y: replaceyarray,
  mode: 'lines+markers'
};

var data = [ trace3 ];

var layout = {
  {{ title }}
  {{ xaxis }}
  
};

Plotly.newPlot('plotlyDiv', data, layout);
</script>
`;
return baseJS;

}

function createChartjsLine() {
var baseJS = `
<script>
document.getElementById('myChart').style.display = 'block';
var ctx = document.getElementById('myChart').getContext('2d');
var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Label',
            data: replaceobjectarray,
            fill: false,
            backgroundColor: 'rgba(255,0,0,.3)',
            borderColor: 'rgba(0,255,0,.3)'
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    replacestepy
                }
            }],
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                    replacestepx
                }
            }]
        },
        {{ title }}
        
    }
});
</script>
`;
return baseJS;

}

function createXkcdLine() {
var baseJS = `
<script>
document.querySelector('#xkcdSvg').style.display = 'block';
const lineChart = new chartXkcd.Line(document.querySelector('#xkcdSvg'), {
  {{ title }}
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
  document.getElementById('googleChart').style.display = 'block';
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
	var data = google.visualization.arrayToDataTable(replacefullarray);

	var options = {
	  {{ title }}
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