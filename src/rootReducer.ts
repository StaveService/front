import { combineReducers } from 'redux';
// eslint-disable-next-line import/no-cycle
import currentUserReducer from './slices/currentUser';

export default combineReducers({ currentUser: currentUserReducer });
