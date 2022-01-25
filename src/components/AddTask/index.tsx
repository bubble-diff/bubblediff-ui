import { Form, Input, Button, FormInstance } from "antd";
import React from "react";
import { ReactNode } from "react";

const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

class AddTask extends React.Component {
  formRef = React.createRef<FormInstance>();

  onReset = () => {
    this.formRef.current!.resetFields();
  };

  render(): ReactNode {
    return (
      <Form
        name="add_task"
        ref={this.formRef}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        initialValues={{
          owner: "当前登录用户名",
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="任务名称"
          name="taskname"
          rules={[
            {
              required: true,
              message: "Please input your taskname!",
            },
          ]}
        >
          <Input placeholder="Please enter" />
        </Form.Item>

        <Form.Item label="负责人" name="owner" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button htmlType="button" onClick={this.onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default AddTask;
