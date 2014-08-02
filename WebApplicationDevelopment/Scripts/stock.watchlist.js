function refreshWatchlist(symbols) {
    doLookup(symbols, buildWatchlistHTML);
}

function buildWatchlistHTML(dataArray) {
    quoteData = dataArray.quote;
    var html = "";
    if (watchlistItems.length > 0) {
        for (var i = 0; i < watchlistItems.length; i++) {
            var watchlistObject = watchlistItems[i];
            if (typeof (watchlistObject.PriceSold) == "number") {
                continue;
            }
            var data = getQuoteDataObject(quoteData, watchlistObject.Symbol);
            var dcColor = "green";
            if (data.Change < 0) {
                dcColor = "red";
            }
            html += "<tr>";
            html += "<td>" + data.Name + "</td>";
            html += "<td>" + data.Symbol + "</td>";
            html += "<td>" + data.LastTradePriceOnly + "</td>"
            html += "<td style=\"color: " + dcColor + "\">" + data.Change + "</td>";
            html += "<td>" + data.Volume + "</td>";
            html += "<td><span style=\"color: red; cursor: pointer;\" onclick=\"javascript: transferToPortfolio('" + watchlistObject.Id + "');\">[^]</span></td>";
            html += "<td><span style=\"color: red; cursor: pointer;\" onclick=\"javascript: removeFromWatchlist('" + watchlistObject.Id + "', true);\">[x]</span></td>";
            html += "</tr>"
        }
    } else {
        html += "<tr><td colspan=\"8\">No stocks to display</td></tr>";
    }
    $("#watchlist_table_body").html(html);
}

function addStockToWatchlistSubmit(symbol) {
    var data = { "Symbol": symbol };
    var url = "/api/watchlist/?Symbol=" + symbol;
    var request = $.ajax({
        url: url,
        type: 'POST',
        data: data,
    });
    request.done(function (result) {
        data.Id = result;
        watchlistItems[watchlistItems.length] = data;
        watchlistSymbols[watchlistSymbols.length] = symbol;
        refreshWatchlist(watchlistSymbols, buildWatchlistHTML);
        $("#quoteResults").hide();
    });
    request.fail(function (jqXHR, textStatus) {
        try { console.log(jqXHR) } catch (e) { };
        alert("Request failed: " + jqXHR.statusText);
    });
}

function getWatchlistObject(watchlistArray, id) {
    for (var i = 0; i < watchlistArray.length; i++) {
        if (watchlistArray[i].Id == id) {
            return watchlistArray[i];
        }
    }
    return false;
}

function deleteWatchlistObjectFromArray(id) {
    for (var i = 0; i < watchlistItems.length; i++) {
        if (watchlistItems[i].Id == id) {
            watchlistItems.splice(i, 1);
            watchlistSymbols.splice(i, 1);
        }
    }
}

function transferToPortfolio(id) {
    var watchlistObject = getWatchlistObject(watchlistItems, id);
    var symbol = watchlistObject.Symbol;
    var numberShares = prompt("How many shares did you purchase?");
    var pricePaid = prompt("At what price did you purchase your shares?");
    removeFromWatchlist(id, true);
    addToPortfolio(symbol, numberShares, pricePaid);
}

function removeFromWatchlist(id, refresh) {
    var data = { "Id": id };
    var url = "/api/watchlist/?Id=" + id;
    var request = $.ajax({
        url: url,
        type: 'DELETE',
        data: data,
    });
    request.done(function () {
        deleteWatchlistObjectFromArray(id);
        if (refresh == true) {
            refreshWatchlist(watchlistSymbols, buildWatchlistHTML);
        }
    });
    request.fail(function (jqXHR, textStatus) {
        try { console.log(jqXHR) } catch (e) { };
        alert("Request failed: " + jqXHR.statusText);
    });
}