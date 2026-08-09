export interface AttachmentResponse {
  id: number;
  fileName: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  issueId: number;
  uploadedById: number;
  uploadedByName: string;
  uploadedAt: string;
}
