

const findUniqueKeys = (oldData, newData) => {
    const changedValues = {};

    for (const key in oldData) {
        if (
            oldData.hasOwnProperty(key) &&
            newData.hasOwnProperty(key) &&
            oldData[key] !== newData[key]
        ) {
            changedValues[key] = newData[key];
        }
    }

    return changedValues;
}

export default findUniqueKeys