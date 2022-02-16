import { createContext, useContext } from "react";

// UserContent 表示App当前用户信息
export type UserContent = {
  id: number;
  name: string;
  avatarUrl: string;
  email: string;
};

export const getEmptyUser = (): UserContent => {
  return { id: -1, name: "", avatarUrl: "", email: "" };
};

export enum MsgType {
  Info,
  Success,
  Warn,
  Error,
}

// MessageContent 用于表示App的提示消息
export type MessageContent = {
  msgType: MsgType;
  msg: string;
};

export const getEmptyMessage = (): MessageContent => {
  return { msgType: MsgType.Info, msg: "" };
};

export type GlobalContent = {
  user: UserContent;
  setUser: (value: UserContent) => void;
  message: MessageContent;
  setMessage: (value: MessageContent) => void;
};

export const GlobalContext = createContext<GlobalContent>({
  user: getEmptyUser(),
  setUser: () => {},
  message: getEmptyMessage(),
  setMessage: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);
