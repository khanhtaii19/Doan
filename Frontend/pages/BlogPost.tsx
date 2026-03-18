import React from 'react';
import { ChevronRight, Share2, Bookmark, ArrowLeft, Clock } from 'lucide-react';
import { BlogPost as BlogPostType } from '../types';

interface BlogPostProps {
  posts: BlogPostType[];
  selectedPost?: BlogPostType | null;
  onSelectPost?: (post: BlogPostType | null) => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ posts, selectedPost, onSelectPost }) => {

  // ── CHẾ ĐỘ CHI TIẾT ─────────────────────────────────────────────────────────
  if (selectedPost) {
    const relatedPosts = posts.filter(p => p.id !== selectedPost.id).slice(0, 3);

    return (
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">

          {/* Nút quay lại danh sách */}
          <button
            onClick={() => onSelectPost && onSelectPost(null)}
            className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-[#ff5c62] transition-colors"
          >
            <ArrowLeft size={18} /> Tất cả bài viết
          </button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <span>Blog</span>
            <ChevronRight size={14} />
            <span className="text-slate-600 font-medium">{selectedPost.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.2] mb-8">
            {selectedPost.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-4 mb-10">
            <img
              src={selectedPost.author?.avatar}
              alt={selectedPost.author?.name}
              className="w-12 h-12 rounded-full ring-2 ring-white shadow-md"
            />
            <div>
              <div className="font-bold text-slate-900">{selectedPost.author?.name}</div>
              <div className="text-xs text-slate-400 flex gap-2">
                <span>{selectedPost.author?.date || selectedPost.date}</span>
                <span>•</span>
                <span>{selectedPost.author?.readTime}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 aspect-[16/9]">
            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-8 mb-16">
            {selectedPost.content?.map((paragraph, idx) => {
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
              {selectedPost.tags?.map((tag) => (
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
        {relatedPosts.length > 0 && (
          <section className="bg-white pt-24">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-16">Các bài viết liên quan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((related) => (
                  <div
                    key={related.id}
                    className="group cursor-pointer"
                    onClick={() => {
                      onSelectPost && onSelectPost(related);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                      <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#ff5c62] transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-slate-500 text-xs">{related.excerpt.slice(0, 80)}...</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Mini Footer */}
        <div className="max-w-2xl mx-auto px-4 pt-24 text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            <span className="text-2xl font-extrabold text-slate-800">Nghien</span>
            <span className="text-2xl font-extrabold text-[#ff5c62]">Food</span>
          </div>
          <p className="text-slate-400 text-sm mb-8">Cung cấp giải pháp ăn uống lành mạnh và tiện lợi cho cuộc sống hiện đại của bạn.</p>
        </div>
      </div>
    );
  }

  // ── CHẾ ĐỘ DANH SÁCH ────────────────────────────────────────────────────────
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4">
            Blog <span className="text-[#ff5c62]">Ẩm Thực</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Khám phá bí quyết nấu ăn, câu chuyện ẩm thực và những trải nghiệm đáng nhớ
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 text-slate-400 italic">Chưa có bài viết nào.</div>
        ) : (
          <>
            {/* Bài viết nổi bật (đầu tiên) */}
            <div
              className="group cursor-pointer mb-16 bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
              onClick={() => onSelectPost && onSelectPost(posts[0])}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-[4/3] lg:aspect-auto overflow-hidden min-h-[300px]">
                  <img
                    src={posts[0].image}
                    alt={posts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-12 flex flex-col justify-center">
                  <span className="inline-block bg-red-50 text-[#ff5c62] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 w-fit">
                    {posts[0].category}
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-4 group-hover:text-[#ff5c62] transition-colors leading-tight">
                    {posts[0].title}
                  </h2>
                  <p className="text-slate-500 leading-relaxed mb-8 line-clamp-3">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={posts[0].author?.avatar}
                        alt={posts[0].author?.name}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{posts[0].author?.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock size={10} /> {posts[0].author?.readTime}
                        </div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[#ff5c62] font-bold text-sm group-hover:gap-3 transition-all">
                      Đọc ngay <ChevronRight size={18} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Các bài còn lại */}
            {posts.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.slice(1).map((post) => (
                  <div
                    key={post.id}
                    className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                    onClick={() => onSelectPost && onSelectPost(post)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#ff5c62] bg-red-50 px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock size={10} /> {post.author?.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#ff5c62] transition-colors leading-tight line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                        <img
                          src={post.author?.avatar}
                          alt={post.author?.name}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                        />
                        <span className="text-sm font-bold text-slate-700">{post.author?.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPost;