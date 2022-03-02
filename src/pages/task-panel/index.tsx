import { IconSearch } from "@douyinfe/semi-icons";
import {
  Avatar,
  Button,
  Descriptions,
  Input,
  Space,
  Table,
  Tag,
  Typography,
} from "@douyinfe/semi-ui";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const TaskPanel = () => {
  const { Text } = Typography;
  const { id } = useParams();

  useEffect(() => {}, []);

  const columns = [
    {
      title: "record_id",
      dataIndex: "record_id",
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

  const tableData = [
    {
      key: "1",
      record_id: 1,
      path: "/userinfo",
      diffRate: "0%",
    },
    {
      key: "2",
      record_id: 2,
      path: "/userinfo",
      diffRate: "0%",
    },
    {
      key: "3",
      record_id: 3,
      path: "/userinfo",
      diffRate: "0%",
    },
  ];

  const data = [
    { key: "任务名称", value: <p>这是任务{id}的看板 todo:超长任务名省略</p> },
    {
      key: "负责人",
      value: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar size="extra-small" style={{ marginRight: "4px" }}>
            U
          </Avatar>
          <Text type="tertiary">peanutzhen</Text>
        </div>
      ),
    },
    { key: "基准服务地址", value: "192.168.0.1:1111" },
    { key: "被测服务地址", value: "192.168.0.1:1112" },
    { key: "diff一致率", value: "100%" },
    { key: "任务状态", value: <Tag color="blue">running</Tag> },
  ];

  return (
    <div
      style={{
        margin: "40px 10%",
        border: "2px solid var(--semi-color-border)",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* 任务描述 */}
      <Descriptions
        data={data}
        row
        style={{
          boxShadow: "var(--semi-shadow-elevated)",
          backgroundColor: "var(--semi-color-bg-2)",
          borderRadius: "4px",
          padding: "10px",
          margin: "20px",
        }}
      />
      {/* 配置描述 */}
      <div
        style={{
          display: "flex",
          alignContent: "flex-start",
          alignItems: "center",
          border: "2px solid var(--semi-color-border)",
          width: "100%",
        }}
      >
        <Descriptions
          data={data}
          style={{
            boxShadow: "var(--semi-shadow-elevated)",
            backgroundColor: "var(--semi-color-bg-2)",
            borderRadius: "4px",
            padding: "10px",
            margin: "20px",
          }}
        />
        <Descriptions
          data={data}
          style={{
            boxShadow: "var(--semi-shadow-elevated)",
            backgroundColor: "var(--semi-color-bg-2)",
            borderRadius: "4px",
            padding: "10px",
            margin: "20px",
          }}
        />
      </div>
      {/* record表 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "90%",
          // border: "2px solid var(--semi-color-border)",
        }}
      >
        <Input
          showClear
          suffix={<IconSearch />}
          placeholder={"请输入路径"}
          onEnterPress={() => {
            console.log("todo")
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
          <Button>开始任务</Button>
          <Button type="danger">清除所有记录</Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        // loading={true}
        style={{
          boxShadow: "var(--semi-shadow-elevated)",
          borderRadius: "4px",
          width: "90%",
          margin: "10px",
        }}
      />
    </div>
  );
};

export default TaskPanel;
