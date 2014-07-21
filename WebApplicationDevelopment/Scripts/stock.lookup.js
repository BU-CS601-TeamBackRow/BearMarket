function lookupStock() {
    var symbol = $("#lookupSymbol").val();
    var symbols = Array(symbol);
    var data = doLookup(symbols);
    var quoteResultsDiv = $("#quoteResults");
    var quote = data.quote;
    quoteResultsDiv.empty();
    var quoteHTML = "<table><tr><td><table class='quote-result-table'>";
    var counter = 0;
    var symbol;
    $.each(quote, function (key, val) {
        if (key != 'symbol') {
            var row;
            if (counter % 2 != 0) {
                row = "<tr style='background-color: #ccc;'>";
            } else {
                row = "<tr>";
            }
            quoteHTML += row;
            quoteHTML += "<th class='quote-result-cell'><span class='quote-result-label'>" + key + "</span></th><td class='quote-result-cell'><span>" + val + "</span></td>";
            counter++;
        } else {
            symbol = val;
        }
    });
    quoteHTML += "</table></td><td><div id='quote-results-options-div' class='quote-results-options-div'>" + generateOptionsButtonsHTML(symbol) + "</td></tr></table>";
    quoteResultsDiv.append(quoteHTML);
    quoteResultsDiv.show();
}

function refreshPortfolio(symbols) {
    var data = doLookup(symbols);
    try { console.log(data) } catch (e) { };
    //$.each(data.query.results, function (obj) {
    //    try { console.log(obj) } catch (e) { };
    //});
}

function doLookup(symbols) {
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
    alert(query);
    var request = $.ajax({
        url: endPoint,
        type: 'GET',
        dataType: 'json',
    });
    request.done(function (data) {
        try { console.log(data) } catch (e) { };
        return data.query.results;
    });
    request.fail(function (jqXHR, textStatus) {
        try { console.log(jqXHR) } catch (e) { };
        alert("Request failed: " + jqXHR.statusText);
    });
}

function generateOptionsButtonsHTML(symbol) {
    var html = "<p><button onclick=\"javascript: addStockToPortfolioStart('" + symbol + "');\" class=\"button_primary\">Add to Portfolio</button><button onclick=\"javascript: addStockToWatchlistSubmit('" + symbol + "');\" class=\"button_primary\">Add to Watchlist</button></p>";
    return html;
}

function showOptionsButtons(symbol) {
    var html = generateOptionsButtonsHTML(symbol);
    $("#quote-results-options-div").empty();
    $("#quote-results-options-div").html(html);
}
function addStockToPortfolioStart(symbol) {
    $("#quote-results-options-div").empty();
    var html = "<form id=\"addToPortfolio\" action=\"/Portfolio/Create\"><input type=\"hidden\" id=\"symbol\" name=\"symbol\" value=\"" + symbol + "\"><p><span class=\"form_instrux_text\" >Price Paid: </span><input type=\"text\" id=\"pricePaid\" name=\"pricePaid\" /></p><p><span class=\"form_instrux_text\" >Number of Shares: </span><input type=\"text\" id=\"numberShares\" name=\"numberShares\" /></p></form><p><button class=\"button_primary\" onclick=\"javascript: addStockToPortfolioSubmit('" + symbol + "');\">submit</button><button class=\"button_secondary\" onclick=\"javascript: showOptionsButtons('" + symbol + "');\">cancel</button></p>";
    $("#quote-results-options-div").html(html);
}

function addStockToPortfolioSubmit() {
    var symbol = $("#symbol").val();
    var pricePaid = $("#pricePaid").val();
    var numberShares = $("#numberShares").val();
    var sharesValidate = validateShares(numberShares);
    var pricePaidValidate = validatePricePaid(pricePaid);
    if (!sharesValidate || !pricePaidValidate) {
        return false;
    } else {
        pricePaid = Math.round(pricePaid * 100) / 100;
        $("#pricePaid").val(pricePaid);
        $("#addToPortfolio").submit();
    }
}

function addStockToWatchlistSubmit(symbol) {

}

function validateShares(shares) {
    if (isNaN(shares)) {
        alert("Please enter a valid number for shares purchased.");
        return false;
    }
    if(shares < 0){
        alert("Please enter a positive number for shares purchased.");
        return false;
    }
    if (shares % 1 != 0) {
        alert("Please enter a whole number for shares purchased.");
        return false;
    }
    return true;
}

function validatePricePaid(pricePaid) {
    if (isNaN(pricePaid)) {
        alert("Please enter a valid number for purchase price.");
        return false;
    }
    if(pricePaid < 0){
        alert("Please enter a positive number for purchase price.");
        return false;
    }
    return true;
}
