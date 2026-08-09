export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  redirectUrl: string;
  createdAt: string;
}
