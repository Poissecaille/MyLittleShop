export function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}
export function multiplyFloatByInt(float, int, decimal) {
    return parseFloat(float * int).toFixed(decimal)
}
export function isEmpty(obj) {
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}
