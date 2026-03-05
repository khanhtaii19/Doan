
import React from 'react';
import { ChevronRight, Share2, Bookmark } from 'lucide-react';
import { DETAILED_POST, BLOG_POSTS } from '../constants';

const BlogPost: React.FC = () => {
  const post = DETAILED_POST;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <span>Blog</span>
          <ChevronRight size={14} />
          <span className="text-slate-600 font-medium">{post.category}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.2] mb-8">
          {post.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-4 mb-10">
          <img src={post.author?.avatar} alt={post.author?.name} className="w-12 h-12 rounded-full ring-2 ring-white shadow-md" />
          <div>
            <div className="font-bold text-slate-900">{post.author?.name}</div>
            <div className="text-xs text-slate-400 flex gap-2">
              <span>{post.author?.date}</span>
              <span>•</span>
              <span>{post.author?.readTime}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 aspect-[16/9]">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-8 mb-16">
          {post.content?.map((paragraph, idx) => {
            if (paragraph.startsWith('"')) {
              return (
                <blockquote key={idx} className="bg-blue-50/50 border-l-4 border-blue-200 p-8 rounded-2xl italic text-slate-600 text-xl font-medium">
                  {paragraph}
                </blockquote>
              );
            }
            return <p key={idx} className="text-lg">{paragraph}</p>;
          })}
        </div>

        {/* Tags & Interaction */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-10 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <span key={tag} className="bg-slate-100 text-slate-500 text-sm font-medium px-4 py-1.5 rounded-full hover:bg-slate-200 transition-colors cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mr-2">Chia sẻ:</span>
            <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#ff5c62] hover:text-white transition-all">
              <Share2 size={18} />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
              <Bookmark size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <section className="bg-white pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-16">Các bài viết liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((related) => (
              <div key={related.id} className="group cursor-pointer">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                   <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#ff5c62] transition-colors line-clamp-2">
                  {related.title}
                </h3>
                <p className="text-slate-500 text-xs">
                  {related.excerpt.slice(0, 80)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Footer */}
      <div className="max-w-2xl mx-auto px-4 pt-24 text-center">
        <div className="flex items-center justify-center gap-1 mb-4">
          <span className="text-2xl font-extrabold text-slate-800">ShopWeb</span>
          <span className="text-2xl font-extrabold text-[#ff5c62]">Store</span>
        </div>
        <p className="text-slate-400 text-sm mb-8">Cung cấp giải pháp ăn uống lành mạnh và tiện lợi cho cuộc sống hiện đại của bạn.</p>
        <div className="flex justify-center gap-6 text-slate-400 mb-12">
            <Share2 size={20} className="hover:text-slate-900 cursor-pointer" />
            <Share2 size={20} className="hover:text-slate-900 cursor-pointer" />
            <Share2 size={20} className="hover:text-slate-900 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
