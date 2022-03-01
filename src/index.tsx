import "reset-css";
import ReactDOM from "react-dom";
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./app";
import Home from "./pages/home";
import { getEmptyUser, GlobalContext, UserContent } from "./context";
import GithubCallback from "./components/github-callback";
import NotFound from "./pages/404";
import Tasks from "./pages/tasks";
import AddTask from "./pages/add-task";
import RequireAuth from "./components/require-auth";

const Index = () => {
  const [user, setUser] = useState<UserContent>(getEmptyUser());

  return (
    <React.StrictMode>
      <GlobalContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              
              <Route path="task">
                <Route path=":id" element={<p>这是任务管理面板页面</p>} />
                <Route
                  path="new"
                  element={
                    <RequireAuth>
                      <AddTask />
                    </RequireAuth>
                  }
                />
              </Route>

              <Route path="tasks" element={<Tasks />} />
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
