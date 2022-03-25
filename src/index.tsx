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
import TaskPanel from "./pages/task-panel";
import UpdateTask from "./pages/update-task";

const Index = () => {
  const [user, setUser] = useState<UserContent>(getEmptyUser());

  return (
    <React.StrictMode>
      <GlobalContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />

              <Route path="tasks">
                <Route
                  index
                  element={
                    <RequireAuth>
                      <Tasks />
                    </RequireAuth>
                  }
                />

                <Route path=":id">
                  <Route
                    index
                    element={
                      <RequireAuth>
                        <TaskPanel />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="update"
                    element={
                      <RequireAuth>
                        <UpdateTask />
                      </RequireAuth>
                    }
                  />
                </Route>

                <Route
                  path="new"
                  element={
                    <RequireAuth>
                      <AddTask />
                    </RequireAuth>
                  }
                />
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
