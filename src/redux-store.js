
import { createStore } from "redux";
import rootReducer from "./reducer";

const reduxStore = createStore(rootReducer);

export default reduxStore;