export interface CommentResponse {
  id: number;
  message: string;
  issueId: number;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  message: string;
}

export interface UpdateCommentRequest {
  message: string;
}
