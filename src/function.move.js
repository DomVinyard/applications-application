//@flow

// This function takes a data state of three arrays
// each array represents one column.

// It moves an item from one column to an adjascent column
// and returns it.

function Move(value: { col: number, row: number, direction: number, data: any }) {
    const updatedData = [...value.data];
    const extractedItem = updatedData[value.col].splice(value.row, 1)[0]
    updatedData[value.col + value.direction].push(extractedItem);
    return updatedData
};

export default Move