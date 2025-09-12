import { PDFToolHandler } from './ToolHandlers/pdfTools';
import { ImageToolHandler } from './ToolHandlers/ImageTools';
import { DocumentToolHandler } from './ToolHandlers/documentTools';
import { FileUploadResult } from '@/types/tool.types';

export class ToolService {
  static async processFiles(toolId: string, files: any[]): Promise<FileUploadResult> {
    const file = files[0]; // For single file tools
    
    switch (toolId) {
      // PDF Tools
      case 'merge-pdf':
        return PDFToolHandler.mergePDF(files);
      case 'split-pdf':
        return PDFToolHandler.splitPDF(file);
      case 'compress-pdf':
        return PDFToolHandler.compressPDF(file);
      case 'organise-pdf':
        return PDFToolHandler.organisePDF(file);
      case 'add-page-numbers':
        return PDFToolHandler.addPageNumbers(file);
      case 'extract-pdf-pages':
        return PDFToolHandler.extractPDFPages(file);
      case 'remove-pdf-pages':
        return PDFToolHandler.removePDFPages(file);
      case 'pdf-to-word':
        return PDFToolHandler.convertPDFToWord(file);
      case 'pdf-to-excel':
        return PDFToolHandler.convertPDFToExcel(file);
      case 'pdf-to-image':
        return PDFToolHandler.convertPDFToImage(file);

      // Image Tools
      case 'remove-bg':
        return ImageToolHandler.removeBackground(file);
      case 'image-to-pdf':
        return ImageToolHandler.convertImageToPDF(files);

      // Document Tools
      case 'word-to-pdf':
        return DocumentToolHandler.convertWordToPDF(file);
      case 'excel-to-pdf':
        return DocumentToolHandler.convertExcelToPDF(file);

      default:
        return {
          success: false,
          message: 'Tool not implemented yet'
        };
    }
  }

  static getToolConfig(toolId: string) {
    const configs: { [key: string]: any } = {
      'merge-pdf': {
        acceptedFileTypes: ['PDF'],
        allowMultiple: true,
        maxFileSize: 50 * 1024 * 1024, // 50MB
      },
      'split-pdf': {
        acceptedFileTypes: ['PDF'],
        allowMultiple: false,
        maxFileSize: 50 * 1024 * 1024,
      },
      'compress-pdf': {
        acceptedFileTypes: ['PDF'],
        allowMultiple: false,
        maxFileSize: 100 * 1024 * 1024, // 100MB
      },
      'remove-bg': {
        acceptedFileTypes: ['JPG', 'PNG', 'JPEG'],
        allowMultiple: false,
        maxFileSize: 10 * 1024 * 1024, // 10MB
      },
      'image-to-pdf': {
        acceptedFileTypes: ['JPG', 'PNG', 'JPEG'],
        allowMultiple: true,
        maxFileSize: 10 * 1024 * 1024,
      },
      'word-to-pdf': {
        acceptedFileTypes: ['DOCX', 'DOC'],
        allowMultiple: false,
        maxFileSize: 25 * 1024 * 1024, // 25MB
      },
      'excel-to-pdf': {
        acceptedFileTypes: ['XLSX', 'XLS'],
        allowMultiple: false,
        maxFileSize: 25 * 1024 * 1024,
      },
    };

    return configs[toolId] || {
      acceptedFileTypes: ['PDF'],
      allowMultiple: false,
      maxFileSize: 50 * 1024 * 1024,
    };
  }
}
