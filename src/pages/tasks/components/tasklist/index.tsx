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
  Toast,
  Progress,
} from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../api";
import { JWT } from "../../../../constants";
import { getEmptyUser, useGlobalContext } from "../../../../context";

const TaskList = () => {
  const { Header, Content } = Layout;
  const { Title } = Typography;
  const [tasks, setTasks] = useState<any[]>([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const navigate = useNavigate();
  const { setUser } = useGlobalContext();

  const getTaskList = async () => {
    try {
      const jwt = localStorage.getItem(JWT);
      if (jwt) {
        const { data } = await API.get("/api/v1/tasks", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        if (data.err) {
          Toast.error(data.err);
        } else {
          setTasks(data.tasks);
        }
      }
    } catch (err) {
      console.log(err);
      console.log("jwt maybe invalid, clear it...");
      localStorage.removeItem(JWT);
      setUser(getEmptyUser());
    }
    setIsListLoading(false);
  };

  useEffect(() => {
    getTaskList();
  }, []);

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
            dataSource={tasks}
            renderItem={(item) => (
              <List.Item
                style={{
                  border: "2px solid var(--semi-color-border)",
                  backgroundColor: "var(--semi-color-bg-2)",
                  borderRadius: "3px",
                  padding: "20px 0px 0px 20px",
                  margin: "0px 0px 10px 0px",
                }}
              >
                <div>
                  <Title heading={6}>
                    {item.name.substring(0, 10)}
                    {item.name.length > 10 && "..."}
                  </Title>

                  <Space style={{ marginTop: "4px" }}>
                    <Avatar
                      size="extra-extra-small"
                      src={item.owner.avatar_url}
                    />
                    <span>
                      {item.owner.login.substring(0, 20)}
                      {item.owner.login.length > 20 && "..."}
                    </span>
                  </Space>

                  <div
                    style={{
                      margin: "12px 0",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "end",
                    }}
                  >
                    <Descriptions align="left" size="small" row>
                      <Descriptions.Item itemKey="请求成功率">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Progress
                            percent={75}
                            type="circle"
                            size="small"
                            style={{ margin: "10px" }}
                          />
                          <p>75/100</p>
                        </div>
                      </Descriptions.Item>
                    </Descriptions>

                    <ButtonGroup theme="borderless" style={{ marginTop: 8 }}>
                      <Button
                        onClick={() => {
                          navigate(`/tasks/${item.id}/update`, {
                            replace: true,
                          });
                        }}
                      >
                        配置
                      </Button>
                      <Button
                        onClick={() => {
                          navigate(`/tasks/${item.id}`, { replace: true });
                        }}
                      >
                        进入
                      </Button>
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
