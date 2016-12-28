export const houseWorked = (state = 0, action) => {
    switch (action.type) {
        case 'ADD_HOUR':
            return state + 1;
        case 'SUBTRACT_HOUR':
            return state - 1;
        default:
            return state;
    }
}