import { SETWRITE } from '../constants'

export function setwrite(n) {
	console.log('setwrite',n);
  return {
    type: SETWRITE,
    font: n
  }
}