import { IconCopy, IconLink, IconSearch } from "@douyinfe/semi-icons";
import {
  Avatar,
  Badge,
  Banner,
  Button,
  Collapse,
  Descriptions,
  Input,
  List,
  Modal,
  Progress,
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
import { Light } from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/esm/styles/hljs";
import API from "../../api";
import { JWT } from "../../constants";
import { getEmptyUser, useGlobalContext } from "../../context";
import diff from "react-syntax-highlighter/dist/esm/languages/hljs/diff";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import http from "react-syntax-highlighter/dist/esm/languages/hljs/http";

const SwitchTag = (props: { on: boolean | undefined }) => {
  if (props.on) return <Tag color="green"> On </Tag>;
  else return <Tag color="red"> Off </Tag>;
};

const TaskPanel = () => {
  const { Text } = Typography;
  const { Column } = Table;
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchPath, setSearchPath] = useState("");
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
    traffic_config: {
      device: undefined,
      port: undefined,
      addr: undefined,
      online_addr: undefined,
    },
    filter_config: { http_path_regex_filter: undefined },
    advance_config: {
      is_recursion_diff: undefined,
      is_ignore_array_sequence: undefined,
    },
    total_record: 0,
    success_record: 0,
    created_time: undefined,
    updated_time: undefined,
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

  const getTaskRecordsMeta = async (searchPath: string) => {
    setIsTableDataLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const jwt = localStorage.getItem(JWT);
      if (jwt) {
        const { data } = await API.get(
          `/api/v1/records/${id}?path=${searchPath}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
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
    getTaskRecordsMeta("");
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
    {
      key: "基准服务地址",
      value: (
        <div>
          {taskDetail.traffic_config.online_addr === "" ? (
            <Tag color="red">尚未部署BubbleCopy</Tag>
          ) : (
            <Tag color="green">{taskDetail.traffic_config.online_addr}</Tag>
          )}
        </div>
      ),
    },
    {
      key: "被测服务地址",
      value: <Tag color="green">{taskDetail.traffic_config.addr}</Tag>,
    },
    {
      key: "回放请求成功率",
      value: (
        <Progress
          percent={
            taskDetail.total_record === 0
              ? 0
              : (taskDetail.success_record / taskDetail.total_record) * 100
          }
          type="circle"
          showInfo
          format={(per) => per + "%"}
          style={{ margin: "10px" }}
        />
      ),
    },
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

  Light.registerLanguage("diff", diff);
  Light.registerLanguage("json", json);
  Light.registerLanguage("http", http);

  return (
    <div>
      {taskDetail.traffic_config.online_addr === "" && (
        <Banner
          type="warning"
          description={
            <div>
              <Text>检测到尚未部署BubbleCopy，</Text>
              <Text
                link={{
                  href: "https://github.com/bubble-diff/bubblecopy",
                  rel: "noopener noreferrer",
                  target: "_blank",
                }}
                icon={<IconLink />}
                underline
              >
                请前往GitHub Release下载并按照指示部署。
              </Text>
              <Button
                size="small"
                onClick={() => {
                  try {
                    const settings = {
                      taskid: id,
                      interface: taskDetail.traffic_config.device,
                      service_port: taskDetail.traffic_config.port,
                      replay_svr_addr: process.env.REACT_APP_REPLAY_ADDR!,
                    };
                    navigator.clipboard.writeText(JSON.stringify(settings));
                    Toast.success("复制成功!");
                  } catch (err) {
                    Toast.error("复制失败!");
                  }
                }}
              >
                复制settings.json内容
              </Button>
            </div>
          }
          closeIcon={null}
        />
      )}

      <div
        style={{
          margin: "80px 40px",
          // border: "2px solid var(--semi-color-border)",
          display: "flex",
          // alignItems: "center",
        }}
      >
        {/* 任务概要描述 */}
        <div style={{ paddingRight: "100px" }}>
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
              placeholder={"请输入路径，支持前缀匹配"}
              value={searchPath}
              onChange={(val, e) => {
                setSearchPath(val);
              }}
              onEnterPress={() => {
                getTaskRecordsMeta(searchPath);
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
                  setSearchPath("");
                  getTaskRecordsMeta("");
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
          <h3 style={{ textAlign: "center", fontSize: 24, margin: 40 }}>
            警告
          </h3>
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
                    <Light
                      language="http"
                      style={githubGist}
                      showLineNumbers={true}
                    >
                      {record.old_req}
                    </Light>
                  </Collapse.Panel>

                  <Collapse.Panel header="基准服务响应" itemKey="2">
                    <Light
                      language="json"
                      style={githubGist}
                      showLineNumbers={true}
                    >
                      {record.old_resp}
                    </Light>
                  </Collapse.Panel>

                  <Collapse.Panel header="被测服务响应" itemKey="3">
                    <Light
                      language="json"
                      style={githubGist}
                      showLineNumbers={true}
                    >
                      {record.new_resp}
                    </Light>
                  </Collapse.Panel>

                  <Collapse.Panel header="差异比对结果" itemKey="4">
                    <Light
                      language="diff"
                      style={githubGist}
                      showLineNumbers={true}
                    >
                      {record.diff}
                    </Light>
                  </Collapse.Panel>
                </Collapse>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TaskPanel;
