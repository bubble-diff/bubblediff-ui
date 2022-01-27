// create-react-app 将 index.js 作为入口

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// antd components need this shit below.
import "antd/dist/antd.min.css";
import "@ant-design/pro-table/dist/table.css";
import "@ant-design/pro-layout/dist/layout.css";
import "@ant-design/pro-form/dist/form.css";
import "@ant-design/pro-card/dist/card.css";

import TaskTable from "./components/TaskTable";
import Home from "./components/Home";
import AddTask from "./components/AddTask";
import ConfigTask from "./components/ConfigTask";
import Login from "./components/Login";

import MyAppLayout from "./AppLayout";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyAppLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="tasks">
            <Route index element={<TaskTable />} />
            <Route path="add" element={<AddTask />} />
            <Route path="config" element={<ConfigTask />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
