'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Plus, Edit, Trash2, Settings, ImageIcon, LogOut, Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useSettings, usePosts, useHashtags, useCreatePost, useUpdatePost, useDeletePost, useUpdateSettings } from '@/hooks/useApi';
import { Post, Hashtag } from '@/store/useAppStore';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  
  // Post form state
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postForm, setPostForm] = useState({
    title: '',
    imageUrl: '',
    description: '',
    price: '',
    hashtags: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });
  
  // Settings form state - initialized with empty values, will be populated from settings
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});
  
  // Queries and mutations
  const { data: settings } = useSettings();
  const { data: posts, isLoading: postsLoading, refetch: refetchPosts } = usePosts();
  const { data: hashtags, refetch: refetchHashtags } = useHashtags();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const updateSettings = useUpdateSettings();
  
  // Get form value with fallback to settings
  const getFormValue = (key: string, fallback: string = ''): string => {
    return settingsForm[key] ?? (settings as Record<string, string>)?.[key] ?? fallback;
  };
  
  // Check if already authenticated (client-side only)
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (settings && password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Неверный пароль');
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setPassword('');
  };
  
  // Post CRUD handlers
  const openCreatePost = () => {
    setEditingPost(null);
    setPostForm({
      title: '',
      imageUrl: '',
      description: '',
      price: '',
      hashtags: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
    });
    setShowPostDialog(true);
  };
  
  const openEditPost = (post: Post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title || '',
      imageUrl: post.imageUrl,
      description: post.description,
      price: String(post.price / 100),
      hashtags: post.hashtags.map(h => h.name).join(', '),
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      seoKeywords: post.seoKeywords || '',
    });
    setShowPostDialog(true);
  };
  
  const handleSavePost = async () => {
    if (!postForm.imageUrl || !postForm.description) {
      toast.error('Заполните обязательные поля');
      return;
    }
    
    const hashtagsArray = postForm.hashtags
      .split(',')
      .map(h => h.trim().replace('#', ''))
      .filter(h => h.length > 0);
    
    const priceInKopecks = Math.round(parseFloat(postForm.price || '0') * 100);
    
    try {
      if (editingPost) {
        await updatePost.mutateAsync({
          id: editingPost.id,
          title: postForm.title || undefined,
          imageUrl: postForm.imageUrl,
          description: postForm.description,
          price: priceInKopecks,
          hashtags: hashtagsArray,
          seoTitle: postForm.seoTitle || undefined,
          seoDescription: postForm.seoDescription || undefined,
          seoKeywords: postForm.seoKeywords || undefined,
          password: 'admin123',
        });
        toast.success('Пост обновлён');
      } else {
        await createPost.mutateAsync({
          title: postForm.title || undefined,
          imageUrl: postForm.imageUrl,
          description: postForm.description,
          price: priceInKopecks,
          hashtags: hashtagsArray,
          seoTitle: postForm.seoTitle || undefined,
          seoDescription: postForm.seoDescription || undefined,
          seoKeywords: postForm.seoKeywords || undefined,
          password: 'admin123',
        });
        toast.success('Пост создан');
      }
      setShowPostDialog(false);
      refetchPosts();
      refetchHashtags();
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };
  
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Удалить этот пост?')) return;
    
    try {
      await deletePost.mutateAsync({ id: postId, password: 'admin123' });
      toast.success('Пост удалён');
      refetchPosts();
      refetchHashtags();
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };
  
  const handleSaveSettings = async () => {
    try {
      const updateData: any = {
        password: 'admin123',
        phone: getFormValue('phone'),
        telegram: getFormValue('telegram') || null,
        max: getFormValue('max') || null,
        address: getFormValue('address') || null,
        workingHours: getFormValue('workingHours') || null,
        aboutText: getFormValue('aboutText') || null,
        deliveryText: getFormValue('deliveryText') || null,
      };
      
      if (settingsForm['adminPassword']) {
        updateData.adminPassword = settingsForm['adminPassword'];
      }
      
      await updateSettings.mutateAsync(updateData);
      toast.success('Настройки сохранены');
    } catch (error) {
      toast.error('Ошибка сохранения настроек');
    }
  };
  
  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-pink-100">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-pink-500" />
            </div>
            <CardTitle className="text-pink-500">Админ-панель</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                />
                {loginError && (
                  <p className="text-sm text-red-500">{loginError}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              >
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-pink-100 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-pink-500">
              🎈 Админ-панель
            </h1>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white border border-pink-100">
            <TabsTrigger value="posts" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <ImageIcon className="h-4 w-4 mr-2" />
              Посты
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>
          
          {/* Posts Tab */}
          <TabsContent value="posts">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Управление постами</h2>
              <Button
                onClick={openCreatePost}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Новый пост
              </Button>
            </div>
            
            {postsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="overflow-hidden border-pink-100">
                      <div className="relative aspect-square">
                        <Image
                          src={post.imageUrl}
                          alt={post.description.slice(0, 50)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        {post.title && (
                          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                            {post.title}
                          </h3>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {post.description}
                        </p>
                        {post.price > 0 && (
                          <p className="text-pink-500 font-semibold mb-2">
                            {(post.price / 100).toLocaleString('ru-RU')} ₽
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.hashtags.slice(0, 3).map((tag) => (
                            <Badge key={tag.id} variant="secondary" className="text-xs bg-pink-50 text-pink-600">
                              #{tag.name}
                            </Badge>
                          ))}
                          {post.hashtags.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-500">
                              +{post.hashtags.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">
                            ❤️ {post.likes} лайков
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditPost(post)}
                              className="text-pink-500 hover:bg-pink-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-pink-100">
                <ImageIcon className="h-12 w-12 text-pink-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Нет постов</h3>
                <p className="text-gray-500 mb-4">Создайте первый пост для вашего каталога</p>
                <Button
                  onClick={openCreatePost}
                  className="bg-gradient-to-r from-pink-500 to-pink-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Создать пост
                </Button>
              </Card>
            )}
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="border-pink-100">
              <CardHeader>
                <CardTitle className="text-pink-500">Настройки сайта</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      value={getFormValue('phone')}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Режим работы</Label>
                    <Input
                      id="workingHours"
                      value={getFormValue('workingHours')}
                      onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                      className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telegram">Telegram (ссылка)</Label>
                    <Input
                      id="telegram"
                      value={getFormValue('telegram')}
                      onChange={(e) => setSettingsForm({ ...settingsForm, telegram: e.target.value })}
                      placeholder="https://t.me/username"
                      className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max">Max (ссылка)</Label>
                    <Input
                      id="max"
                      value={getFormValue('max')}
                      onChange={(e) => setSettingsForm({ ...settingsForm, max: e.target.value })}
                      placeholder="https://max.ru/chat/..."
                      className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Адрес</Label>
                    <Input
                      id="address"
                      value={getFormValue('address')}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="aboutText">Текст страницы "О нас"</Label>
                    <Textarea
                      id="aboutText"
                      value={getFormValue('aboutText')}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                      rows={3}
                      className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="deliveryText">Текст страницы "Доставка и оплата"</Label>
                    <Textarea
                      id="deliveryText"
                      value={getFormValue('deliveryText')}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryText: e.target.value })}
                      rows={3}
                      className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Новый пароль админки (оставьте пустым, чтобы не менять)</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      value={settingsForm['adminPassword'] || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, adminPassword: e.target.value })}
                      placeholder="Новый пароль"
                      className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveSettings}
                  disabled={updateSettings.isPending}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                >
                  {updateSettings.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Сохранить настройки
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Post Dialog */}
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-pink-500">
              {editingPost ? 'Редактировать пост' : 'Новый пост'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название товара</Label>
              <Input
                id="title"
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                placeholder='Нежная композиция "Розовые мечты"'
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL изображения *</Label>
              <Input
                id="imageUrl"
                value={postForm.imageUrl}
                onChange={(e) => setPostForm({ ...postForm, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Цена (рубли)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={postForm.price}
                onChange={(e) => setPostForm({ ...postForm, price: e.target.value })}
                placeholder="3500"
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                value={postForm.description}
                onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                placeholder="Описание товара..."
                rows={3}
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hashtags">Хэштеги (через запятую)</Label>
              <Input
                id="hashtags"
                value={postForm.hashtags}
                onChange={(e) => setPostForm({ ...postForm, hashtags: e.target.value })}
                placeholder="свадебные, розовые, сердце"
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
              />
            </div>
            
            {/* SEO Section */}
            <div className="border-t border-pink-100 pt-4 mt-4">
              <h4 className="font-medium text-gray-700 mb-3">SEO настройки</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={postForm.seoTitle}
                    onChange={(e) => setPostForm({ ...postForm, seoTitle: e.target.value })}
                    placeholder="Заголовок для поисковиков"
                    className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={postForm.seoDescription}
                    onChange={(e) => setPostForm({ ...postForm, seoDescription: e.target.value })}
                    placeholder="Описание для поисковиков"
                    rows={2}
                    className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoKeywords">SEO Keywords</Label>
                  <Input
                    id="seoKeywords"
                    value={postForm.seoKeywords}
                    onChange={(e) => setPostForm({ ...postForm, seoKeywords: e.target.value })}
                    placeholder="ключевые, слова, через, запятую"
                    className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPostDialog(false)}
              className="border-pink-200"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSavePost}
              disabled={createPost.isPending || updatePost.isPending}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
            >
              {(createPost.isPending || updatePost.isPending) ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
