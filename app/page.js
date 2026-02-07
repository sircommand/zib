'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, Image as ImageIcon, Layers, Settings, LogOut, 
  Search, Bell, Menu, X, Upload, Trash2, Edit, Eye, 
  MoreHorizontal, Share2, ZoomIn, CheckCircle, ChevronRight,
  Sun, Moon, ShoppingBag, Watch, Shirt, Phone, Save
} from 'lucide-react';

// --- MOCK DATABASE & UTILS ---

// Initial Seed Data
const INITIAL_DATA = {
  settings: {
    whatsapp: "+989123456789",
    instagram: "stylepins_official",
    telegram: "@stylepins_channel",
    youtube: "StylePins",
    pinterest: "stylepins_app",
    password: "admin", // Default password
  },
  categories: [
    { id: 'cat_1', name: 'Accessories', parentId: 'root', icon: 'Watch' },
    { id: 'cat_2', name: 'Womens Clothing', parentId: 'root', icon: 'ShoppingBag' },
    { id: 'cat_3', name: 'Mens Clothing', parentId: 'root', icon: 'Shirt' },
    { id: 'cat_4', name: 'Jewelry', parentId: 'root', icon: 'Diamond' },
    { id: 'sub_1', name: 'Handbags', parentId: 'cat_1', icon: '' },
    { id: 'sub_2', name: 'Dresses', parentId: 'cat_2', icon: '' },
  ],
  images: [
    { 
      id: 'img_1', 
      title: 'Emerald Green Handbag', 
      category: 'cat_1', 
      subCategory: 'sub_1', 
      url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', 
      views: 1245, 
      clicks: 45,
      code: 'ACC-GNM-001',
      date: '2023-10-24' 
    },
    { 
      id: 'img_2', 
      title: 'Gold Plated Earrings', 
      category: 'cat_4', 
      subCategory: null, 
      url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', 
      views: 892, 
      clicks: 12,
      code: 'JW-GLD-023',
      date: '2023-10-23' 
    },
    { 
      id: 'img_3', 
      title: 'Casual Denim Jacket', 
      category: 'cat_3', 
      subCategory: null, 
      url: 'https://images.unsplash.com/photo-1576995853123-5a297da40303?auto=format&fit=crop&q=80&w=800', 
      views: 2510, 
      clicks: 120,
      code: 'CLO-MNS-042',
      date: '2023-10-22' 
    },
     { 
      id: 'img_4', 
      title: 'Summer Floral Dress', 
      category: 'cat_2', 
      subCategory: 'sub_2', 
      url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800', 
      views: 3100, 
      clicks: 200,
      code: 'CLO-WMN-088',
      date: '2023-10-21' 
    },
  ],
  stats: {
    visitsToday: 2405,
    visitsYesterday: 1892,
    visitsWeek: 14280,
    visitsMonth: 58421
  }
};

// Database Helper Hook
const useDB = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('stylepins_db');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      localStorage.setItem('stylepins_db', JSON.stringify(INITIAL_DATA));
    }
    setIsInitialized(true);
  }, []);

  const save = (newData) => {
    setData(newData);
    localStorage.setItem('stylepins_db', JSON.stringify(newData));
  };

  return { data, save, isInitialized };
};

