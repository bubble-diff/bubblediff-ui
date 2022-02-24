import { IconArrowRight } from "@douyinfe/semi-icons";
import { Avatar, Card, Dropdown } from "@douyinfe/semi-ui";
import { getEmptyUser, useGlobalContext } from "../../context";

const UserInfo = () => {
  const { Meta } = Card;
  const { user, setUser } = useGlobalContext();
  const Logout = () => {
    console.log("remove jwt and user...");
    setUser(getEmptyUser());
    localStorage.removeItem("jwt");
    window.location.href = "/";
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
          <Dropdown.Item
            icon={<IconArrowRight />}
            onClick={() => {
              window.location.href = process.env.REACT_APP_LOGIN_API!;
            }}
          >
            立即登录
          </Dropdown.Item>
        </Dropdown.Menu>
      }
    >
      <Avatar size="small">未登录</Avatar>
    </Dropdown>
  );
};

export default UserInfo;
