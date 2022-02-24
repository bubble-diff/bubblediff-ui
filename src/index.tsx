import "reset-css";
import ReactDOM from "react-dom";
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./app";
import Home from "./pages/home";
import {
  getEmptyMessage,
  getEmptyUser,
  GlobalContext,
  MessageContent,
  UserContent,
} from "./context";
import GithubCallback from "./components/github-callback";
import NotFound from "./pages/404";
import Tasks from "./pages/tasks";
import AddTask from "./pages/add-task";

const Index = () => {
  const [user, setUser] = useState<UserContent>(getEmptyUser());
  const [message, setMessage] = useState<MessageContent>(getEmptyMessage());

  return (
    <React.StrictMode>
      <GlobalContext.Provider value={{ user, setUser, message, setMessage }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="tasks">
                <Route index element={<Tasks />} />
                <Route path="add" element={<AddTask />} />
              </Route>
            </Route>

            <Route path="/callback">
              <Route path="github" element={<GithubCallback />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>
    </React.StrictMode>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
