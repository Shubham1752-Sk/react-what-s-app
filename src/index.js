import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit"
import { thunk } from "redux-thunk";
// import store, {persistor} from "./store";
import rootReducer from "./reducer";
// import { PersistGate } from "redux-persist/integration/react";

const store = configureStore({
  reducer: rootReducer,
})
// applyMiddleWare(thunk)
// )

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store} >
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
