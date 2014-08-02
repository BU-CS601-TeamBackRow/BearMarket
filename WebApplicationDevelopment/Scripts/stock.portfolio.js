function refreshPortfolio(symbols) {
    doLookup(symbols, buildPortfolioHTML);
}

function buildSoldPortfolioHTML(dataArray) {
    quoteData = dataArray.quote;
    var html = "";
    if (portfolioItems.length > 0) {
        for (var i = 0; i < portfolioItems.length; i++) {
            var portfolioObject = portfolioItems[i];
            if (typeof (portfolioObject.PriceSold) != "number") {
                continue;
            }
            var data = getQuoteDataObject(quoteData, portfolioObject.Symbol);
            var saleValue = Math.round((portfolioObject.SharesPurchase * portfolioObject.PriceSold) * 100) / 100;
            var currentValue = Math.round((portfolioObject.SharesPurchase * data.LastTradePriceOnly) * 100) / 100;
            var changeSinceSale = saleValue - currentValue;
            var gainLoss = (portfolioObject.SharesPurchase * portfolioObject.PriceSold) - (portfolioObject.SharesPurchase * portfolioObject.PricePaid);

            var svColor = "green";
            if (gainLoss < 0) {
                svColor = "red";
            }
            var dcColor = "green";
            if (data.Change < 0) {
                dcColor = "red";
            }
            var glColor = "green";
            if (gainLoss < 0) {
                glColor = "red";
            }
            var slsColor = "green";
            var slsSymbol = "+";
            if (changeSinceSale >= 0) {
                slsColor = "red";
                slsSymbol = "-";
            }
            html += "<tr>";
            html += "<td>" + data.Name + "</td>";
            html += "<td>" + data.Symbol + "</td>";
            html += "<td style=\"color: " + dcColor + "\">" + data.Change + "</td>";
            html += "<td>" + data.LastTradePriceOnly + "</td>";
            html += "<td>" + portfolioObject.SharesPurchase + "</td>";
            html += "<td>" + portfolioObject.PricePaid + "</td>";
            html += "<td>" + portfolioObject.PriceSold + "</td>";
            html += "<td>" + saleValue + "</td>";
            html += "<td>" + currentValue + "</td>";
            html += "<td style=\"color: " + glColor + "\">" + Math.round(gainLoss) + "</td>"
            html += "<td style=\"color: " + slsColor + "\">" + slsSymbol + Math.abs(Math.round(changeSinceSale)) + "</td>";
            html += "<td><span style=\"color: red; cursor: pointer;\" onclick=\"javascript: removeFromPortfolio('" + portfolioObject.Id + "');\">[x]</span></td>";
            html += "</tr>"
        }
    } else {
        html += "<tr><td colspan=\"8\">No stocks to display</td></tr>";
    }
    $("#sold_table_body").html(html);
}

function buildPortfolioHTML(dataArray) {
    quoteData = dataArray.quote;
    var html = "";
    if (portfolioItems.length > 0) {
        for (var i = 0; i < portfolioItems.length; i++) {
            var portfolioObject = portfolioItems[i];
            if (typeof (portfolioObject.PriceSold) == "number") {
                continue;
            }
            var data = getQuoteDataObject(quoteData, portfolioObject.Symbol);
            var gainLoss = Math.round(((portfolioObject.SharesPurchase * data.LastTradePriceOnly) - (portfolioObject.SharesPurchase * portfolioObject.PricePaid)) * 100) / 100;
            var glColor = "green";
            if (gainLoss < 0) {
                glColor = "red";
            }
            var dcColor = "green";
            if (data.Change < 0) {
                dcColor = "red";
            }
            var currentValue = Math.round((portfolioObject.SharesPurchase * data.LastTradePriceOnly) * 100) / 100;
            html += "<tr>";
            html += "<td>" + data.Name + "</td>";
            html += "<td>" + data.Symbol + "</td>";
            html += "<td>" + data.LastTradePriceOnly + "</td>"
            html += "<td style=\"color: " + dcColor + "\">" + data.Change + "</td>";
            html += "<td>" + data.Volume + "</td>";
            html += "<td>" + portfolioObject.SharesPurchase + "</td>";
            html += "<td>" + portfolioObject.PricePaid + "</td>";
            html += "<td>" + currentValue + "</td>";
            html += "<td style=\"color: " + glColor + "\">" + gainLoss + "</td>";
            html += "<td><span style=\"color: red; cursor: pointer;\" onclick=\"javascript: sold('" + portfolioObject.Id + "');\">[$]</span></td>";
            html += "<td><span style=\"color: red; cursor: pointer;\" onclick=\"javascript: removeFromPortfolio('" + portfolioObject.Id + "');\">[x]</span></td>";
            html += "</tr>"
        }
    } else {
        html += "<tr><td colspan=\"8\">No stocks to display</td></tr>";
    }
    $("#portfolio_table_body").html(html);
    buildSoldPortfolioHTML(dataArray);
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
        addToPortfolio();
    }
}

