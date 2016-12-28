
export const ADD_HOUR = 'ADD_HOUR';
export const SUBTRACT_HOUR = 'SUBTRACT_HOUR';
export const ADD_INFO = 'ADD_INFO';

export const houseWorked = (state = 0, action) => {
    switch (action.type) {
        case ADD_HOUR:
            return state + 1;
        case SUBTRACT_HOUR:
            return state - 1;
        default:
            return state;
    }
}

export const person = (state = {}, action) => {
    switch (action.type) {
        case ADD_INFO:
            return Object.assign({}, state, action.payload)
        default:
            return state;
    }
}