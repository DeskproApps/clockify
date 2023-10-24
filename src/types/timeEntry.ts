export interface ICreateTimeEntry {
  billable?: boolean;
  description?: string;
  end?: string;
  projectId?: string;
  start?: string;
  taskId?: string;
  tagIds?: string[];
}

export interface ITimeEntry {
  id: string;
  timeInterval: {
    end: string;
    start: string;
    duration: string;
  };
  tagIds: string[];
}
