import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MsgType, useGlobalContext } from "../../context";

// GithubCallback 当组件mounted时，尝试获取jwt。
// 获取结束后，返回至首页。首页应该显示登录成功/失败的toast提示。
const GithubCallback = () => {
  const [searchParams] = useSearchParams();
  const { setMessage } = useGlobalContext();
  const navigate = useNavigate();

  const getJwt = async () => {
    // jwt存在时，立即返回。
    // jwt仅当用户主动退出，或调服务api返回无效jwt时，才删除jwt。
    // 删除jwt时，user信息也应移除。
    if (localStorage.getItem("jwt")) {
      return;
    }

    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const desc = searchParams.get("description");
    const api = process.env.REACT_APP_AUTH_API!;
    // 检查参数是否合法
    if (!code || error) {
      console.log(error);
      console.log(desc);
      setMessage({ msgType: MsgType.Error, msg: `登录失败！${desc}` });
    } else {
      try {
        const resp = await axios.get(`${api}?code=${code}`, {
          timeout: 5000,
        });
        localStorage.setItem("jwt", resp.data.token);
      } catch (err) {
        // todo: 处理不同类型的error
        console.log(err);
      } finally {
        navigate("/", { replace: true });
      }
    }
  };

  useEffect(() => {
    getJwt();
  }, []);

  return (
    <div>
      <p>get jwt...</p>
      <br />
      <p>TODO: Make this page beautiful.</p>
    </div>
  );
};

export default GithubCallback;
