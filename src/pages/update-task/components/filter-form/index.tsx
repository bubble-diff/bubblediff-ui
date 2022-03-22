import { IconPlusCircle, IconMinusCircle } from "@douyinfe/semi-icons";
import { ArrayField, Button, Form, Space, Typography } from "@douyinfe/semi-ui";
import { useUpdateTaskContext } from "../../context";

const FilterForm = () => {
  const { data, step, setStep } = useUpdateTaskContext();
  const { Text } = Typography;

  const saveValues = (values: any) => {
    if (values.httpPathFilters)
      data.filter_config.http_path_regex_filter =
        values.httpPathFilters.slice();
    else data.filter_config.http_path_regex_filter = undefined;
  };

  return (
    <Form labelPosition="left" allowEmpty>
      {({ formState, values, formApi }) => (
        <>
          <div style={{ paddingBottom: "10px" }}>
            <Form.Label text={"Http路径过滤配置"} />
            <br />
            <Text type="tertiary">支持正则表达式，todo:正则表达式参考文档</Text>
          </div>

          <ArrayField
            field="httpPathFilters"
            initValue={data.filter_config.http_path_regex_filter}
          >
            {({ add, arrayFields, addWithInitValue }) => (
              <>
                {arrayFields.map(({ field, key, remove }, i) => (
                  <div
                    key={key}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Form.Input
                      field={`${field}`}
                      label={"过滤表达式"}
                      style={{ width: 300 }}
                      trigger={"custom"}
                      rules={[{ required: true, message: "该项为必填项" }]}
                    />
                    <Button
                      type="danger"
                      theme="borderless"
                      icon={<IconMinusCircle />}
                      onClick={remove}
                    />
                  </div>
                ))}
                <Button onClick={add} icon={<IconPlusCircle />} theme="light">
                  添加表达式
                </Button>
              </>
            )}
          </ArrayField>

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

export default FilterForm;
