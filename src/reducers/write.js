import { SETWRITE } from '../constants'

const initialState = {
  font: '好啊好啊'
}

export default function update(state = initialState, action) {
	switch(action.type){
		case SETWRITE:
			return {
				...state,
				font : action.font
			}
		break;
			default:
		return state;
	}
}
