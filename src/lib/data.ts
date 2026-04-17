import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'data');

export interface Contact {
  email: string;
  phone: string;
  github: string;
  twitter: string;
}

export interface SiteConfig {
  siteTitle: string;
  siteDescription: string;
  visitorPassword: string;
  adminPassword: string;
  contact: Contact;
  template: string;
  theme: string;
}

export interface Work {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'audio' | 'bilibili' | 'link' | 'document';
  url?: string;
  bvid?: string;
  thumbnail?: string;
  tags: string[];
  createdAt: string;
}

export interface WorksData {
  works: Work[];
}

// 读取配置
export async function getConfig(): Promise<SiteConfig> {
  try {
    const filePath = path.join(dataDir, 'config.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading config:', error);
    return {
      siteTitle: '我的作品集',
      siteDescription: '欢迎来到我的个人作品集网站',
      visitorPassword: '123456',
      adminPassword: '114514',
      contact: {
        email: 'contact@example.com',
        phone: '138-0000-0000',
        github: 'https://github.com',
        twitter: 'https://twitter.com'
      },
      template: 'grid',
      theme: 'light'
    };
  }
}

// 保存配置
export async function saveConfig(config: SiteConfig): Promise<boolean> {
  try {
    const filePath = path.join(dataDir, 'config.json');
    await fs.writeFile(filePath, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
}

// 读取作品
export async function getWorks(): Promise<WorksData> {
  try {
    const filePath = path.join(dataDir, 'works.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading works:', error);
    return { works: [] };
  }
}

// 保存作品
export async function saveWorks(data: WorksData): Promise<boolean> {
  try {
    const filePath = path.join(dataDir, 'works.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving works:', error);
    return false;
  }
}

// 添加作品
export async function addWork(work: Work): Promise<boolean> {
  try {
    const data = await getWorks();
    data.works.unshift(work);
    return await saveWorks(data);
  } catch (error) {
    console.error('Error adding work:', error);
    return false;
  }
}

// 更新作品
export async function updateWork(id: string, updates: Partial<Work>): Promise<boolean> {
  try {
    const data = await getWorks();
    const index = data.works.findIndex(w => w.id === id);
    if (index === -1) return false;
    
    data.works[index] = { ...data.works[index], ...updates };
    return await saveWorks(data);
  } catch (error) {
    console.error('Error updating work:', error);
    return false;
  }
}

// 删除作品
export async function deleteWork(id: string): Promise<boolean> {
  try {
    const data = await getWorks();
    data.works = data.works.filter(w => w.id !== id);
    return await saveWorks(data);
  } catch (error) {
    console.error('Error deleting work:', error);
    return false;
  }
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
