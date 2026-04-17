'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Lock, Save, Plus, Trash2, Edit2, X, Check, 
  Image, Video, Music, Link as LinkIcon, Globe, 
  ChevronLeft, Upload, ExternalLink, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface Work {
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

interface Config {
  siteTitle: string;
  siteDescription: string;
  visitorPassword: string;
  adminPassword: string;
  contact: {
    email: string;
    phone: string;
    github: string;
    twitter: string;
  };
  template: string;
  theme: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [config, setConfig] = useState<Config | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [activeTab, setActiveTab] = useState<'works' | 'settings'>('works');
  const [showModal, setShowModal] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const adminAuth = Cookies.get('portfolio_admin_auth');
      if (adminAuth === 'true') {
        setIsAuthenticated(true);
        loadData();
      }
    }
  }, [mounted]);

  const loadData = async () => {
    try {
      const [configRes, worksRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/works')
      ]);
      const configData = await configRes.json();
      const worksData = await worksRes.json();
      setConfig(configData);
      setWorks(worksData.works || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (password === data.adminPassword) {
        setIsAuthenticated(true);
        Cookies.set('portfolio_admin_auth', 'true', { expires: 7 });
        loadData();
        setError('');
      } else {
        setError('管理员密码错误');
      }
    } catch (err) {
      setError('验证失败，请重试');
    }
  };

  const handleLogout = () => {
    Cookies.remove('portfolio_admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleSaveConfig = async (newConfig: Config) => {
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
      if (res.ok) {
        setConfig(newConfig);
        setShowConfigModal(false);
      }
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  const handleSaveWork = async (work: Work) => {
    try {
      const res = await fetch('/api/works', {
        method: editingWork ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(work)
      });
      if (res.ok) {
        loadData();
        setShowModal(false);
        setEditingWork(null);
      }
    } catch (err) {
      console.error('Failed to save work:', err);
    }
  };

  const handleDeleteWork = async (id: string) => {
    if (!confirm('确定要删除这个作品吗？')) return;
    try {
      const res = await fetch(`/api/works?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Failed to delete work:', err);
    }
  };

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-dark-100 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">管理员登录</h1>
                  <p className="text-sm text-gray-500">请输入管理员密码</p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="管理员密码"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  登录
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  返回首页
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-300">
      {/* Header */}
      <header className="bg-white dark:bg-dark-100 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                管理后台
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-dark-100 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { key: 'works', label: '作品管理', icon: Image },
              { key: 'settings', label: '网站设置', icon: Globe },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'works' | 'settings')}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'works' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">作品列表 ({works.length})</h2>
              <button
                onClick={() => {
                  setEditingWork(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                添加作品
              </button>
            </div>

            <div className="bg-white dark:bg-dark-100 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-dark-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作品</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标签</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {works.map((work) => (
                      <tr key={work.id} className="hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                              {work.thumbnail || work.url ? (
                                <img src={work.thumbnail || work.url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                  {work.type === 'image' && '🖼️'}
                                  {work.type === 'video' && '🎬'}
                                  {work.type === 'audio' && '🎵'}
                                  {work.type === 'bilibili' && '📺'}
                                  {work.type === 'link' && '🔗'}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{work.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{work.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            work.type === 'image' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                            work.type === 'video' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                            work.type === 'audio' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            work.type === 'bilibili' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {work.type === 'image' && <Image className="w-3 h-3" />}
                            {work.type === 'video' && <Video className="w-3 h-3" />}
                            {work.type === 'audio' && <Music className="w-3 h-3" />}
                            {work.type === 'bilibili' && <Video className="w-3 h-3" />}
                            {work.type === 'link' && <LinkIcon className="w-3 h-3" />}
                            {work.type === 'image' && '图片'}
                            {work.type === 'video' && '视频'}
                            {work.type === 'audio' && '音频'}
                            {work.type === 'bilibili' && 'B站'}
                            {work.type === 'link' && '链接'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {work.tags?.slice(0, 2).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {work.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingWork(work);
                                setShowModal(true);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteWork(work.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {works.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">暂无作品，点击上方按钮添加</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && config && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-dark-100 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-medium mb-4">基本信息</h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    网站标题
                  </label>
                  <input
                    type="text"
                    value={config.siteTitle}
                    onChange={(e) => setConfig({ ...config, siteTitle: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    网站描述
                  </label>
                  <textarea
                    value={config.siteDescription}
                    onChange={(e) => setConfig({ ...config, siteDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-100 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-medium mb-4">密码设置</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    访问密码
                  </label>
                  <input
                    type="text"
                    value={config.visitorPassword}
                    onChange={(e) => setConfig({ ...config, visitorPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <p className="mt-1 text-xs text-gray-400">访客需要输入此密码才能查看作品</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    管理员密码
                  </label>
                  <input
                    type="text"
                    value={config.adminPassword}
                    onChange={(e) => setConfig({ ...config, adminPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <p className="mt-1 text-xs text-gray-400">默认: 114514</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-100 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-medium mb-4">联系方式</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={config.contact.email}
                    onChange={(e) => setConfig({ ...config, contact: { ...config.contact, email: e.target.value } })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    电话
                  </label>
                  <input
                    type="text"
                    value={config.contact.phone}
                    onChange={(e) => setConfig({ ...config, contact: { ...config.contact, phone: e.target.value } })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={config.contact.github}
                    onChange={(e) => setConfig({ ...config, contact: { ...config.contact, github: e.target.value } })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={config.contact.twitter}
                    onChange={(e) => setConfig({ ...config, contact: { ...config.contact, twitter: e.target.value } })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-100 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-medium mb-4">展示模板</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { key: 'grid', label: '网格布局', desc: '经典的网格展示' },
                  { key: 'cards', label: '卡片布局', desc: '现代卡片风格' },
                  { key: 'list', label: '列表布局', desc: '简洁列表展示' },
                ].map((template) => (
                  <button
                    key={template.key}
                    onClick={() => setConfig({ ...config, template: template.key })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      config.template === template.key
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="font-medium">{template.label}</div>
                    <div className="text-sm text-gray-500">{template.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSaveConfig(config)}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              保存设置
            </button>
          </motion.div>
        )}
      </main>

      {/* Work Modal */}
      <AnimatePresence>
        {showModal && (
          <WorkModal
            work={editingWork}
            onSave={handleSaveWork}
            onClose={() => {
              setShowModal(false);
              setEditingWork(null);
            }}
            generateId={generateId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WorkModal({
  work,
  onSave,
  onClose,
  generateId
}: {
  work: Work | null;
  onSave: (work: Work) => void;
  onClose: () => void;
  generateId: () => string;
}) {
  const [formData, setFormData] = useState<Work>(work || {
    id: '',
    title: '',
    description: '',
    type: 'image',
    url: '',
    bvid: '',
    thumbnail: '',
    tags: [],
    createdAt: new Date().toISOString().split('T')[0]
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || generateId()
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-100 rounded-2xl shadow-2xl"
      >
        <div className="sticky top-0 bg-white dark:bg-dark-100 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">{work ? '编辑作品' : '添加作品'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              标题
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="作品标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="作品描述"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              类型
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { key: 'image', label: '图片', icon: Image },
                { key: 'video', label: '视频', icon: Video },
                { key: 'audio', label: '音频', icon: Music },
                { key: 'bilibili', label: 'B站', icon: Video },
                { key: 'link', label: '链接', icon: LinkIcon },
              ].map((type) => (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.key as Work['type'] })}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                    formData.type === type.key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <type.icon className="w-5 h-5" />
                  <span className="text-xs">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {(formData.type === 'image' || formData.type === 'video' || formData.type === 'audio') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                文件URL
              </label>
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="https://example.com/file.mp4"
              />
              <p className="mt-1 text-xs text-gray-400">
                支持直接链接的视频格式：MP4, WebM, Ogg
              </p>
            </div>
          )}

          {formData.type === 'bilibili' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                B站视频BV号
              </label>
              <input
                type="text"
                value={formData.bvid || ''}
                onChange={(e) => setFormData({ ...formData, bvid: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="BV1xx411c7XD"
              />
              <p className="mt-1 text-xs text-gray-400">
                在B站视频页面URL中找到BV号，例如：https://www.bilibili.com/video/<strong>BV1xx411c7XD</strong>/
              </p>
            </div>
          )}

          {formData.type === 'link' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                外部链接
              </label>
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="https://example.com"
              />
              <p className="mt-1 text-xs text-gray-400">
                用于分享大文件，推荐使用 SwissTransfer (50GB免费)
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              封面图URL (可选)
            </label>
            <input
              type="url"
              value={formData.thumbnail || ''}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              标签
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="输入标签后按回车添加"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              日期
            </label>
            <input
              type="date"
              value={formData.createdAt}
              onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              保存
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
