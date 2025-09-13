export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ToolScreenParams {
  id: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
}