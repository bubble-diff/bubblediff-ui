import ProLayout from "@ant-design/pro-layout";
import { Link, Outlet, useLocation } from "react-router-dom";

import defaultProps from "./_props";

// AppLayout 使用了antd的prolayout
const AppLayout = () => {
  const pathname = useLocation().pathname;
  return (
    <ProLayout
      {...defaultProps}
      // 用来表示当前选中的menuitem
      location={{ pathname }}
      // 用来控制menuitem渲染出来的元素
      menuItemRender={(item, dom) => {
        const path = item.path || "";
        return <Link to={path}>{dom}</Link>;
      }}
    >
      <Outlet />
    </ProLayout>
  );
};

export default AppLayout;
