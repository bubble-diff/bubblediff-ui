import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="site-layout-background"
      style={{ padding: 24, minHeight: 360 }}
    >
      <h1>This is a home page.</h1>
      <p>
        我将在这里介绍如何使用Bubble Diff，相当于一个readme。
      </p>
      <ul>
        <li>
          <Link to="/">首页</Link>
        </li>
        <li>
          <Link to="/tasks">任务管理</Link>
        </li>
        <li>
          <Link to="/tasks/add">新建任务</Link>
        </li>
        <li>
          <Link to="/tasks/config">配置任务</Link>
        </li>
        <li>
          <Link to="/login">登录</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
