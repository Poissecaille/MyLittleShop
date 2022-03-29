const parseDate = (dateStr) => {
    let date = dateStr.toISOString().split("T");
    date = date[0] + " " + date[1].split(".")[0];
    return date;
}



module.exports = parseDate