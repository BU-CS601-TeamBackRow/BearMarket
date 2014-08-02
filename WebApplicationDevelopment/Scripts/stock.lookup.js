function lookupStock() {
    var symbol = $("#lookupSymbol").val();
    var symbols = Array(symbol);
    doLookup(symbols, buildQuoteHTML);
}

function getQuoteDataObject(data, symbol) {
    if ($.isArray(data) && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].symbol.toLowerCase() == symbol.toLowerCase()) {
                return data[i];
            }
        }
    } else if ($.isPlainObject(data)) {
        return data;
    }
    return null;
}

function doLookup(symbols, callback) {
    if(symbols.length > 0){
        var $returnData;
        var baseUrl = 'https://query.yahooapis.com';
        var query = 'select * from yahoo.finance.quote where symbol in (';
        for (var i = 0; i < symbols.length; i++) {
            if (i > 0) {
                query += ',\'' + symbols[i] + '\'';
            } else {
                query += '\'' + symbols[i] + '\'';
            }
        }
        query += ')';
        var endPoint = baseUrl + '/v1/public/yql?q=' + escape(query) + '&diagnostics=true&env=' + escape('store://datatables.org/alltableswithkeys') + '&format=json';
        var request = $.ajax({
            url: endPoint,
            type: 'GET',
            dataType: 'json',
        });
        request.done(function (data) {
            //try { console.log(data.query.results) } catch (e) { };
            callback(data.query.results);
        });
        request.fail(function (jqXHR, textStatus) {
            try { console.log(jqXHR) } catch (e) { };
            alert("Request failed: " + jqXHR.statusText);
        });
    } else {
        var data = new Object();
        data.quote = null;
        callback(data);
    }
}