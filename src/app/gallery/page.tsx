'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Layout, ArrowRight, ArrowLeft, X, Settings } from 'lucide-react';
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
  template: string;
  theme: string;
  contact: {
    email: string;
    phone: string;
    github: string;
    twitter: string;
  };
}

export default function GalleryPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [filter, setFilter] = useState('all');
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [template, setTemplate] = useState('grid');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

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
      setTemplate(configData.template || 'grid');
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const filteredWorks = filter === 'all' 
    ? works 
    : works.filter(w => w.type === filter);

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
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {config?.siteTitle || '作品展示'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Template selector */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {[
                  { key: 'grid', icon: Grid },
                  { key: 'cards', icon: Layout },
                  { key: 'list', icon: List },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTemplate(t.key)}
                    className={`p-2 rounded-md transition-all ${
                      template === t.key
                        ? 'bg-white dark:bg-gray-700 shadow-sm'
                        : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <t.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              <Link
                href="/admin"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-500" />
              </Link>
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
        {template === 'grid' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredWorks.map((work, index) => (
              <WorkCard
                key={work.id}
                work={work}
                index={index}
                onClick={() => setSelectedWork(work)}
              />
            ))}
          </motion.div>
        )}

        {template === 'cards' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredWorks.map((work, index) => (
              <WorkCardLarge
                key={work.id}
                work={work}
                index={index}
                onClick={() => setSelectedWork(work)}
              />
            ))}
          </motion.div>
        )}

        {template === 'list' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredWorks.map((work, index) => (
              <WorkListItem
                key={work.id}
                work={work}
                index={index}
                onClick={() => setSelectedWork(work)}
              />
            ))}
          </motion.div>
        )}

        {filteredWorks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">暂无作品</p>
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {selectedWork && (
          <WorkModal work={selectedWork} onClose={() => setSelectedWork(null)} />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} {config?.siteTitle || '作品集'}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function WorkCard({ work, index, onClick }: { work: Work; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 aspect-[4/3] shadow-lg hover:shadow-xl transition-all duration-300">
        {work.thumbnail || work.url ? (
          <img
            src={work.thumbnail || work.url}
            alt={work.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-medium truncate">{work.title}</p>
            <div className="flex items-center gap-2 mt-2">
              {work.tags?.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-white/20 rounded text-white text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

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
  );
}

function WorkCardLarge({ work, index, onClick }: { work: Work; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-dark-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/2 aspect-video sm:aspect-auto">
          {work.thumbnail || work.url ? (
            <img
              src={work.thumbnail || work.url}
              alt={work.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
              <span className="text-6xl">
                {work.type === 'image' && '🖼️'}
                {work.type === 'video' && '🎬'}
                {work.type === 'audio' && '🎵'}
                {work.type === 'bilibili' && '📺'}
                {work.type === 'link' && '🔗'}
              </span>
            </div>
          )}
        </div>
        <div className="sm:w-1/2 p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              work.type === 'image' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
              work.type === 'video' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
              work.type === 'audio' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}>
              {work.type === 'image' && '图片'}
              {work.type === 'video' && '视频'}
              {work.type === 'audio' && '音频'}
              {work.type === 'bilibili' && 'B站'}
              {work.type === 'link' && '链接'}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">
            {work.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
            {work.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {work.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function WorkListItem({ work, index, onClick }: { work: Work; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group cursor-pointer flex items-center gap-4 p-4 bg-white dark:bg-dark-100 rounded-xl shadow-sm hover:shadow-md transition-all"
    >
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
        {work.thumbnail || work.url ? (
          <img
            src={work.thumbnail || work.url}
            alt={work.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
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
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium truncate group-hover:text-blue-500 transition-colors">
            {work.title}
          </h3>
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs whitespace-nowrap">
            {work.type === 'image' && '图片'}
            {work.type === 'video' && '视频'}
            {work.type === 'audio' && '音频'}
            {work.type === 'bilibili' && 'B站'}
            {work.type === 'link' && '链接'}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {work.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {work.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-gray-400">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
    </motion.div>
  );
}

function WorkModal({ work, onClose }: { work: Work; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-100 rounded-2xl shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{work.title}</h2>
          <p className="text-gray-500 mb-4">{work.description}</p>
          
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
            {work.type === 'image' && (
              <img src={work.url} alt={work.title} className="w-full" />
            )}
            {work.type === 'video' && (
              <video controls className="w-full" src={work.url} />
            )}
            {work.type === 'audio' && (
              <div className="p-6">
                <audio controls className="w-full" src={work.url} />
              </div>
            )}
            {work.type === 'bilibili' && (
              <div className="video-container">
                <iframe
                  src={`https://player.bilibili.com/player.html?bvid=${work.bvid}&high_quality=1`}
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                  allowFullScreen
                />
              </div>
            )}
            {work.type === 'link' && (
              <div className="p-8 text-center">
                <a
                  href={work.url}
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
            {work.tags?.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
