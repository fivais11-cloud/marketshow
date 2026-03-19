'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Hashtag {
  id: string;
  name: string;
  clickCount: number;
  postCount?: number;
}

export interface Post {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  likes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  hashtags: Hashtag[];
  userLiked?: boolean;
}

export interface CartItem {
  postId: string;
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface SiteSettings {
  id: string;
  companyName: string;
  phone: string;
  telegram: string | null;
  max: string | null;
  address: string | null;
  workingHours: string | null;
  aboutText: string | null;
  deliveryText: string | null;
}

interface AppState {
  searchQuery: string;
  selectedHashtag: string | null;
  isSearchOpen: boolean;
  posts: Post[];
  isLoadingPosts: boolean;
  hashtags: Hashtag[];
  popularHashtags: Hashtag[];
  settings: SiteSettings | null;
  sessionId: string;
  cart: CartItem[];
  isCartOpen: boolean;
  theme: 'light' | 'dark';
  
  setSearchQuery: (query: string) => void;
  setSelectedHashtag: (hashtag: string | null) => void;
  setIsSearchOpen: (open: boolean) => void;
  setPosts: (posts: Post[]) => void;
  setIsLoadingPosts: (loading: boolean) => void;
  setHashtags: (hashtags: Hashtag[]) => void;
  setPopularHashtags: (hashtags: Hashtag[]) => void;
  setSettings: (settings: SiteSettings) => void;
  updatePostLike: (postId: string, liked: boolean, count: number) => void;
  
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (postId: string) => void;
  updateQuantity: (postId: string, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      searchQuery: '',
      selectedHashtag: null,
      isSearchOpen: false,
      posts: [],
      isLoadingPosts: false,
      hashtags: [],
      popularHashtags: [],
      settings: null,
      sessionId: '',
      cart: [],
      isCartOpen: false,
      theme: 'light',
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedHashtag: (hashtag) => set({ selectedHashtag: hashtag, searchQuery: '' }),
      setIsSearchOpen: (open) => set({ isSearchOpen: open }),
      setPosts: (posts) => set({ posts }),
      setIsLoadingPosts: (loading) => set({ isLoadingPosts: loading }),
      setHashtags: (hashtags) => set({ hashtags }),
      setPopularHashtags: (hashtags) => set({ popularHashtags: hashtags }),
      setSettings: (settings) => set({ settings }),
      updatePostLike: (postId, liked, count) => {
        const posts = get().posts.map((post) =>
          post.id === postId ? { ...post, userLiked: liked, likes: count } : post
        );
        set({ posts });
      },
      
      addToCart: (item) => {
        const cart = get().cart;
        const existingItem = cart.find((i) => i.postId === item.postId);
        
        if (existingItem) {
          set({
            cart: cart.map((i) =>
              i.postId === item.postId ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ cart: [...cart, { ...item, quantity: 1 }] });
        }
      },
      
      removeFromCart: (postId) => {
        set({ cart: get().cart.filter((i) => i.postId !== postId) });
      },
      
      updateQuantity: (postId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(postId);
          return;
        }
        set({
          cart: get().cart.map((i) =>
            i.postId === postId ? { ...i, quantity } : i
          ),
        });
      },
      
      clearCart: () => set({ cart: [] }),
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
      
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
      
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'market-show-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        selectedHashtag: state.selectedHashtag,
        cart: state.cart,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !state.sessionId) {
          state.sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + Date.now();
        }
        if (state?.theme) {
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', state.theme === 'dark');
          }
        }
      },
    }
  )
);

if (typeof window !== 'undefined') {
  const state = useAppStore.getState();
  if (!state.sessionId) {
    useAppStore.setState({
      sessionId: 'session_' + Math.random().toString(36).substr(2, 9) + Date.now(),
    });
  }
}
