import { Button, Form, Space } from "@douyinfe/semi-ui";
import { useUpdateTaskContext } from "../../context";

const TrafficForm = () => {
  const { data, step, setStep } = useUpdateTaskContext();

  const saveValues = (values: any) => {
    data.traffic_config.device = values.device;
    data.traffic_config.port = values.port;
    data.traffic_config.addr = values.addr;
  };

  return (
    <Form extraTextPosition="middle" allowEmpty>
      {({ formState, values, formApi }) => (
        <>
          <Form.Input
            field="device"
            label={"基准服务实例监听网卡"}
            extraText={"todo: 补充说明(eth0 for linux/en0 for macos)"}
            style={{ width: "50%" }}
            initValue={data.traffic_config.device}
            showClear={true}
            trigger={"custom"}
            rules={[{ required: true, message: "该项为必填项" }]}
          />
          <Form.InputNumber
            field="port"
            label="基准服务实例监听端口"
            style={{ width: "50%" }}
            initValue={data.traffic_config.port}
            trigger={"custom"}
            rules={[{ required: true, message: "该项为必填项" }]}
          />
          <Form.Input
            field="addr"
            label="被测服务实例地址"
            style={{ width: "50%" }}
            initValue={data.traffic_config.addr}
            trigger={"custom"}
            rules={[{ required: true, message: "该项为必填项" }]}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingTop: "20px",
            }}
          >
            <Space>
              <Button
                onClick={async (event) => {
                  event.preventDefault();
                  try {
                    const values = await formApi.validate();
                    console.log(values);
                    saveValues(values);
                    setStep(step - 1);
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                上一步
              </Button>
              <Button
                onClick={async (event) => {
                  event.preventDefault();
                  try {
                    const values = await formApi.validate();
                    console.log(values);
                    saveValues(values);
                    setStep(step + 1);
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                下一步
              </Button>
            </Space>
          </div>
        </>
      )}
    </Form>
  );
};

export default TrafficForm;
