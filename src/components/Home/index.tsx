import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="site-layout-background"
      style={{ padding: 24, minHeight: 360 }}
    >
      <h1>This is a home page.</h1>
      <Link to="tasks" >任务管理</Link>
    </div>
  );
};

export default Home;
