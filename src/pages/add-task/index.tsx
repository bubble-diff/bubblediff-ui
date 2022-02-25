import { Layout, Steps } from "@douyinfe/semi-ui";
import { useState } from "react";
import AdvanceForm from "./components/AdvanceForm";
import BaseForm from "./components/BaseForm";
import Confirm from "./components/Confirm";
import FilterForm from "./components/FilterForm";
import TrafficForm from "./components/TrafficForm";
import { AddTaskContext, FormContent, getEmptyFormContent } from "./context";

// AddTask 添加任务表单，是一个分步表单。
const AddTask = () => {
  const [data, setData] = useState<FormContent>(getEmptyFormContent());
  const [step, setStep] = useState<number>(0);
  const { Sider, Content } = Layout;

  const renderForm = () => {
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
            <AddTaskContext.Provider value={{ data, setData, step, setStep }}>
              {renderForm()}
            </AddTaskContext.Provider>
          </Content>
        </div>
      </Layout>
    </div>
  );
};

export default AddTask;
