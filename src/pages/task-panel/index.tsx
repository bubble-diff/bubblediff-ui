import { useParams } from "react-router-dom";

const TaskPanel = () => {
  const { id } = useParams();
  // todo: id合法性检查
  
  return <p>这是任务{id}的看板</p>;
};

export default TaskPanel;
