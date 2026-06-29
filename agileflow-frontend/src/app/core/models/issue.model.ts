export interface Issue {

  id: number;

  title: string;

  description: string;

  status: string;

  priority: string;

  type: string;

  estimateHours: number;

  dueDate: string;

  projectId: number;

  projectName: string;

  sprintId: number;

  sprintName: string;

  assigneeId: number;

  assigneeName: string;

  createdById: number;

  createdByName: string;

}