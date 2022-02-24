import {
  Button,
  Descriptions,
  List,
  Space,
  Typography,
} from "@douyinfe/semi-ui";
import axios from "axios";
import { useAddTaskContext } from "../../context";
import SwitchTag from "./switch_tag";

const Confirm = () => {
  const { Title, Text } = Typography;
  const { data, step, setStep } = useAddTaskContext();
  const preview = [
    { key: "任务名", value: data.name },
    { key: "任务描述", value: data.description },
    { key: "负责人", value: data.owner.login },
    { key: "基准服务监听网卡", value: data.traffic_config.device },
    { key: "基准服务监听端口", value: data.traffic_config.port },
    { key: "被测服务地址", value: data.traffic_config.addr },
    {
      key: "Http路径过滤规则",
      value: (
        <List
          size="small"
          bordered
          dataSource={data.filter_config.http_path_regex_filter}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      ),
    },
    {
      key: "递归Diff模式",
      value: <SwitchTag on={data.advance_config.is_recursion_diff!} />,
    },
    {
      key: "忽略数组顺序模式",
      value: <SwitchTag on={data.advance_config.is_ignore_array_sequence!} />,
    },
  ];

  return (
    <div>
      <Title heading={3}>预览</Title>
      <Text type="tertiary">确认最终提交信息</Text>
      <Descriptions
        data={preview}
        align={"left"}
        style={{
          backgroundColor: "var(--semi-color-bg-2)",
          padding: "10px",
          margin: "10px",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Space>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setStep(step - 1);
            }}
          >
            上一步
          </Button>
          <Button
            theme="solid"
            type="primary"
            onClick={async (e) => {
              e.preventDefault();
              console.log(JSON.stringify(data));
              try {
                // todo: 把axios封装起来成为一个个服务
                const jwt = localStorage.getItem("jwt");
                const api = process.env.REACT_APP_ADDTASK_API!;
                const resp = await axios.post(`${api}`, data, {
                  timeout: 5000,
                  headers: { Authorization: `Bearer ${jwt}` },
                });
                console.log(resp);
                // todo: 返回提示，跳转至其他页面
              } catch (err) {
                console.log(err);
                console.log("jwt maybe invalid, clear it...");
                localStorage.removeItem("jwt");
              }
            }}
          >
            提交
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Confirm;
