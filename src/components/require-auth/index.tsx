import {
  IllustrationNoAccess,
  IllustrationNoAccessDark,
} from "@douyinfe/semi-illustrations";
import { Button, Empty } from "@douyinfe/semi-ui";
import { GITHUB_OAUTH } from "../../constants";
import { useGlobalContext } from "../../context";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useGlobalContext();
  if (user.id < 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          // border: "1px solid var(--semi-color-border)",
          margin: "10%",
        }}
      >
        <Empty
          image={<IllustrationNoAccess style={{ width: 150, height: 150 }} />}
          darkModeImage={
            <IllustrationNoAccessDark style={{ width: 150, height: 150 }} />
          }
          title={"没有权限"}
          description={"未登录用户无权限访问"}
        >
          <div>
            <Button
              style={{ padding: "6px 24px" }}
              theme="solid"
              type="primary"
              onClick={() => {
                window.location.href = GITHUB_OAUTH;
              }}
            >
              立即登录
            </Button>
          </div>
        </Empty>
      </div>
    );
  }

  return children;
};

export default RequireAuth;
