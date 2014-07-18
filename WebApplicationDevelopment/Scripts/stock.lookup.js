function lookupStock() {
    var symbol = $("#lookupSymbol").val();
    var symbols = Array(symbol);
    doLookup(symbols);
}

function doLookup(symbols) {
    var baseUrl = 'https://query.yahooapis.com';
    var query = 'select * from yahoo.finance.quote where symbol in (';
    for(var i = 0; i < symbols.length; i++){
        if(i > 0){
            query += ',\'' + symbols[i] + '\'';
        } else {
            query += '\'' + symbols[i] + '\'';
        }
    }
    query += ')'
    var endPoint = baseUrl + '/v1/public/yql?q=' + escape(query) + '&diagnostics=true&env='+escape('store://datatables.org/alltableswithkeys')+'&format=json';
    var request = $.ajax({
        url: endPoint,
        type: 'GET',
        dataType: 'json',
    });
    request.done(function (data) {
        try { console.log(data) } catch (e) { };
        var quoteResultsDiv = $("#quoteResults");
        var quote = data.query.results.quote;
        quoteResultsDiv.empty();
        $.each(quote, function (key, val) {
            quoteResultsDiv.append("<p><span>" + key + ": </span><span>" + val + "</p>");
        });
        quoteResultsDiv.show();
    });
    request.fail(function (jqXHR, textStatus) {
            try { console.log(jqXHR) } catch (e) { };
            alert("Request failed: " + jqXHR.statusText);
        });
}