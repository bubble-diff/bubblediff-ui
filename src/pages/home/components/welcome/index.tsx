import { Button } from "@douyinfe/semi-ui";
import { Typography } from "@douyinfe/semi-ui";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const { Paragraph, Title } = Typography;
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "rgba(var(--semi-grey-0), 1)",
        textAlign: "center",
        padding: "3% 0",
      }}
    >
      <Title heading={1}>BubbleDiff</Title>
      <Paragraph type="tertiary" spacing="extended">
        BubbleDiff 是一个用于捕获和在测试环境中重放实时流量的工具集合。
      </Paragraph>
      <Button
        theme="solid"
        type="primary"
        size="large"
        style={{
          marginTop: "20px",
          borderRadius: "var(--semi-border-radius-full)",
        }}
        onClick={() => {
          navigate("/tasks/new", { replace: true });
        }}
      >
        创建Diff任务
      </Button>
    </div>
  );
};

export default Welcome;
