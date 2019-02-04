
import { ActionTypes, AppActions } from '../actions/actions';

export const staff = (state: any = [], action: AppActions) => {
    switch (action.type) {
        case ActionTypes.STAFF_LOAD_STUDENTS:
            return {
                ...state,
                students: action.payload
            };
        default: 
            return state;
    }
}