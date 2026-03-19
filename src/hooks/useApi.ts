'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore, Post, Hashtag, SiteSettings, CartItem } from '@/store/useAppStore';

// ============ POSTS ============

export function usePosts(search?: string, hashtag?: string) {
  const { setPosts, setIsLoadingPosts, sessionId } = useAppStore();
  
  return useQuery({
    queryKey: ['posts', search, hashtag],
    queryFn: async () => {
      setIsLoadingPosts(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (hashtag) params.append('hashtag', hashtag);
      
      const response = await fetch(`/api/posts?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const posts: Post[] = await response.json();
      
      // Fetch like status for each post
      const postsWithLikes = await Promise.all(
        posts.map(async (post) => {
          try {
            const likeResponse = await fetch(`/api/likes?postId=${post.id}&sessionId=${sessionId}`);
            const likeData = await likeResponse.json();
            return { 
              ...post, 
              userLiked: likeData.userLiked, 
              likes: likeData.count ?? post.likes,
              price: post.price || 0
            };
          } catch {
            return { ...post, price: post.price || 0 };
          }
        })
      );
      
      setPosts(postsWithLikes);
      setIsLoadingPosts(false);
      return postsWithLikes;
    },
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${id}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      return response.json();
    },
    enabled: !!id,
  });
}

// ============ HASHTAGS ============

export function useHashtags() {
  const { setHashtags, setPopularHashtags } = useAppStore();
  
  return useQuery({
    queryKey: ['hashtags'],
    queryFn: async () => {
      const response = await fetch('/api/hashtags');
      if (!response.ok) throw new Error('Failed to fetch hashtags');
      
      const hashtags: Hashtag[] = await response.json();
      setHashtags(hashtags);
      setPopularHashtags(hashtags.slice(0, 10));
      return hashtags;
    },
  });
}

// ============ SETTINGS ============

export function useSettings() {
  const { setSettings } = useAppStore();
  
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      
      const settings: SiteSettings = await response.json();
      setSettings(settings);
      return settings;
    },
  });
}

// ============ LIKES ============

export function useLikeMutation() {
  const queryClient = useQueryClient();
  const { sessionId, updatePostLike } = useAppStore();
  
  return useMutation({
    mutationFn: async ({ postId }: { postId: string }) => {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, sessionId }),
      });
      
      if (!response.ok) throw new Error('Failed to toggle like');
      
      const data = await response.json();
      updatePostLike(postId, data.userLiked, data.count);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// ============ HASHTAG CLICK ============

export function useHashtagClick() {
  return useMutation({
    mutationFn: async (hashtagId: string) => {
      const response = await fetch(`/api/hashtags/${hashtagId}`, {
        method: 'PUT',
      });
      
      if (!response.ok) throw new Error('Failed to update hashtag');
      return response.json();
    },
  });
}

// ============ CART ============

export function useCart() {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useAppStore();
  
  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total: getCartTotal(),
    count: getCartCount(),
  };
}

// ============ ORDERS ============

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { clearCart } = useAppStore();
  
  return useMutation({
    mutationFn: async (data: {
      phone: string;
      email?: string;
      items: CartItem[];
      totalPrice: number;
    }) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create order');
      return response.json();
    },
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useOrders(password: string) {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch(`/api/orders?password=${password}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    enabled: !!password,
  });
}

// ============ CALLBACK ============

export function useCallbackMutation() {
  return useMutation({
    mutationFn: async (data: { 
      name?: string; 
      phone: string; 
      source?: string; 
      message?: string;
      type?: 'callback' | 'telegram' | 'max';
    }) => {
      const response = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to send callback request');
      return response.json();
    },
  });
}

// ============ ADMIN: POSTS ============

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      title: string;
      imageUrl: string;
      description: string;
      price: number;
      hashtags: string[];
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string;
      password: string;
    }) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['hashtags'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      id: string;
      title?: string;
      imageUrl?: string;
      description?: string;
      price?: number;
      hashtags?: string[];
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string;
      isActive?: boolean;
      password: string;
    }) => {
      const { id, ...postData } = data;
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) throw new Error('Failed to update post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['hashtags'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, password }: { id: string; password: string }) => {
      const response = await fetch(`/api/posts/${id}?password=${password}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['hashtags'] });
    },
  });
}

// ============ ADMIN: SETTINGS ============

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { setSettings } = useAppStore();
  
  return useMutation({
    mutationFn: async (data: Partial<SiteSettings> & { password: string }) => {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: (data) => {
      setSettings(data);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}
