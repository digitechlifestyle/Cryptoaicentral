import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function BlogManagementRow({ post, onTogglePublish, onDelete }) {
  const avatar = post.title?.charAt(0).toUpperCase() || 'B';

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Thumbnail or placeholder - uniform 48x48px square */}
        <div className="flex-shrink-0">
          {post.featured_image ? (
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-12 h-12 rounded-lg object-cover border border-slate-200"
              style={{ aspectRatio: '1/1' }}
            />
          ) : (
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center border border-blue-500/30 relative overflow-hidden"
              style={{ 
                aspectRatio: '1/1',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(124, 58, 237, 0.26))',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              <span className="text-blue-600 text-xl font-bold tracking-wider relative z-10">
                {avatar}
              </span>
              <div 
                className="absolute inset-0 opacity-60 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.7), transparent 60%)' }}
              />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-slate-900 truncate">{post.title}</h4>
            <Badge variant={post.published ? "default" : "secondary"} className="flex-shrink-0">
              {post.published ? 'Published' : 'Draft'}
            </Badge>
            {post.ai_generated && (
              <Badge variant="outline" className="flex-shrink-0 text-xs">AI</Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span>{post.category}</span>
            <span>•</span>
            <span>{post.reading_time || 5} min read</span>
            <span>•</span>
            <span>{new Date(post.created_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        <Link to={createPageUrl("BlogPost") + `?slug=${post.slug}`}>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
        <Link to={createPageUrl("EditBlogPost") + `?id=${post.id}`}>
          <Button variant="ghost" size="sm">
            <Pencil className="w-4 h-4" />
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onTogglePublish(post)}
        >
          {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDelete(post.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}