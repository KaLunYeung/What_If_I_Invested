
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
    
    document.getElementById("FinalAmount").innerHTML = "Looks like that the sepcified range does not have one single trading day ";
    document.getElementById("Return").innerHTML = "";
    return;
  }
  
  var begin = (tradingInformation[tradingInformation.length-1]["1. open"]); 
  var initialAmount = document.getElementById("AmountEntered").value;
  var stockAmount = initialAmount/parseFloat(begin); 
  
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
       
        stockAmount = stockAmount + reinvestment;
    }


    var currentNetWorth = stockAmount * tradingInformation[i]["4. close"]; 
    dailyNetworth.push(currentNetWorth);

  }

  
  var endTotal = dailyNetworth[dailyNetworth.length-1];
  showGraph(tradingDate,   dailyNetworth, document.getElementById("stockSymbol").value);
  document.getElementById("FinalAmount").innerHTML = "Final Amount = $" + endTotal.toFixed(2);
  document.getElementById("Return").innerHTML = "Return On Investment: " + (((endTotal-initialAmount) /initialAmount) * 100).toFixed(2) + "%";





  }) //jquery ending
} //function ending





function showGraph(x_axis,y_axis,symbol){
  var ctx = document.getElementById('myChart').getContext("2d");


  var chart = new Chart(ctx, {
      
      type: 'line',

      
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

      
      options: {responsive: true,
        maintainAspectRatio: false}
  });

}

