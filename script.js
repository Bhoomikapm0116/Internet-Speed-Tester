const testButton = document.getElementById("testButton");
const downloadSpeedLabel = document.getElementById("downloadSpeed"); 
testButton.addEventListener("click", startTest);

google.charts.load("current", { packages: ["corechart", "gauge"] });
google.charts.setOnLoadCallback(drawChart);

function startTest() {
  downloadSpeedLabel.textContent = ""; 
  downloadFile("https://getsamplefiles.com/download/mp4/sample-1.mp4"); 
}

function drawChart(speed = 0) {
  let data = google.visualization.arrayToDataTable([
    ["Label", "Value"],
    ["Download Speed", speed],
  ]);

  let options = {
    min: 0,
    max: 100,
    width: 300,
    height: 300,
    minorTicks: 5,
    majorTicks: ["0", "20", "40", "60", "80", "100"],
    needleColor: '#00FF00',  
  };

  let chart = new google.visualization.Gauge(document.getElementById("chart_div"));
  chart.draw(data, options);
}

async function downloadFile(url) {
  let uniqueUrl = url + "?t=" + new Date().getTime();
  const response = await fetch(uniqueUrl);
  const reader = response.body.getReader();
  let receivedLength = 0;
  let startTime = new Date();

  while (true) {
    const { done, value } = await reader.read();
    receivedLength += value.length;
    let currentTime = new Date();
    let timeElapsed = (currentTime - startTime) / 1000;
    let speed = (8 / 1000000) * (receivedLength / timeElapsed);
    drawChart(speed);

    if (done || timeElapsed > 15) { 
      break;
    }
  }

  let currentTime = new Date();
  let timeElapsed = (currentTime - startTime) / 1000;
  let averageSpeed = (8 / 1000000) * (receivedLength / timeElapsed); 
  drawChart(averageSpeed);

  averageSpeed = averageSpeed.toFixed(2);
  downloadSpeedLabel.textContent = `${averageSpeed} Mbps`;
}
