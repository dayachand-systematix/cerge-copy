import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import app from './reducers';

/**
 * @method configureStore
 * @description Create store and return it
 */
export default function configureStore() {
  let store = createStore(app, applyMiddleware(thunk));
  return store;
}
