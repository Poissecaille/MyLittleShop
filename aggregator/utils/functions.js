const averageFromArray = (array) => {
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
        sum += parseInt(array[i], 10);
    }
    return Number(sum / array.length).toFixed(3)
}

module.exports = averageFromArray;