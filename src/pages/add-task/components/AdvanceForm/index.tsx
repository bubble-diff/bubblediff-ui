import { Button, Form, Space } from "@douyinfe/semi-ui";
import { useAddTaskContext } from "../../context";

const AdvanceForm = () => {
  const { data, setData, step, setStep } = useAddTaskContext();

  const saveValues = (values: any) => {
    const dataCopy = data;
    dataCopy.advance_config.is_recursion_diff = values.isRecursionDiff;
    dataCopy.advance_config.is_ignore_array_sequence =
      values.isIgnoreArraySequence;
    setData(dataCopy);
  };

  return (
    <Form>
      {({ formState, values, formApi }) => (
        <>
          <Form.Section text={"JSON Diff配置"}>
            <Form.Switch
              field="isRecursionDiff"
              label="递归模式"
              initValue={data.advance_config.is_recursion_diff}
            />
            <Form.Switch
              field="isIgnoreArraySequence"
              label="忽略数组顺序模式"
              initValue={data.advance_config.is_ignore_array_sequence}
            />
          </Form.Section>

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
                theme="solid"
                type="primary"
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
                预览
              </Button>
            </Space>
          </div>
        </>
      )}
    </Form>
  );
};

export default AdvanceForm;
