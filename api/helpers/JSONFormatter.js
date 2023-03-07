module.exports = class JSONFormatter {

    //to make Array of Strings
    transformQueryResultsToArray(rawData) {
        let stringData = rawData.replace(/\s/g,'');
        let data = stringData.replace(/\n/g, '');
        let array = data.split(',');
        return array
    }

    //to make Array of Arrays
    transformQueryResultsToArrayOfArrays(rawData) {
        let stringData = rawData.replace(/\s/,'');
        let tempData = stringData.replace(/\n/g, '!');
        let cutLastTwoChars = tempData.substring(0, tempData.length-2);
        let cutExtraSpaces = cutLastTwoChars.replace(/\s/g,'');
        let appendArrayBracketAtEnd = cutExtraSpaces.concat('');
        let data = appendArrayBracketAtEnd.split("!");
        let dataArray= [];

        data.forEach(datum => {
            let array = datum.split(",")
            dataArray.push(array)
        })

        return dataArray;
    }
}