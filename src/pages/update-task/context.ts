import { createContext, useContext } from "react";
import { getEmptyUser, UserContent } from "../../context";

export type FormContent = {
  name: string | undefined;
  description: string | undefined;
  owner: UserContent;
  traffic_config: TrafficConfig;
  filter_config: FilterConfig;
  advance_config: AdvanceConfig;
};

export type TrafficConfig = {
  device: string | undefined;
  port: number | undefined;
  addr: string | undefined;
};

export type FilterConfig = {
  http_path_regex_filter: string[] | undefined;
};

export type AdvanceConfig = {
  is_recursion_diff: boolean | undefined;
  is_ignore_array_sequence: boolean | undefined;
};

export const getEmptyFormContent = (): FormContent => {
  return {
    name: undefined,
    description: undefined,
    owner: getEmptyUser(),
    traffic_config: { device: undefined, port: undefined, addr: undefined },
    filter_config: { http_path_regex_filter: undefined },
    advance_config: {
      is_recursion_diff: undefined,
      is_ignore_array_sequence: undefined,
    },
  };
};

export type UpdateTaskContent = {
  data: FormContent;
  step: number;
  setStep: (value: number) => void;
};

export const UpdateTaskContext = createContext<UpdateTaskContent>(null!);

export const useUpdateTaskContext = () => useContext(UpdateTaskContext);
