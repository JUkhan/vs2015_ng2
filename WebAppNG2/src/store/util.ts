import { Action } from './Dispatcher';


export function toPayload(action: Action) {
  return action.payload;
}
