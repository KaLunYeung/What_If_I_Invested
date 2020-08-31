
function extractDates(jsonData)
{
  var intendedData = [];
  var dates = [];
  var tradeData=[];
  var beginningDate = new Date(document.getElementById("BeginDate").value ); 
  var endingDate = new Date(document.getElementById("EndDate").value);

  
  $.each( jsonData, function(index,value){
    var currentDate = new Date(index);
    if (beginningDate <= currentDate && currentDate <= endingDate){
      tradeData.push(value);
      dates.push(index);
    }
})
  
  intendedData = [dates,tradeData]
  return intendedData;
  
}

function calculate()
{
  var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=';
  url = url + document.getElementById("stockSymbol").value;
  url = url + '&outputsize=full&apikey=YVNFFRKV90K4JN0B';
$.getJSON(url, function(data) {
    
  var RawData = data["Time Series (Daily)"]; 
  
  var AllData = extractDates(RawData);
  var tradingDate = AllData[0].reverse();
  var tradingInformation =AllData[1];

  
  var dailyNetworth = [];

  if (tradingDate <1)
  {
    
    document.getElementById("demo").innerHTML = "Looks like that there was no trading day in th specified range ";
    return;
  }
  
  var begin = (tradingInformation[tradingInformation.length-1]["1. open"]); 
  
  var stockAmount = document.getElementById("AmountEntered").value/parseFloat(begin); 
  
  for (var i = tradingInformation.length-1; i >= 0; i--) {

    if (tradingInformation[i]["8. split coefficient"] != "1.0000")
    {
      
      stockAmount = stockAmount *(tradingInformation[i]["8. split coefficient"]);
    }
    if (tradingInformation[i]["7. dividend amount"] != "0.0000")
    {
        var dividend = parseFloat(tradingInformation[i]["7. dividend amount"]);
        var openPrice = parseFloat(tradingInformation[i]["1. open"]);
        var reinvestment = dividend/openPrice;
        console.log(dividend);
        stockAmount = stockAmount + reinvestment;
    }


    var currentNetWorth = stockAmount * tradingInformation[i]["4. close"]; 
    dailyNetworth.push(currentNetWorth);

  }
  console.log(tradingDate);
  console.log(dailyNetworth);
  
  var endTotal = dailyNetworth[dailyNetworth.length-1];
  showGraph(tradingDate,   dailyNetworth, document.getElementById("stockSymbol").value);
  document.getElementById("demo").innerHTML = endTotal;





  }) //jquery ending
} //function ending





function showGraph(x_axis,y_axis,symbol){
  var ctx = document.getElementById('myChart').getContext("2d");


  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
          labels: x_axis,
          datasets: [{
              label: symbol,
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: y_axis,
              fill:false,
          }]
      },

      // Configuration options go here
      options: {responsive: true,
        maintainAspectRatio: false}
  });

}

