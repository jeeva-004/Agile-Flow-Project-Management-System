export interface IssueHistoryResponse {
  id: number;
  issueId: number;
  userId: number;
  userName: string;
  action: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  createdAt: string;
}
