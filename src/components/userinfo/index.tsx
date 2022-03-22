import { IconArrowRight } from "@douyinfe/semi-icons";
import { Avatar, Card, Dropdown, Toast } from "@douyinfe/semi-ui";
import { GITHUB_OAUTH, JWT } from "../../constants";
import { getEmptyUser, useGlobalContext } from "../../context";

const UserInfo = () => {
  const { Meta } = Card;
  const { user, setUser } = useGlobalContext();

  const Login = () => {
    window.location.href = GITHUB_OAUTH;
  };

  const Logout = () => {
    console.log("remove jwt and user...");
    setUser(getEmptyUser());
    localStorage.removeItem(JWT);
    Toast.success({ content: "注销成功", duration: 3 });
  };

  if (user.id > 0) {
    // 已经登录
    return (
      <Dropdown
        trigger={"click"}
        position={"bottomLeft"}
        render={
          <Dropdown.Menu>
            <Card style={{ maxWidth: 340, borderRadius: "0px" }}>
              <Meta
                title={user.login}
                description={user.email}
                avatar={<Avatar size="small" src={user.avatar_url} />}
              />
            </Card>
            <Dropdown.Item icon={<IconArrowRight />} onClick={Logout}>
              退出
            </Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <Avatar size="small" src={user.avatar_url} />
      </Dropdown>
    );
  }

  // 还没登录
  return (
    <Dropdown
      trigger={"click"}
      position={"bottomLeft"}
      render={
        <Dropdown.Menu>
          <Dropdown.Item icon={<IconArrowRight />} onClick={Login}>
            立即登录
          </Dropdown.Item>
        </Dropdown.Menu>
      }
    >
      <Avatar size="small">Login</Avatar>
    </Dropdown>
  );
};

export default UserInfo;
