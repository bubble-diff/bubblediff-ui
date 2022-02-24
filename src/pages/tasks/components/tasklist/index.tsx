import { IconSearch } from "@douyinfe/semi-icons";
import {
  List,
  Descriptions,
  ButtonGroup,
  Button,
  Layout,
  Nav,
  RadioGroup,
  Radio,
  Input,
  Space,
  Avatar,
  Typography,
} from "@douyinfe/semi-ui";

const TaskList = () => {
  const { Header, Content } = Layout;
  const { Title } = Typography;

  const mockData = [
    {
      taskname: "这是一个很长的任务名aaaaa",
      username: "peanutzhen",
      total: "1480",
      success: "98%",
      diffs: "2%",
    },
    {
      taskname: "抖音测试",
      username: "peanutzhen",
      total: "1480",
      success: "98%",
      diffs: "2%",
    },
    {
      taskname: "抖音测试",
      username: "peanutzhen",
      total: "1480",
      success: "98%",
      diffs: "2%",
    },
    {
      taskname: "抖音测试",
      username: "peanutzhen",
      total: "1480",
      success: "98%",
      diffs: "2%",
    },
    {
      taskname: "抖音测试",
      username: "peanutzhen",
      total: "1480",
      success: "98%",
      diffs: "2%",
    },
    {
      taskname: "抖音测试",
      username: "peanutzhen",
      total: "1480",
      success: "98%",
      diffs: "2%",
    },
    {
      taskname: "抖音测试",
      username: "peanutzhensasdajsdaksjdahskjdashk",
      total: "100000",
      success: "98%",
      diffs: "2%",
    },
  ];

  const listItemStyle = {
    border: "2px solid var(--semi-color-border)",
    backgroundColor: "var(--semi-color-bg-2)",
    borderRadius: "3px",
    padding: "20px 0px 0px 20px",
    margin: "0px 0px 10px 0px",
  };

  return (
    <div>
      <Layout style={{ padding: "0 10%" }}>
        <Header
          style={{
            backgroundColor: "var(--semi-color-bg-1)",
            padding: "10px 0px 12px",
          }}
        >
          <div>
            <Nav mode="horizontal">
              <Nav.Header text="任务列表" />

              <RadioGroup
                type="button"
                buttonSize="middle"
                defaultValue={1}
                style={{ marginRight: "12px" }}
              >
                <Radio value={1}>全部</Radio>
                <Radio value={2}>我的任务</Radio>
              </RadioGroup>

              <Nav.Footer>
                <Input
                  placeholder={"搜索任务"}
                  suffix={<IconSearch />}
                  showClear
                ></Input>
              </Nav.Footer>
            </Nav>
          </div>
        </Header>
        <Content style={{ minHeight: "50vh" }}>
          <List
            grid={{ gutter: 12, span: 6 }}
            dataSource={mockData}
            renderItem={(item) => (
              <List.Item style={listItemStyle}>
                <div>
                  <Title heading={6}>
                    {item.taskname.substring(0, 10)}
                    {item.taskname.length > 10 && "..."}
                  </Title>

                  <Space style={{ marginTop: "4px" }}>
                    <Avatar size="extra-extra-small">U</Avatar>
                    <span>
                      {item.username.substring(0, 20)}
                      {item.username.length > 20 && "..."}
                    </span>
                  </Space>

                  <Descriptions align="left" size="small" row>
                    <Descriptions.Item itemKey="请求总数">
                      {item.total}
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="请求成功率">
                      {item.success}
                    </Descriptions.Item>
                    <Descriptions.Item itemKey="Diffs率">
                      {item.diffs}
                    </Descriptions.Item>
                  </Descriptions>
                  <div
                    style={{
                      margin: "12px 0",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <ButtonGroup theme="borderless" style={{ marginTop: 8 }}>
                      <Button>配置</Button>
                      <Button>管理面板</Button>
                    </ButtonGroup>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </div>
  );
};

export default TaskList;
