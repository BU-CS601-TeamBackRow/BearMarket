function validateShares(shares) {
    if (isNaN(shares)) {
        alert("Please enter a valid number for shares purchased.");
        return false;
    }
    if (shares < 0) {
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
    if (pricePaid < 0) {
        alert("Please enter a positive number for purchase price.");
        return false;
    }
    return true;
}