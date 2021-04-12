import {all} from "redux-saga/effects";
import {combineReducers} from "redux";

import * as auth from "../app/modules/Auth/_redux/authRedux";
import planetReducer from '../app/pages/_redux/Reducers/wateringSlice';
import tokenReducer from '../app/pages/_redux/Reducers/TokenSlice';

export const rootReducer = combineReducers({
  auth: auth.reducer,
  planetReducer:planetReducer,
  tokenReducer:tokenReducer
});

export function* rootSaga() {
  yield all([auth.saga()]);
}