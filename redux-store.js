import { createStore } from "redux";
import rootReducer from "./reducer";
var reduxStore = createStore(rootReducer);
export default reduxStore;