import { Layout, Spin, Steps, Toast } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
import { JWT } from "../../constants";
import { getEmptyUser, useGlobalContext } from "../../context";
import AdvanceForm from "./components/advance-form";
import BaseForm from "./components/base-form";
import Confirm from "./components/confirm";
import FilterForm from "./components/filter-form";
import TrafficForm from "./components/traffic-form";
import { FormContent, getEmptyFormContent, UpdateTaskContext } from "./context";

// type _TaskContent = {
//   id: undefined;
//   name: undefined;
//   description: undefined;
//   owner: { id: -1; login: ""; avatar_url: ""; email: "" };
//   is_running: undefined;
//   traffic_config: { device: undefined; port: undefined; addr: undefined };
//   filter_config: { http_path_regex_filter: undefined };
//   advance_config: {
//     is_recursion_diff: undefined;
//     is_ignore_array_sequence: undefined;
//   };
// };

// UpdateTask 更新任务表单，copy from addTask
// Please原谅我的shit mountain, 要毕业了必不得已。
const UpdateTask = () => {
  const { id } = useParams();
  const { setUser } = useGlobalContext();
  const [formdata, setFormData] = useState<FormContent>(getEmptyFormContent());
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { Sider, Content } = Layout;

  const renderStep = () => {
    switch (step) {
      case 0:
        return <BaseForm />;
      case 1:
        return <TrafficForm />;
      case 2:
        return <FilterForm />;
      case 3:
        return <AdvanceForm />;
      case 4:
        return <Confirm />;
    }
  };

  const getTaskDetail = async () => {
    await new Promise((r) => setTimeout(r, 2000));
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
          // todo: 加个页面出错啦
        } else {
          console.log(data.task);
          setFormData(data.task);
        }
      }
    } catch (err) {
      console.log(err);
      console.log("jwt maybe invalid, clear it...");
      localStorage.removeItem(JWT);
      setUser(getEmptyUser());
      Toast.error({ content: "当前会话已过期，请重新登录。", duration: 3 });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getTaskDetail();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Spin tip="加载任务配置中...">
          <div style={{ minHeight: "100vh" }}></div>
        </Spin>
      </div>
    );
  }

  return (
    <div>
      <Layout
        style={{
          margin: "5% 10%",
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
        }}
      >
        <div
          style={{
            // border: "1px solid var(--semi-color-border)",
            padding: "10px 20px",
          }}
        >
          <Sider>
            <Steps direction="vertical" type="basic" current={step}>
              <Steps.Step
                title="任务信息"
                description="任务的基本信息"
                onClick={() => {
                  setStep(0);
                }}
              />
              <Steps.Step
                title="流量配置"
                description="基准服务与被测服务信息"
                onClick={() => {
                  setStep(1);
                }}
              />
              <Steps.Step
                title="过滤配置"
                description="自定义过滤所回放的流量"
                onClick={() => {
                  setStep(2);
                }}
              />
              <Steps.Step
                title="高级配置"
                description="Diff配置"
                onClick={() => {
                  setStep(3);
                }}
              />
            </Steps>
          </Sider>
        </div>

        <div
          style={{
            // border: "1px solid var(--semi-color-border)",
            padding: "0px 20px",
            width: 600,
          }}
        >
          <Content>
            <UpdateTaskContext.Provider
              value={{ data: formdata, step, setStep }}
            >
              {renderStep()}
            </UpdateTaskContext.Provider>
          </Content>
        </div>
      </Layout>
    </div>
  );
};

export default UpdateTask;
