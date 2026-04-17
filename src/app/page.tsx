'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Sparkles, ArrowRight, Settings, Palette } from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { getConfig } from '@/lib/data';

function HomeContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadConfig();
  }, []);

  useEffect(() => {
    if (mounted) {
      const auth = Cookies.get('portfolio_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      setLoading(false);
    }
  }, [mounted]);

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      setSiteConfig(data);
    } catch (err) {
      console.error('Failed to load config:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === siteConfig?.visitorPassword) {
      setIsAuthenticated(true);
      Cookies.set('portfolio_auth', 'true', { expires: 7 });
      setError('');
    } else {
      setError('密码错误，请重试');
      setPassword('');
    }
  };

  const handleLogout = () => {
    Cookies.remove('portfolio_auth');
    setIsAuthenticated(false);
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <GalleryPage siteConfig={siteConfig} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-100/50 to-blue-100/50 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20" />
        <div className="relative bg-white/80 dark:bg-dark-100/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden">
          {/* Header decoration */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <div className="p-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Lock className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {siteConfig?.siteTitle || '我的作品集'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                请输入访问密码以查看作品
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="请输入访问密码"
                  className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-center text-lg tracking-widest"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                进入作品集
              </motion.button>
            </motion.form>

            {/* Admin link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Settings className="w-4 h-4" />
                管理员入口
              </Link>
            </motion.div>
          </div>

          {/* Footer decoration */}
          <div className="px-8 pb-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Palette className="w-3 h-3" />
            <span>Powered by Next.js</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function GalleryPage({ siteConfig, onLogout }: { siteConfig: any; onLogout: () => void }) {
  const [works, setWorks] = useState<any[]>([]);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadWorks();
  }, []);

  const loadWorks = async () => {
    try {
      const res = await fetch('/api/works');
      const data = await res.json();
      setWorks(data.works || []);
    } catch (err) {
      console.error('Failed to load works:', err);
    }
  };

  const filteredWorks = filter === 'all' 
    ? works 
    : works.filter(w => w.type === filter);

  const templates = ['grid', 'cards', 'list'];

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {siteConfig?.siteTitle || '我的作品集'}
            </motion.h1>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-500" />
              </Link>
              <button
                onClick={onLogout}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filter */}
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-dark-100/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            {[
              { key: 'all', label: '全部' },
              { key: 'image', label: '图片' },
              { key: 'video', label: '视频' },
              { key: 'audio', label: '音频' },
              { key: 'bilibili', label: 'B站' },
              { key: 'link', label: '链接' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === item.key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredWorks.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedWork(work)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 aspect-[4/3] shadow-lg hover:shadow-xl transition-all duration-300">
                {work.thumbnail || work.url ? (
                  <img
                    src={work.type === 'bilibili' 
                      ? `https://player.bilibili.com/player.html?bvid=${work.bvid}&pic=${encodeURIComponent(work.thumbnail || '')}`
                      : work.thumbnail || work.url
                    }
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                    <span className="text-4xl">
                      {work.type === 'image' && '🖼️'}
                      {work.type === 'video' && '🎬'}
                      {work.type === 'audio' && '🎵'}
                      {work.type === 'bilibili' && '📺'}
                      {work.type === 'link' && '🔗'}
                    </span>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-medium truncate">{work.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {work.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-white/20 rounded text-white text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Type badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-white text-xs">
                    {work.type === 'image' && '图片'}
                    {work.type === 'video' && '视频'}
                    {work.type === 'audio' && '音频'}
                    {work.type === 'bilibili' && 'B站'}
                    {work.type === 'link' && '链接'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredWorks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">暂无作品</p>
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedWork(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white dark:bg-dark-100 rounded-2xl shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedWork(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedWork.title}</h2>
                <p className="text-gray-500 mb-4">{selectedWork.description}</p>
                
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                  {selectedWork.type === 'image' && (
                    <img src={selectedWork.url} alt={selectedWork.title} className="w-full" />
                  )}
                  {selectedWork.type === 'video' && (
                    <video controls className="w-full" src={selectedWork.url} />
                  )}
                  {selectedWork.type === 'audio' && (
                    <div className="p-6">
                      <audio controls className="w-full" src={selectedWork.url} />
                    </div>
                  )}
                  {selectedWork.type === 'bilibili' && (
                    <div className="video-container">
                      <iframe
                        src={`https://player.bilibili.com/player.html?bvid=${selectedWork.bvid}&high_quality=1`}
                        sandbox="allow-scripts allow-same-origin allow-presentation"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {selectedWork.type === 'link' && (
                    <div className="p-8 text-center">
                      <a
                        href={selectedWork.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                      >
                        访问链接
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedWork.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{siteConfig?.siteTitle || '我的作品集'}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {siteConfig?.siteDescription || '欢迎来到我的个人作品集网站'}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">联系方式</h4>
              <div className="space-y-2 text-gray-500 dark:text-gray-400">
                {siteConfig?.contact?.email && (
                  <p>邮箱：{siteConfig.contact.email}</p>
                )}
                {siteConfig?.contact?.phone && (
                  <p>电话：{siteConfig.contact.phone}</p>
                )}
                {siteConfig?.contact?.github && (
                  <a href={siteConfig.contact.github} target="_blank" rel="noopener noreferrer" className="block hover:text-blue-500 transition-colors">
                    GitHub
                  </a>
                )}
                {siteConfig?.contact?.twitter && (
                  <a href={siteConfig.contact.twitter} target="_blank" rel="noopener noreferrer" className="block hover:text-blue-500 transition-colors">
                    Twitter
                  </a>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">快速链接</h4>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  首页
                </Link>
                <Link href="/admin" className="block text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  管理后台
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} {siteConfig?.siteTitle || '我的作品集'}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
