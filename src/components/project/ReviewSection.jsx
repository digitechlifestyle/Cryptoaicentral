import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ThumbsUp, User } from "lucide-react";
import { Review } from "@/api/entities";

function ReviewForm({ project, user, onReviewAdded }) {
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: '',
    pros: '',
    cons: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await Review.create({
        listing_id: project.id,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
        pros: formData.pros.split(',').map(s => s.trim()).filter(Boolean),
        cons: formData.cons.split(',').map(s => s.trim()).filter(Boolean)
      });
      
      setFormData({ rating: 5, title: '', content: '', pros: '', cons: '' });
      onReviewAdded();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-slate-600 mb-4">Login to write a review</p>
          <Button onClick={() => User.login()}>Login</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className="p-1"
                >
                  <Star 
                    className={`w-6 h-6 ${
                      star <= formData.rating 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <Input
            placeholder="Review title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          
          <Textarea
            placeholder="Share your experience..."
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="h-32"
            required
          />
          
          <Input
            placeholder="Pros (comma-separated)"
            value={formData.pros}
            onChange={(e) => setFormData(prev => ({ ...prev, pros: e.target.value }))}
          />
          
          <Input
            placeholder="Cons (comma-separated)"
            value={formData.cons}
            onChange={(e) => setFormData(prev => ({ ...prev, cons: e.target.value }))}
          />
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ReviewCard({ review }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating 
                      ? 'text-yellow-500 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-600">({review.rating}/5)</span>
          </div>
          <div className="text-sm text-slate-500">
            {new Date(review.created_date).toLocaleDateString()}
          </div>
        </div>
        
        <h3 className="font-semibold text-slate-900 mb-2">{review.title}</h3>
        <p className="text-slate-600 mb-4">{review.content}</p>
        
        {review.pros && review.pros.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-green-700 mb-1">Pros:</p>
            <ul className="text-sm text-slate-600">
              {review.pros.map((pro, index) => (
                <li key={index} className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {review.cons && review.cons.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-red-700 mb-1">Cons:</p>
            <ul className="text-sm text-slate-600">
              {review.cons.map((con, index) => (
                <li key={index} className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {review.created_by.split('@')[0]}
          </span>
          {review.helpful_votes > 0 && (
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {review.helpful_votes} helpful
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReviewSection({ project, reviews, user, onReviewAdded }) {
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating) 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-600">
                {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>
      </div>

      <ReviewForm project={project} user={user} onReviewAdded={onReviewAdded} />

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No reviews yet</h3>
              <p className="text-slate-600">Be the first to review this project!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}