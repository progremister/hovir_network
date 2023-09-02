import React from "react";
import ReactDOM from "react-dom";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

import App from "./App";
import { store } from "./app/store";

if(process.env.NODE_ENV === "production") disableReactDevTools();

const rootElement = document.getElementById("root");

ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>,
  rootElement
);
