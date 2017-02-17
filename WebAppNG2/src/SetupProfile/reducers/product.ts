
export const GET_PTODUCTS='GET_PTODUCTS';

export const product=(state={}, action)=>{
         switch(action.type){
            case GET_PTODUCTS: return Object.assign({}, state, {products:action.payload});
            default:
                return state;
        }
};