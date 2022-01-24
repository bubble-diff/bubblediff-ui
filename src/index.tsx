// create-react-app 将 index.js 作为入口

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// AntD components need this below.
import "antd/dist/antd.min.css";
// 全局样式，所有自定义的style都定义于此。
import "./global.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
