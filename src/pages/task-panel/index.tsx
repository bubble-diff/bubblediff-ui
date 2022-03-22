import { IconSearch } from "@douyinfe/semi-icons";
import {
  Avatar,
  Button,
  Descriptions,
  Input,
  List,
  Modal,
  Skeleton,
  Space,
  Table,
  Tag,
  Toast,
  Typography,
} from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";
import { JWT } from "../../constants";
import { getEmptyUser, useGlobalContext } from "../../context";

const SwitchTag = (props: { on: boolean | undefined }) => {
  if (props.on) return <Tag color="green"> On </Tag>;
  else return <Tag color="red"> Off </Tag>;
};

const TaskPanel = () => {
  const { Text } = Typography;
  const { id } = useParams();
  const navigate = useNavigate();
  const [isTaskDetailLoading, setIsTaskDetailLoading] = useState(true);
  const [isTableDataLoading, setIsTableDataLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const { setUser } = useGlobalContext();
  const [taskDetail, setTaskDetail] = useState({
    name: undefined,
    description: undefined,
    owner: getEmptyUser(),
    is_running: undefined,
    traffic_config: { device: undefined, port: undefined, addr: undefined },
    filter_config: { http_path_regex_filter: undefined },
    advance_config: {
      is_recursion_diff: undefined,
      is_ignore_array_sequence: undefined,
    },
  });

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

  useEffect(() => {
    getTaskDetail();
  }, []);

  const columns = [
    {
      title: "record_id",
      dataIndex: "record_id",
      width: 100,
    },
    {
      title: "路径",
      dataIndex: "path",
    },
    {
      title: "diff率",
      dataIndex: "diffRate",
    },
  ];

  const tableData = [];
  for (let i = 1; i <= 100; i++) {
    tableData.push({
      key: `${i}`,
      record_id: i,
      path: "/userinfo",
      diffRate: "0%",
    });
  }

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
        margin: "40px 10%",
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
            <Button theme="solid">开始任务</Button>
            <Button>刷新记录</Button>
            <Button type="danger">清除所有记录</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={tableData}
          // pagination={false}
          // loading={true}
          style={{
            boxShadow: "var(--semi-shadow-elevated)",
            borderRadius: "4px",
            // width: "90%",
            // margin: "10px",
          }}
        />
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
              onClick={() => {
                setIsDeleteModalVisible(false);
              }}
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
    </div>
  );
};

export default TaskPanel;
