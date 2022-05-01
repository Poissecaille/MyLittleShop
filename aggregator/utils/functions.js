const averageFromArray = (array) => {
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return parseFloat(Number(sum / array.length).toFixed(3));
}

module.exports = averageFromArray;