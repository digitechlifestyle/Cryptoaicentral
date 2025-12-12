import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, Calendar, FileText, Eye, EyeOff } from 'lucide-react';

export default function BlogQuickActions({ onComplete }) {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.BlogPost.list('-created_date', 200);
      setPosts(data || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    }
    setIsLoading(false);
  };

  const categories = ['all', ...new Set(posts.map(p => p.category).filter(Boolean))];
  const statuses = [
    { value: 'all', label: 'All Posts' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Drafts' }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleBulkPublish = async () => {
    const selectedPosts = getFilteredPosts().filter(p => !p.published);
    
    if (selectedPosts.length === 0) {
      alert('No unpublished posts to publish');
      return;
    }

    if (!confirm(`Publish ${selectedPosts.length} post(s)?`)) return;

    setIsLoading(true);
    try {
      for (const post of selectedPosts) {
        await base44.entities.BlogPost.update(post.id, { published: true });
      }
      alert(`✅ Published ${selectedPosts.length} post(s)`);
      await loadPosts();
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Bulk publish error:', error);
      alert('Failed to publish posts');
    }
    setIsLoading(false);
  };

  const handleBulkUnpublish = async () => {
    const selectedPosts = getFilteredPosts().filter(p => p.published);
    
    if (selectedPosts.length === 0) {
      alert('No published posts to unpublish');
      return;
    }

    if (!confirm(`Unpublish ${selectedPosts.length} post(s)?`)) return;

    setIsLoading(true);
    try {
      for (const post of selectedPosts) {
        await base44.entities.BlogPost.update(post.id, { published: false });
      }
      alert(`✅ Unpublished ${selectedPosts.length} post(s)`);
      await loadPosts();
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Bulk unpublish error:', error);
      alert('Failed to unpublish posts');
    }
    setIsLoading(false);
  };

  const getFilteredPosts = () => {
    let filtered = [...posts];

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    if (statusFilter === 'published') {
      filtered = filtered.filter(post => post.published);
    } else if (statusFilter === 'draft') {
      filtered = filtered.filter(post => !post.published);
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="bg-white p-4 rounded-lg border mb-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-full md:w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-slate-600">
          {filteredPosts.length} post(s) {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' ? 'found' : 'total'}
        </span>
        
        <div className="flex-1" />
        
        <Button 
          size="sm" 
          onClick={handleBulkPublish}
          disabled={isLoading}
          className="text-xs"
        >
          <Eye className="w-3 h-3 mr-1" />
          Publish All Filtered
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleBulkUnpublish}
          disabled={isLoading}
          className="text-xs"
        >
          <EyeOff className="w-3 h-3 mr-1" />
          Unpublish All Filtered
        </Button>
      </div>
    </div>
  );
}