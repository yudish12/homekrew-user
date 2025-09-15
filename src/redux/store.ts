import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import loggingMiddleware from "./middlewares/logging";
import { rootReducer } from "./reducers";
import { RootState } from "../types";

const configureStore = (initialState: RootState) => {
    const middleware = applyMiddleware(thunk, loggingMiddleware);

    return createStore<RootState, any>(rootReducer, initialState, middleware);
};

export default configureStore;
