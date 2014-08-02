function buildQuoteHTML(data) {
    //try { console.log(data) } catch (e) { };
    var quoteResultsDiv = $("#quoteResults");
    quoteResultsDiv.empty();
    var quoteHTML = "<table><tr><td><table class='quote-result-table'>";
    var counter = 0;
    var symbol;
    $.each(data.quote, function (key, val) {
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

function generateOptionsButtonsHTML(symbol) {
    var html = "<p>"
                + "<button onclick=\"javascript: addStockToPortfolioStart('" + symbol + "');\" class=\"button_primary\">Add to Portfolio</button>"
                + "<button onclick=\"javascript: addStockToWatchlistSubmit('" + symbol + "');\" class=\"button_primary\">Add to Watchlist</button>"
                + "</p>";
    return html;
}

function showOptionsButtons(symbol) {
    var html = generateOptionsButtonsHTML(symbol);
    $("#quote-results-options-div").empty();
    $("#quote-results-options-div").html(html);
}