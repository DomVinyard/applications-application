
import Move from './function.move'
const data = [[true], [], []]

// Desired behaviour
it('moves items between columns', () => {
    const updatedData = Move({col: 0, row: 0, direction: 1, data: [...data]})
    expect(updatedData[0].length).toEqual(0);
    expect(updatedData[1].length).toEqual(1);
    const revertedData = Move({col: 1, row: 0, direction: -1, data: updatedData})
    expect(revertedData[0].length).toEqual(1);
    expect(revertedData[1].length).toEqual(0);
});

// Undesired behavior
it('throw if invalid', () => {
    expect(() => Move({col: 1, row: 0, direction: 1, data: [...data]})).toThrowError('item not found in column 1');
    expect(() => Move({col: 0, row: 0, direction: -1, data: [...data]})).toThrowError('no destination column with index -1');
});