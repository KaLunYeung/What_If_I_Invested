
function extractDates(jsonData)
{
  var intendedData = [];
  var beginningDate = new Date(document.getElementById("BeginDate").value ); 
  var endingDate = new Date(document.getElementById("EndDate").value);

  
  $.each( jsonData, function(index,value){
    var currentDate = new Date(index);
    if (beginningDate <= currentDate && currentDate <= endingDate){
      intendedData.push(value);
    }
})
  
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
  if (AllData.length <1)
  {
    
    document.getElementById("demo").innerHTML = "Looks like that ";
    return;
  }



  var begin = (AllData[AllData.length-1]["1. open"]); 
  var end = (AllData[0]["4. close"]); 
  var stockAmount = document.getElementById("AmountEntered").value/parseFloat(begin); 
  

  for (var i = 0; i < AllData.length; i++) {
    if (AllData[i]["8. split coefficient"] != "1.0000")
    {
      stockAmount = stockAmount *(AllData[i]["8. split coefficient"]);
    }
    
}
  

  
  
  
  
  for (var i = 0; i < AllData.length; i++) {
    if (AllData[i]["7. dividend amount"] != "0.0000")
    {
        var dividend = parseFloat(AllData[i]["7. dividend amount"]);
        var openPrice = parseFloat(AllData[i]["1. open"]);
        var reinvestment = dividend/openPrice;
        stockAmount = stockAmount + reinvestment;
    }
    
}
  
  
 var total = (parseFloat(end) * stockAmount);
  
  document.getElementById("demo").innerHTML = total;
})
}