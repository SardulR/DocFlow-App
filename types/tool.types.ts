export interface ToolConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  allowMultiple?: boolean;
}

export interface ProcessingStatus {
  isProcessing: boolean;
  progress: number;
  message: string;
  error?: string;
}

export interface FileUploadResult {
  success: boolean;
  message: string;
  data?: any;
}