import { Button, Form, Space } from "@douyinfe/semi-ui";
import API from "../../../../api";
import { JWT } from "../../../../constants";
import { useGlobalContext } from "../../../../context";
import { useAddTaskContext } from "../../context";

const BaseForm = () => {
  const { data, step, setStep } = useAddTaskContext();
  const { user } = useGlobalContext();
  const { Input, TextArea } = Form;

  const saveValues = (values: any) => {
    data.name = values.name;
    data.description = values.description;
    data.owner = user;
  };

  return (
    <Form extraTextPosition="middle" allowEmpty>
      {({ formState, values, formApi }) => (
        <>
          <Input
            field="name"
            label="任务名称"
            style={{ width: "50%" }}
            showClear={true}
            placeholder="请输入任务名称"
            extraText={"任务名应简洁直接"}
            initValue={data.name}
            trigger={"custom"} // 仅当submit或formapi校验时触发validate
            validate={async (val, values) => {
              if (!val) {
                return "该项为必填项";
              }
              const jwt = localStorage.getItem(JWT);
              const { data } = await API.get(
                `/api/v1/task/searchByName?name=${val}`,
                {
                  headers: { Authorization: `Bearer ${jwt}` },
                }
              );
              if (data.task == null) {
                return "";
              }
              return "已有该任务名，请更换一个新的任务名";
            }}
            // 设置rules.required，则标签自带小红星
            // 当validate设置时，rules失效
            rules={[{ required: true }]}
          />
          <TextArea
            field="description"
            label="任务简介"
            style={{ width: "75%" }}
            placeholder="请输入任务概要"
            initValue={data.description}
            autosize
            showClear
            trigger={"custom"}
            rules={[{ required: true, message: "该项为必填项" }]}
          />
          <Input
            field="owner"
            label="负责人"
            style={{ width: "50%" }}
            disabled={true}
            initValue={user.login}
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
              <Button disabled>上一步</Button>
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

export default BaseForm;
