import { Button } from "@douyinfe/semi-ui";
import { Typography } from "@douyinfe/semi-ui";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const { Paragraph, Title } = Typography;
  const navigate = useNavigate();
  const onClick = () => {
    navigate("/tasks/new", { replace: true });
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
