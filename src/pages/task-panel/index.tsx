import { IconCopy, IconSearch } from "@douyinfe/semi-icons";
import {
  Avatar,
  Badge,
  Button,
  Collapse,
  Descriptions,
  Input,
  List,
  Modal,
  Skeleton,
  Space,
  Spin,
  Table,
  Tag,
  Toast,
  Typography,
} from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/esm/styles/hljs";
import API from "../../api";
import { JWT } from "../../constants";
import { getEmptyUser, useGlobalContext } from "../../context";

const SwitchTag = (props: { on: boolean | undefined }) => {
  if (props.on) return <Tag color="green"> On </Tag>;
  else return <Tag color="red"> Off </Tag>;
};

const TaskPanel = () => {
  const { Text } = Typography;
  const { Column } = Table;
  const { id } = useParams();
  const navigate = useNavigate();
  // 启停diff按钮加载状态
  const [isDiffBtnLoading, setIsDiffBtnLoading] = useState(false);
  // 删除按钮加载状态
  const [isDelBtnLoading, setIsDelBtnLoading] = useState(false);
  // 加载任务详情状态
  const [isTaskDetailLoading, setIsTaskDetailLoading] = useState(true);
  // 加载表格数据状态
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  // 表格数据
  const [tableData, setTableData] = useState<any[]>([]);
  // 配置详情弹窗可视状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 删除警告可视状态
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  // 记录详情弹窗可视状态
  const [isRecordModalVisible, setIsRecordModalVisible] = useState(false);
  // 记录modal加载状态
  const [isRecordModalLoading, setIsRecordModalLoading] = useState(false);
  // 记录详情
  const [record, setRecord] = useState({
    cos_key: "",
    old_req: "",
    old_resp: "",
    new_resp: "",
    diff: "",
    diff_rate: "",
  });
  const { setUser } = useGlobalContext();
  // 任务信息
  const [taskDetail, setTaskDetail] = useState({
    name: undefined,
    description: undefined,
    owner: getEmptyUser(),
    is_running: false,
    traffic_config: { device: undefined, port: undefined, addr: undefined },
    filter_config: { http_path_regex_filter: undefined },
    advance_config: {
      is_recursion_diff: undefined,
      is_ignore_array_sequence: undefined,
    },
  });

  // 启停diff
  const startOrStopDiff = async () => {
    setIsDiffBtnLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    try {
      const jwt = localStorage.getItem(JWT);
      if (jwt) {
        if (taskDetail.is_running) {
          // 停止diff
          const { data } = await API.get(`/api/v1/task/${id}/stop`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          if (data.err) {
            console.log(data.err);
            Toast.error("停止失败");
          } else {
            taskDetail.is_running = false;
            Toast.success("停止成功");
          }
        } else {
          // 开始diff
          const { data } = await API.get(`/api/v1/task/${id}/start`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          if (data.err) {
            console.log(data.err);
            Toast.error("启动失败");
          } else {
            taskDetail.is_running = true;
            Toast.success("启动成功");
          }
        }
      }
    } catch (err) {
      console.log(err);
      console.log("jwt maybe invalid, clear it...");
      localStorage.removeItem(JWT);
      setUser(getEmptyUser());
      Toast.error({ content: "当前会话已过期，请重新登录。", duration: 3 });
    }

    setIsDiffBtnLoading(false);
  };

  // 删除任务动作
  const deleteTask = async () => {
    setIsDelBtnLoading(true);

    try {
      const jwt = localStorage.getItem(JWT);
      if (jwt) {
        const { data } = await API.delete(`/api/v1/task/${id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        if (data.err) {
          console.log(data.err);
          Toast.error("删除失败");
        } else {
          Toast.success("删除成功");
        }
      }
    } catch (err) {
      console.log(err);
      console.log("jwt maybe invalid, clear it...");
      localStorage.removeItem(JWT);
      setUser(getEmptyUser());
      Toast.error({ content: "当前会话已过期，请重新登录。", duration: 3 });
    }

    setIsDelBtnLoading(false);
    setIsDeleteModalVisible(false);
    navigate("/tasks", { replace: true });
  };

  // 获取任务信息动作
  const getTaskDetail = async () => {
    try {
      const jwt = localStorage.getItem(JWT);
      if (jwt) {
        const { data } = await API.get(`/api/v1/task/${id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        if (data.err) {
          console.log(data.err);
          Toast.error(data.err);
        } else {
          setTaskDetail(data.task);
        }
      }
    } catch (err) {
      console.log(err);
      console.log("jwt maybe invalid, clear it...");
      localStorage.removeItem(JWT);
      setUser(getEmptyUser());
      Toast.error({ content: "当前会话已过期，请重新登录。", duration: 3 });
    }
    setIsTaskDetailLoading(false);
  };

  const getTaskRecordsMeta = async () => {
    setIsTableDataLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const jwt = localStorage.getItem(JWT);
      if (jwt) {
        const { data } = await API.get(`/api/v1/records/${id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        if (data.err) {
          console.log(data.err);
          Toast.error("获取record失败！");
        } else {
          setTableData(data.metas);
        }
      }
    } catch (err) {
      console.log(err);
      console.log("jwt maybe invalid, clear it...");
      localStorage.removeItem(JWT);
      setUser(getEmptyUser());
      Toast.error({ content: "当前会话已过期，请重新登录。", duration: 3 });
    }
    setIsTableDataLoading(false);
  };

  const getRecord = async () => {
    setIsRecordModalLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    try {
      const jwt = localStorage.getItem(JWT);
      if (jwt) {
        const { data } = await API.get(`/api/v1/records/${record.cos_key}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        if (data.err) {
          console.log(data.err);
          Toast.error("加载详情失败");
        } else {
          record.old_req = data.record.old_req;
          record.old_resp = data.record.old_resp;
          record.new_resp = data.record.new_resp;
          record.diff = data.record.diff;
          record.diff_rate = data.record.diff_rate;
        }
      }
    } catch (err) {
      console.log(err);
      console.log("jwt maybe invalid, clear it...");
      localStorage.removeItem(JWT);
      setUser(getEmptyUser());
      Toast.error({ content: "当前会话已过期，请重新登录。", duration: 3 });
    }
    setIsRecordModalLoading(false);
  };

  useEffect(() => {
    getTaskDetail();
  }, []);

  useEffect(() => {
    getTaskRecordsMeta();
  }, []);

  useEffect(() => {
    if (isRecordModalVisible) {
      getRecord();
    }
  }, [isRecordModalVisible]);

  // 任务概要信息数据
  const descriptionData = [
    { key: "任务名称", value: taskDetail.name },
    { key: "任务简介", value: taskDetail.description },
    {
      key: "负责人",
      value: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            size="extra-small"
            style={{ marginRight: "4px" }}
            src={taskDetail.owner.avatar_url}
          />
          <Text type="tertiary">{taskDetail.owner.login}</Text>
        </div>
      ),
    },
    { key: "基准服务地址", value: <Tag color="red">todo</Tag> },
    {
      key: "被测服务地址",
      value: <Tag color="green">{taskDetail.traffic_config.addr}</Tag>,
    },
    { key: "成功率", value: "todo" },
    {
      key: "任务状态",
      value: (
        <Tag color="blue">{taskDetail.is_running ? "running" : "stopped"}</Tag>
      ),
    },
  ];
  // 任务配置信息数据
  const modalData = [
    { key: "任务名", value: taskDetail.name },
    { key: "任务描述", value: taskDetail.description },
    { key: "负责人", value: taskDetail.owner.login },
    { key: "基准服务监听网卡", value: taskDetail.traffic_config.device },
    { key: "基准服务监听端口", value: taskDetail.traffic_config.port },
    { key: "被测服务地址", value: taskDetail.traffic_config.addr },
    {
      key: "Http路径过滤规则",
      value: (
        <List
          size="small"
          bordered
          dataSource={taskDetail.filter_config.http_path_regex_filter}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      ),
    },
    {
      key: "递归Diff模式",
      // value: taskDetail.advance_config.is_recursion_diff,
      value: <SwitchTag on={taskDetail.advance_config.is_recursion_diff} />,
    },
    {
      key: "忽略数组顺序模式",
      value: (
        <SwitchTag on={taskDetail.advance_config.is_ignore_array_sequence} />
      ),
    },
  ];

  return (
    <div
      style={{
        margin: "40px",
        // border: "2px solid var(--semi-color-border)",
        display: "flex",
        // alignItems: "center",
      }}
    >
      {/* 任务概要描述 */}
      <div style={{ paddingRight: "40px" }}>
        <Skeleton
          placeholder={<Skeleton.Paragraph />}
          loading={isTaskDetailLoading}
          active
          style={{
            paddingBottom: "10px",
          }}
        >
          <Descriptions
            data={descriptionData}
            style={{
              padding: "10px",
            }}
          />
        </Skeleton>

        <Space style={{ display: "flex", justifyContent: "end" }}>
          <Button
            onClick={() => {
              navigate(`/tasks/${id}/update`, { replace: true });
            }}
          >
            修改配置
          </Button>
          <Button
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            查看配置详情
          </Button>
          <Button
            type="danger"
            theme="solid"
            onClick={() => {
              setIsDeleteModalVisible(true);
            }}
          >
            删除任务
          </Button>
        </Space>
      </div>

      {/* record表 */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "10px",
            // border: "2px solid var(--semi-color-border)",
          }}
        >
          <Input
            showClear
            suffix={<IconSearch />}
            placeholder={"请输入路径"}
            onEnterPress={() => {
              console.log("todo");
            }}
            style={{ flex: 1 }}
          />
          <Space
            style={{
              flex: 2,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              theme="solid"
              loading={isDiffBtnLoading}
              type={taskDetail.is_running ? "danger" : "primary"}
              onClick={startOrStopDiff}
            >
              {taskDetail.is_running ? "停止Diff" : "开始Diff"}
            </Button>
            <Button
              onClick={() => {
                getTaskRecordsMeta();
              }}
            >
              刷新记录
            </Button>
            <Button type="danger">清除所有记录</Button>
          </Space>
        </div>

        <Table
          dataSource={tableData}
          // pagination={false}
          loading={isTableDataLoading}
          style={{
            boxShadow: "var(--semi-shadow-elevated)",
            borderRadius: "4px",
            // width: "90%",
            // margin: "10px",
          }}
        >
          <Column
            title=""
            width={20}
            render={(text, record, index) => {
              return <Badge count={index + 1} />;
            }}
          />
          <Column
            title="ID"
            dataIndex="cos_key"
            width={150}
            render={(text, record, index) => {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p>
                    {text.substring(0, 10)}
                    {text.length > 10 && "..."}
                  </p>

                  <IconCopy
                    size="small"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      try {
                        navigator.clipboard.writeText(text);
                        Toast.success("复制成功!");
                      } catch (err) {
                        Toast.error("复制失败!");
                      }
                    }}
                  />
                </div>
              );
            }}
          />
          <Column
            title="路径"
            dataIndex="path"
            width={200}
            render={(text, record, index) => {
              return (
                <Tag
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(text);
                      Toast.success("复制成功!");
                    } catch (err) {
                      Toast.error("复制失败!");
                    }
                  }}
                >
                  {text}
                </Tag>
              );
            }}
          />
          <Column title="差异率" dataIndex="diff_rate" width={80} />
          <Column
            title="操作"
            width={100}
            render={(text, data, index) => {
              return (
                <Button
                  size="small"
                  onClick={() => {
                    setIsRecordModalVisible(true);
                    record.cos_key = `${id}/${data.cos_key}`;
                  }}
                >
                  查看
                </Button>
              );
            }}
          />
        </Table>
      </div>

      {/* 任务配置详情弹窗 */}
      <Modal
        header={null}
        visible={isModalVisible}
        onOk={() => {
          setIsModalVisible(false);
        }}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        footer={
          <div style={{ textAlign: "center" }}>
            <Button
              type="primary"
              theme="solid"
              onClick={() => {
                setIsModalVisible(false);
              }}
              style={{
                width: 240,
                margin: "4px 50px",
              }}
            >
              了解
            </Button>
          </div>
        }
      >
        <h3 style={{ textAlign: "center", fontSize: 24, margin: 40 }}>
          任务配置详情
        </h3>
        <Descriptions
          data={modalData}
          style={{
            padding: "10px",
            margin: "10px",
          }}
        />
      </Modal>

      {/* 删除任务弹窗 */}
      <Modal
        header={null}
        visible={isDeleteModalVisible}
        onOk={() => {
          setIsDeleteModalVisible(false);
        }}
        onCancel={() => {
          setIsDeleteModalVisible(false);
        }}
        footer={
          <div style={{ textAlign: "center" }}>
            <Button
              type="danger"
              theme="solid"
              loading={isDelBtnLoading}
              onClick={deleteTask}
              style={{
                width: 240,
                margin: "4px 50px",
              }}
            >
              继续删除
            </Button>
          </div>
        }
      >
        <h3 style={{ textAlign: "center", fontSize: 24, margin: 40 }}>警告</h3>
        <p>真的要删除吗？无法恢复</p>
      </Modal>

      {/* 记录详情弹窗 */}
      <Modal
        header={null}
        visible={isRecordModalVisible}
        onOk={() => {
          setIsRecordModalVisible(false);
        }}
        onCancel={() => {
          setIsRecordModalVisible(false);
        }}
        footer={
          <div style={{ textAlign: "center" }}>
            <Button
              theme="solid"
              onClick={() => {
                setIsRecordModalVisible(false);
              }}
              style={{
                width: 240,
                margin: "4px 50px",
              }}
            >
              了解
            </Button>
          </div>
        }
      >
        <div
          style={{
            // border: "2px solid var(--semi-color-border)",
            marginTop: "30px",
          }}
        >
          {isRecordModalLoading ? (
            <Spin tip="I am loading...">
              <div style={{ minHeight: "300px" }} />
            </Spin>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Tag style={{ marginBottom: "5px" }}>{record.cos_key}</Tag>
              <Collapse>
                <Collapse.Panel header="Http请求" itemKey="1">
                  <SyntaxHighlighter
                    language="diff"
                    style={githubGist}
                    showLineNumbers={true}
                  >
                    {record.old_req}
                  </SyntaxHighlighter>
                </Collapse.Panel>

                <Collapse.Panel header="基准服务响应" itemKey="2">
                  <SyntaxHighlighter
                    language="json"
                    style={githubGist}
                    showLineNumbers={true}
                  >
                    {record.old_resp}
                  </SyntaxHighlighter>
                </Collapse.Panel>

                <Collapse.Panel header="被测服务响应" itemKey="3">
                  <SyntaxHighlighter
                    language="json"
                    style={githubGist}
                    showLineNumbers={true}
                  >
                    {record.new_resp}
                  </SyntaxHighlighter>
                </Collapse.Panel>

                <Collapse.Panel header="差异比对结果" itemKey="4">
                  <SyntaxHighlighter
                    language="diff"
                    style={githubGist}
                    showLineNumbers={true}
                  >
                    {record.diff}
                  </SyntaxHighlighter>
                </Collapse.Panel>
              </Collapse>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TaskPanel;