const generateImageCode = (categoryName) => {
  const prefix = categoryName ? categoryName.substring(0, 3).toUpperCase() : 'UNK';
  const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
  const randomNums = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${randomChars}-${randomNums}`;
};

// --- COMPONENTS ---

// 1. LOGIN PAGE
const LoginPage = ({ onLogin, db }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple check: username 'admin' and password from DB settings
    if (username === 'admin' && password === db.data.settings.password) {
      onLogin();
    } else {
      setError('Invalid credentials (try admin / admin)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#E60023]">StylePins</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Admin Panel Access</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-[#E60023] outline-none"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-[#E60023] outline-none"
              placeholder="••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-[#E60023] hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors">
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

// 2. ADMIN DASHBOARD LAYOUT & PAGES
const AdminLayout = ({ children, activeTab, setActiveTab, onLogout, darkMode, toggleDarkMode }) => {
  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full z-10 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#E60023] rounded-full flex items-center justify-center text-white font-bold">S</div>
          <span className="text-[#E60023] text-xl font-bold">StylePins</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'categories', icon: Layers, label: 'Categories' },
            { id: 'images', icon: ImageIcon, label: 'Images' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                activeTab === item.id 
                ? 'bg-[#E60023]/10 text-[#E60023]' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen dark:text-white">
        {children}
      </main>
    </div>
  );
};

const AdminDashboardStats = ({ db }) => {
  const stats = [
    { label: 'Total Images', value: db.data.images.length, icon: ImageIcon, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: "Today's Visits", value: db.data.stats.visitsToday, change: '+8.4%', icon: LayoutDashboard, color: 'text-[#E60023]', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Yesterday', value: db.data.stats.visitsYesterday, icon: Layers, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
    { label: 'Weekly Visits', value: db.data.stats.visitsWeek, change: '-2.1%', icon: Search, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Monthly Visits', value: db.data.stats.visitsMonth, change: '+18.3%', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              {stat.change && (
                <span className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              )}
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Simplified Chart Visual */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-bold mb-6">Traffic Overview (Mock)</h3>
        <div className="h-48 flex items-end justify-between gap-2 px-2">
          {[40, 65, 50, 85, 60, 75, 95].map((h, i) => (
            <div key={i} className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg relative group">
              <div 
                className="absolute bottom-0 w-full bg-[#E60023] rounded-t-lg transition-all duration-500" 
                style={{ height: `${h}%` }}
              ></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-gray-400 uppercase">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>
    </div>
  );
};

const AdminSettings = ({ db }) => {
  const [formData, setFormData] = useState(db.data.settings);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('Passwords do not match!');
            return;
        }
        // Update password
        const newSettings = { ...formData, password: formData.newPassword };
        delete newSettings.newPassword;
        delete newSettings.confirmPassword;
        
        db.save({ ...db.data, settings: newSettings });
    } else {
        db.save({ ...db.data, settings: formData });
    }
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold mb-2">Platform Settings</h1>
        <p className="text-gray-500">Manage social links and security.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Share2 className="text-[#E60023]" /> Social Media Connections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['whatsapp', 'instagram', 'telegram', 'youtube', 'pinterest'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1 capitalize text-gray-700 dark:text-gray-300">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-[#E60023] outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
           <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Settings className="text-[#E60023]" /> Security
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">New Password</label>
              <input type="password" name="newPassword" onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-[#E60023] outline-none" />
            </div>
             <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Confirm Password</label>
              <input type="password" name="confirmPassword" onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-[#E60023] outline-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <button type="submit" className="px-8 py-3 rounded-full bg-[#E60023] text-white font-bold hover:bg-red-700 transition-all">Save Changes</button>
            {message && <span className="text-green-500 font-medium">{message}</span>}
        </div>
      </form>
    </div>
  );
};

const AdminCategories = ({ db }) => {
  const [name, setName] = useState('');
  const [parent, setParent] = useState('root');
  // Simple icon selector mock - in real app would be file upload or icon picker
  
  const rootCategories = db.data.categories.filter(c => c.parentId === 'root');
  
  const handleAdd = (e) => {
    e.preventDefault();
    const newCat = {
        id: `cat_${Date.now()}`,
        name,
        parentId: parent,
        icon: parent === 'root' ? 'Tag' : '' // Default icon
    };
    db.save({ ...db.data, categories: [...db.data.categories, newCat] });
    setName('');
    setParent('root');
  };

  const handleDelete = (id) => {
    // Delete category and its subcategories
    const updated = db.data.categories.filter(c => c.id !== id && c.parentId !== id);
    db.save({ ...db.data, categories: updated });
  };

  const getSubCount = (id) => db.data.categories.filter(c => c.parentId === id).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <section className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 sticky top-4">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Layers className="text-[#E60023]" /> Create Category
          </h2>
          <form onSubmit={handleAdd} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Category Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg border dark:bg-gray-900 dark:border-gray-600 outline-none focus:border-[#E60023]" placeholder="e.g. Streetwear" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Parent Category</label>
              <select value={parent} onChange={e => setParent(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border dark:bg-gray-900 dark:border-gray-600 outline-none focus:border-[#E60023]">
                <option value="root">Root (None)</option>
                {rootCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1.5">Icon (Mock Upload)</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-[#E60023]">
                    <Upload className="mx-auto text-gray-400" />
                    <span className="text-xs text-gray-500">Upload SVG/PNG</span>
                </div>
            </div>
            <button type="submit" className="w-full bg-[#E60023] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all">Create Category</button>
          </form>
        </div>
      </section>

      <section className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold">All Categories</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900 text-xs uppercase text-gray-500">
                <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4 text-center">Type</th>
                    <th className="px-6 py-4 text-center">Sub-categories</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {db.data.categories.filter(c => c.parentId === 'root').map(cat => (
                    <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 font-medium">{cat.name}</td>
                        <td className="px-6 py-4 text-center text-xs text-gray-500">Root</td>
                        <td className="px-6 py-4 text-center">
                            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs">{getSubCount(cat.id)} Subs</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={18} />
                             </button>
                        </td>
                    </tr>
                ))}
                {/* Render subcategories indented logic could go here, keeping it simple for now */}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const AdminImages = ({ db }) => {
    const [title, setTitle] = useState('');
    const [cat, setCat] = useState('');
    const [subCat, setSubCat] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const rootCats = db.data.categories.filter(c => c.parentId === 'root');
    const availableSubCats = db.data.categories.filter(c => c.parentId === cat);

    const handleAdd = (e) => {
        e.preventDefault();
        // Mock image upload handling - here we just use the provided URL or a placeholder
        // In a real app, this would be a file upload to S3/Cloudinary
        const finalUrl = imageUrl || 'https://via.placeholder.com/400x600?text=Uploaded+Image';
        
        const newImg = {
            id: `img_${Date.now()}`,
            title,
            category: cat,
            subCategory: subCat || null,
            url: finalUrl,
            views: 0,
            clicks: 0,
            code: generateImageCode(rootCats.find(c => c.id === cat)?.name),
            date: new Date().toISOString().split('T')[0]
        };

        db.save({ ...db.data, images: [newImg, ...db.data.images] });
        setTitle('');
        setCat('');
        setSubCat('');
        setImageUrl('');
    };

    const handleDelete = (id) => {
        db.save({ ...db.data, images: db.data.images.filter(i => i.id !== id) });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <ImageIcon className="text-[#E60023]" /> Add New Image
                    </h2>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-[#E60023] cursor-pointer group">
                             <input type="text" placeholder="Paste Image URL for Demo" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-transparent text-center outline-none text-sm text-gray-500 mb-2" />
                             <Upload className="mx-auto text-gray-400 group-hover:text-[#E60023] transition-colors" size={32} />
                             <p className="text-xs text-gray-400 mt-2">Paste URL or Drag File (Mock)</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Title</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-600 outline-none" />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold mb-1">Category</label>
                            <select value={cat} onChange={e => setCat(e.target.value)} required className="w-full px-3 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-600 outline-none">
                                <option value="">Select Category</option>
                                {rootCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-semibold mb-1">Sub-category</label>
                             <select value={subCat} onChange={e => setSubCat(e.target.value)} disabled={!cat} className="w-full px-3 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-600 outline-none disabled:opacity-50">
                                <option value="">Select Sub-category</option>
                                {availableSubCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <button className="w-full bg-[#E60023] text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-700 transition-transform active:scale-95">Add Image</button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Image List</h2>
                        <div className="bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full flex items-center">
                             <Search size={16} className="text-gray-400" />
                             <input placeholder="Search..." className="bg-transparent border-none outline-none text-sm ml-2 w-32" />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Preview</th>
                                    <th className="px-6 py-4">Details</th>
                                    <th className="px-6 py-4 text-center">Clicks (Modal)</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {db.data.images.map(img => (
                                    <tr key={img.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                                                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold">{img.title}</div>
                                            <div className="text-xs font-mono text-gray-400 mt-1">{img.code}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded-full text-xs font-bold">
                                                <Eye size={12} /> {img.clicks}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDelete(img.id)} className="p-2 text-gray-400 hover:text-red-500">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 3. USER LANDING PAGE (Pinterest Style)
const UserHome = ({ db, onSwitchToAdmin, darkMode, toggleDarkMode }) => {
    const [selectedCat, setSelectedCat] = useState('all');
    const [selectedSub, setSelectedSub] = useState('all');
    const [modalImage, setModalImage] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);

    const rootCats = db.data.categories.filter(c => c.parentId === 'root');
    const subCats = selectedCat !== 'all' ? db.data.categories.filter(c => c.parentId === selectedCat) : [];

    // Filter Images
    const filteredImages = db.data.images.filter(img => {
        if (selectedCat !== 'all' && img.category !== selectedCat) return false;
        if (selectedSub !== 'all' && img.subCategory !== selectedSub) return false;
        return true;
    });

    const handleImageClick = (img) => {
        // Update click stats in DB
        const updatedImages = db.data.images.map(i => i.id === img.id ? { ...i, clicks: i.clicks + 1 } : i);
        db.save({ ...db.data, images: updatedImages });
        setModalImage(img);
        setIsZoomed(false);
    };

    const handleSaveImage = (e, img) => {
        e.stopPropagation();
        alert(`Image ${img.title} saved to your device!`);
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-white dark:bg-[#121212] transition-colors duration-300`}>
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3">
                 <div className="max-w-[2000px] mx-auto flex items-center justify-between gap-4">
                     <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedCat('all')}>
                        <span className="text-[#E60023] font-bold text-2xl tracking-tight">StylePins</span>
                     </div>
                     <div className="hidden md:flex flex-grow max-w-2xl relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-full focus:ring-2 focus:ring-[#E60023]/50 text-gray-700 dark:text-gray-200 outline-none" placeholder="Search for fashion..." />
                     </div>
                     <div className="flex items-center gap-3">
                        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
                             {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                        </button>
                        <button onClick={onSwitchToAdmin} className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-80 transition-opacity">
                            Admin Panel
                        </button>
                     </div>
                 </div>
            </header>

            {/* Category Nav */}
            <nav className="sticky top-[73px] z-30 bg-white dark:bg-[#121212] py-4 px-4 overflow-x-auto hide-scrollbar border-b border-transparent shadow-sm">
                 <div className="flex items-center justify-center gap-2 min-w-max mx-auto">
                    <button 
                        onClick={() => { setSelectedCat('all'); setSelectedSub('all'); }} 
                        className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${selectedCat === 'all' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300'}`}
                    >
                        All
                    </button>
                    {rootCats.map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => { setSelectedCat(cat.id); setSelectedSub('all'); }}
                            className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${selectedCat === cat.id ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                 </div>
                 {/* Sub Categories if parent selected */}
                 {subCats.length > 0 && (
                     <div className="flex items-center justify-center gap-2 min-w-max mx-auto mt-2 animate-in slide-in-from-top-2">
                        {subCats.map(sub => (
                             <button 
                                key={sub.id}
                                onClick={() => setSelectedSub(sub.id)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium border ${selectedSub === sub.id ? 'border-[#E60023] text-[#E60023]' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}
                            >
                                {sub.name}
                            </button>
                        ))}
                     </div>
                 )}
            </nav>

            {/* Masonry Grid */}
            <main className="max-w-[2000px] mx-auto px-4 py-6">
                <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                    {filteredImages.map(img => (
                        <div key={img.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-zoom-in" onClick={() => handleImageClick(img)}>
                            <img src={img.url} alt={img.title} className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                                <div className="flex justify-end">
                                    <button onClick={(e) => handleSaveImage(e, img)} className="bg-[#E60023] text-white px-4 py-2 rounded-full font-bold hover:bg-red-700 transition-colors">Save</button>
                                </div>
                                <div className="flex justify-end gap-2 text-white">
                                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40"><Share2 size={18} /></button>
                                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40"><MoreHorizontal size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {filteredImages.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p>No pins found in this category.</p>
                    </div>
                )}
            </main>

            {/* Image Modal */}
            {modalImage && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setModalImage(null)}>
                    <div className="bg-white dark:bg-[#121212] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        {/* Image Side */}
                        <div className={`w-full md:w-1/2 bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center overflow-hidden cursor-zoom-out`} onClick={() => setIsZoomed(!isZoomed)}>
                            <img 
                                src={modalImage.url} 
                                alt={modalImage.title} 
                                className={`object-contain transition-all duration-300 ${isZoomed ? 'scale-150' : 'w-full h-full'}`} 
                            />
                            {!isZoomed && (
                                <div className="absolute top-4 left-4 bg-black/50 p-2 rounded-full text-white pointer-events-none">
                                    <ZoomIn size={20} />
                                </div>
                            )}
                        </div>

                        {/* Details Side */}
                        <div className="w-full md:w-1/2 p-8 flex flex-col relative dark:text-white">
                            <button onClick={() => setModalImage(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                <X size={24} />
                            </button>
                            
                            <div className="flex-grow mt-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-[#E60023] flex items-center justify-center text-white font-bold">SP</div>
                                    <div>
                                        <h4 className="font-semibold text-sm">StylePins Official</h4>
                                        <p className="text-xs text-gray-500">24k followers</p>
                                    </div>
                                    <button className="ml-auto bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-full font-semibold text-sm hover:bg-gray-300 dark:hover:bg-gray-700">Follow</button>
                                </div>
                                <h1 className="text-2xl font-bold mb-2">{modalImage.title}</h1>
                                <p className="text-gray-500 text-sm mb-6">Uploaded on {modalImage.date}</p>
                                
                                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 mb-6 flex justify-between items-center">
                                    <span className="text-xs font-mono text-gray-400">Image Code:</span>
                                    <span className="font-mono font-bold tracking-widest text-[#E60023]">{modalImage.code}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <button onClick={() => alert('Saved!')} className="flex-1 bg-[#E60023] text-white py-3 rounded-full font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                                        <Save size={20} /> Save
                                    </button>
                                    <button onClick={() => alert('Shared link copied!')} className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white py-3 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                                        <Share2 size={20} /> Share
                                    </button>
                                </div>
                                <a 
                                    href={`https://wa.me/${db.data.settings.whatsapp.replace('+', '')}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-full bg-[#25D366] text-white py-3 rounded-full font-bold hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                                >
                                    <Phone size={20} /> Contact / Order via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN APP ENTRY POINT ---

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // home, admin-login, admin-dashboard
  const [adminTab, setAdminTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  
  // Initialize Database Mock
  const db = useDB();

  if (!db.isInitialized) return <div className="flex h-screen items-center justify-center">Loading StylePins DB...</div>;

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Router Logic
  if (currentView === 'home') {
    return (
        <UserHome 
            db={db} 
            onSwitchToAdmin={() => setCurrentView('admin-login')} 
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
        />
    );
  }

  if (currentView === 'admin-login') {
    return (
        <LoginPage 
            db={db}
            onLogin={() => setCurrentView('admin-dashboard')} 
        />
    );
  }

  // Admin Dashboard Views
  return (
    <AdminLayout 
        activeTab={adminTab} 
        setActiveTab={setAdminTab} 
        onLogout={() => setCurrentView('home')}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
    >
        {adminTab === 'dashboard' && <AdminDashboardStats db={db} />}
        {adminTab === 'settings' && <AdminSettings db={db} />}
        {adminTab === 'categories' && <AdminCategories db={db} />}
        {adminTab === 'images' && <AdminImages db={db} />}
    </AdminLayout>
  );
}