import { Tag } from "@douyinfe/semi-ui";

const SwitchTag = (props: { on: boolean }) => {
  if (props.on) return <Tag color="green"> On </Tag>;
  else return <Tag color="red"> Off </Tag>;
};

export default SwitchTag;