function getPortfolioObject(portfolioArray, id) {
    for (var i = 0; i < portfolioArray.length; i++) {
        if (portfolioArray[i].Id == id) {
            return portfolioArray[i];
        }
    }
    return false;
}

function deletePortfolioObjectFromArray(id) {
    for (var i = 0; i < portfolioItems.length; i++) {
        if (portfolioItems[i].Id == id) {
            portfolioItems.splice(i, 1);
            portfolioSymbols.splice(i, 1);
        }
    }
}

function addToPortfolio(fnsymbol, fnnumberShares, fnpricePaid) {
    var symbol;
    var pricePaid;
    var numberShares;
    if (fnsymbol != null && fnnumberShares != null && fnpricePaid != null) {
        symbol = fnsymbol;
        pricePaid = fnpricePaid;
        numberShares = fnnumberShares;
    } else {
        symbol = $("#symbol").val();
        pricePaid = $("#pricePaid").val();
        numberShares = $("#numberShares").val();
    }
    var data = { "Symbol": symbol, "PricePaid": pricePaid, "SharesPurchase": numberShares };
    try { console.log(data); } catch (e) { };
    var url = "/api/portfolio/?Symbol=" + symbol + "&PricePaid=" + pricePaid + "&SharesPurchase=" + numberShares;
    var request = $.ajax({
        url: url,
        type: 'POST',
        data: data,
    });
    request.done(function (result) {
        data.Id = result;
        portfolioItems[portfolioItems.length] = data;
        portfolioSymbols[portfolioSymbols.length] = symbol;
        refreshPortfolio(portfolioSymbols, buildPortfolioHTML);
        $("#quoteResults").hide();
    });
    request.fail(function (jqXHR, textStatus) {
        try { console.log(jqXHR) } catch (e) { };
        alert("Request failed: " + jqXHR.statusText);
    });
}

function removeFromPortfolio(id) {
    var data = { "Id": id };
    var url = "/api/portfolio/?Id=" + id;
    var request = $.ajax({
        url: url,
        type: 'DELETE',
        data: data,
    });
    request.done(function () {
        deletePortfolioObjectFromArray(id);
        refreshPortfolio(portfolioSymbols, buildPortfolioHTML);
    });
    request.fail(function (jqXHR, textStatus) {
        try { console.log(jqXHR) } catch (e) { };
        alert("Request failed: " + jqXHR.statusText);
    });
}

function sold(id) {
    var priceSold = prompt("At what price did you sell this holding?")
    var data = { "Id": id, "PriceSold": priceSold };
    var url = "/api/portfolio/?Id=" + id + "&PriceSold=" + priceSold;
    var request = $.ajax({
        url: url,
        type: 'PUT',
        data: data,
    });
    request.done(function () {
        pO = getPortfolioObject(portfolioItems, id);
        pO.PriceSold = parseInt(priceSold);
        try { console.log(pO); } catch (e) { };
        refreshPortfolio(portfolioSymbols, buildPortfolioHTML);
    });
    request.fail(function (jqXHR, textStatus) {
        try { console.log(jqXHR) } catch (e) { };
        alert("Request failed: " + jqXHR.statusText);
    });
}