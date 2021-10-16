import React from "react";
import ReactDOM from "react-dom";
import "../src/index.css";
import "mapbox-gl/dist/mapbox-gl.css";
import App from "./app";
import "bootstrap/dist/css/bootstrap.css";

import { CurrentUserProvider } from "./CurrentUserContext";

ReactDOM.render(
  <React.StrictMode>
    <CurrentUserProvider>
      <App />
    </CurrentUserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
