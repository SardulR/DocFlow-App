import { Tool } from '../types/tool.types';
import { TOOLS } from '@/constants/tools';

export class ToolService {
  static findToolById(id: string): Tool | undefined {
    return TOOLS.find(tool => tool.id === id);
  }

  static getAllTools(): Tool[] {
    return TOOLS;
  }

  static validateTool(tool: Tool): boolean {
    return !!(tool.id && tool.name && tool.description && tool.icon);
  }
}