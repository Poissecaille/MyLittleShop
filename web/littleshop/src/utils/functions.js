export function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}
export function multiplyFloatByInt(float, int, decimal) {
    return parseFloat(float * int).toFixed(decimal)
}