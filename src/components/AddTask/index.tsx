import { PageContainer } from "@ant-design/pro-layout";
import ProCard from "@ant-design/pro-card";
import ProForm, { ProFormText } from "@ant-design/pro-form";

const AddTask = () => {
  return (
    <PageContainer>
      <ProCard layout="center" style={{ height: "68vh" }}>
        <ProForm autoFocusFirstInput>
          <ProFormText
            width="md"
            name="taskname"
            required
            label="任务名称"
            placeholder="请输入名称"
            rules={[{ required: true, message: "这是必填项" }]}
          />

          <ProFormText
            disabled
            width="md"
            name="owner"
            label="负责人"
            initialValue="当前用户登录名"
          />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default AddTask;
