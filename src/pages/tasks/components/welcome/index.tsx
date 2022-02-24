import { Button } from "@douyinfe/semi-ui";
import { Typography } from "@douyinfe/semi-ui";
import { SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../../context";

const Welcome = () => {
  const { Paragraph, Title } = Typography;
  const { user } = useGlobalContext();
  const navigate = useNavigate();
  const onClick = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user.id > 0) {
      // 已登录
      navigate("/tasks/add", { replace: true });
      return;
    }
    window.location.href = process.env.REACT_APP_LOGIN_API!;
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(var(--semi-grey-0), 1)",
        textAlign: "center",
        padding: "3% 0",
      }}
    >
      <Title heading={1}>任务列表</Title>
      <Paragraph type="tertiary" spacing="extended">
        在这里，可以创建你的diff任务。
      </Paragraph>
      <Button
        theme="solid"
        type="primary"
        size="large"
        style={{
          marginTop: "20px",
          borderRadius: "var(--semi-border-radius-full)",
        }}
        onClick={onClick}
      >
        创建Diff任务
      </Button>
    </div>
  );
};

export default Welcome;
