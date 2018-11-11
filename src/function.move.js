//@flow

// This function takes a data state of three arrays
// each array represents one column.

// It moves an item from one column to an adjacent column
// and returns it.

const Move = (value: { col: number, row: number, direction: number, data: Array<any> }) => {
    const updatedData = [...value.data];
    const extractedItem = updatedData[value.col].splice(value.row, 1)[0]
    if (!extractedItem) throw `item not found in column ${value.col}`
    const newColumn = updatedData[value.col + value.direction]
    if (!newColumn) throw `no destination column with index ${value.col + value.direction}`
    newColumn.push(extractedItem);
    return updatedData
};

export default Move