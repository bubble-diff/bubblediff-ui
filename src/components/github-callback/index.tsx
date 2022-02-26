import { Spin, Toast } from "@douyinfe/semi-ui";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../api";
import { JWT } from "../../constants";

// GithubCallback 当组件mounted时，尝试获取jwt。
// 获取结束后，返回至首页。首页应该显示登录成功/失败的toast提示。
const GithubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const getJwt = async () => {
    // jwt存在时，立即返回。
    // jwt仅当用户主动退出，或调服务api返回无效jwt时，才删除jwt。
    // 删除jwt时，user信息也应移除。
    if (localStorage.getItem(JWT)) {
      return;
    }

    const code = searchParams.get("code") || "";
    const error = searchParams.get("error") || "";
    const desc = searchParams.get("description") || "";

    if (error) {
      Toast.error({
        content: `${error}`,
        duration: 3,
      });
      if (desc) {
        Toast.error({
          content: `${desc}`,
          duration: 3,
        });
      }
    } else if (!code) {
      Toast.error({
        content: "授权码不存在",
        duration: 3,
      });
    } else {
      try {
        const { data } = await API.get("/login", { params: { code: code } });
        localStorage.setItem(JWT, data.token);
        Toast.success({
          content: "登录成功",
          duration: 3,
        });
      } catch (err: any) {
        Toast.error({
          content: `${err}`,
          duration: 3,
        });
        if (err?.response?.status === 401) {
          Toast.error({
            content: "无效的授权码",
            duration: 3,
          });
        } else {
          Toast.warning({
            content: "请检查后端服务是否启动",
            duration: 3,
          });
        }
      }
    }
    // fixme: 这里只能等待一下Toast才能渲染
    await new Promise((r) => setTimeout(r, 100));
    navigate("/", { replace: true });
  };

  useEffect(() => {
    getJwt();
  }, []);

  return (
    <div>
      <Spin tip="登录中...">
        <div style={{ minHeight: "100vh" }}></div>
      </Spin>
    </div>
  );
};

export default GithubCallback;
