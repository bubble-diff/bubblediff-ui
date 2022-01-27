// TaskTable Diff任务管理组件
// 使用AntD - Pro Table实现

import React, { useState } from "react";
import { Button, Badge, Tooltip } from "antd";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Link } from "react-router-dom";
import { PageContainer } from "@ant-design/pro-layout";

type TableListItem = {
  key: number;
  name: string;
  baseSvr: string;
  testSvr: string;
  creator: string;
  createdAt: number;
};

const tableListDataSource: TableListItem[] = [];

const creators = ["peanutzhen", "药水哥", "峰哥亡命天涯", "草泥马"];

for (let i = 0; i < 100; i += 1) {
  tableListDataSource.push({
    key: i,
    name: "Diff Task Name",
    baseSvr: "127.0.0.1:8080",
    testSvr: "127.0.0.1:9999",
    createdAt: Date.now() - Math.floor(Math.random() * 2000),
    creator: creators[Math.floor(Math.random() * creators.length)],
  });
}

const columns: ProColumns<TableListItem>[] = [
  {
    title: "任务名称",
    dataIndex: "name",
    // render: (_) => <a>{_}</a>,
  },
  {
    title: "基准服务",
    dataIndex: "baseSvr",
    width: 100,
  },
  {
    title: "被测服务",
    dataIndex: "testSvr",
    width: 100,
  },
  {
    title: "创建者",
    dataIndex: "creator",
    width: 100,
    // valueEnum: {
    //   all: { text: "全部" },
    //   付小小: { text: "付小小" },
    //   曲丽丽: { text: "曲丽丽" },
    //   林东东: { text: "林东东" },
    //   陈帅帅: { text: "陈帅帅" },
    //   兼某某: { text: "兼某某" },
    // },
  },
  // {
  //   title: "状态",
  //   dataIndex: "status",
  //   initialValue: "all",
  //   filters: true,
  //   onFilter: true,
  //   valueEnum: {
  //     all: { text: "全部", status: "Default" },
  //     close: { text: "待发布", status: "Default" },
  //     running: { text: "发布中", status: "Processing" },
  //     online: { text: "发布成功", status: "Success" },
  //     error: { text: "发布失败", status: "Error" },
  //   },
  // },
  // {
  //   title: "容器数量",
  //   dataIndex: "containers",
  //   align: "right",
  //   sorter: (a, b) => a.containers - b.containers,
  // },
  {
    title: (
      <>
        创建时间
        <Tooltip placement="top" title="这是一段描述">
          <QuestionCircleOutlined style={{ marginLeft: 4 }} />
        </Tooltip>
      </>
    ),
    width: 140,
    key: "since",
    dataIndex: "createdAt",
    valueType: "date",
    sorter: (a, b) => a.createdAt - b.createdAt,
  },
  {
    title: "操作",
    key: "option",
    width: 120,
    valueType: "option",
    render: (_, record) => [
      <a>配置</a>,
      <a>删除</a>,
      // record.status === "close" && <a key="link">发布</a>,
      // (record.status === "running" || record.status === "online") && (
      //   <a key="warn">停用</a>
      // ),
      // record.status === "error" && <a key="republish">重新发布</a>,
      // <a
      //   key="republish"
      //   style={
      //     record.status === "running"
      //       ? {
      //           color: "rgba(0,0,0,.25)",
      //           cursor: "not-allowed",
      //         }
      //       : {}
      //   }
      // >
      //   监控
      // </a>,
    ],
  },
];

// 渲染任务数tag
const renderBadge = (count: number, active = false) => {
  return (
    <Badge
      count={count}
      style={{
        marginTop: -2,
        marginLeft: 4,
        color: active ? "#1890FF" : "#999",
        backgroundColor: active ? "#E6F7FF" : "#eee",
      }}
    />
  );
};

const TaskTable = () => {
  const [activekey, setActiveKey] = useState<React.Key>("all_task");
  return (
    <PageContainer>
      <ProTable<TableListItem>
        columns={columns}
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter);
          return Promise.resolve({
            data: tableListDataSource,
            success: true,
          });
        }}
        toolbar={{
          menu: {
            type: "tab",
            activeKey: activekey,
            items: [
              {
                key: "tab1",
                label: (
                  <span>所有任务{renderBadge(99, activekey === "tab1")}</span>
                ),
              },
              {
                key: "tab2",
                label: (
                  <span>我的任务{renderBadge(30, activekey === "tab2")}</span>
                ),
              },
              {
                key: "tab3",
                label: (
                  <span>收藏任务{renderBadge(2, activekey === "tab3")}</span>
                ),
              },
            ],
            onChange: (key) => {
              setActiveKey(key as string);
            },
          },
          actions: [
            <Link to="add">
              <Button icon={<PlusOutlined />} key="primary" type="primary">
                新建任务
              </Button>
            </Link>,
          ],
        }}
        rowKey="key"
        pagination={{
          showQuickJumper: true,
        }}
        search={false}
        dateFormatter="string" // 日期格式化
        options={false} // 关闭刷新等table设置
      />
    </PageContainer>
  );
};

export default TaskTable;
