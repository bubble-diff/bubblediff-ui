// create-react-app 将 index.js 作为入口

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// AntD components need this below.
import "antd/dist/antd.min.css";
import "@ant-design/pro-table/dist/table.css";
// 全局样式，所有自定义的style都定义于此。
import "./global.css";

import App from "./components/App";
import TaskTable from "./components/TaskTable";
import Home from "./components/Home";
import AddTask from "./components/AddTask";
import ConfigTask from "./components/ConfigTask";

const Login = () => {
  return (
    <div>
      <h1>这是一个登录页面</h1>
      <h2>将来要在这里实现第三方Github登录</h2>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />

          <Route path="tasks">
            <Route index element={<TaskTable />} />
            <Route path="add" element={<AddTask />} />
            <Route path="config" element={<ConfigTask />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
