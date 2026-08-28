import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MenuItems() {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [categoryId, setCategoryId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const fetchData = async () => {
        try {
            const itemsRes = await axios.get('http://localhost:5000/api/menu-items');
            setMenuItems(itemsRes.data);
            const catsRes = await axios.get('http://localhost:5000/api/categories');
            setCategories(catsRes.data);
        } catch (error) { console.error('Error fetching data:', error); }
    };
    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('category_id', categoryId);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        if (imageFile) formData.append('image', imageFile);
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/menu-items/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                alert('Menu item updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/menu-items', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                alert('Menu item added successfully!');
            }
            setEditingId(null); setCategoryId(''); setName(''); setDescription(''); setPrice(''); setImageFile(null);
            document.getElementById('imageInput').value = '';
            fetchData();
        } catch (error) { console.error('Error saving menu item:', error); alert('Failed to save menu item.'); }
    };

    const handleEdit = (item) => {
        setEditingId(item.id); setCategoryId(item.category_id); setName(item.name);
        setDescription(item.description); setPrice(item.price); setImageFile(null);
        document.getElementById('imageInput').value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            try {
                await axios.delete(`http://localhost:5000/api/menu-items/${id}`);
                alert('Menu item deleted successfully!');
                fetchData();
            } catch (error) { console.error('Error deleting menu item:', error); alert('Failed to delete menu item.'); }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null); setCategoryId(''); setName(''); setDescription(''); setPrice(''); setImageFile(null);
        document.getElementById('imageInput').value = '';
    };

    const iClass = "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-200";
    const lClass = "block text-[10px] font-bold tracking-[0.15em] uppercase text-white/60 mb-2";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Menu Items Management</h1>
                <p className="text-gray-400 text-sm mt-1">{menuItems.length} items across {categories.length} categories</p>
            </div>

            {/* Form */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-orange-950 to-stone-900 p-6 shadow-xl">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                    <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                        <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">{editingId ? '✏️' : '➕'}</span>
                        {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={lClass}>Select Category</label>
                            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition-all [&>option]:text-gray-900 [&>option]:bg-white">
                                <option value="" disabled>-- Select a Category --</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={lClass}>Item Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g., Prawn Fried Rice" className={iClass} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={lClass}>Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows="2" placeholder="Enter description..." className={`${iClass} resize-none`} />
                        </div>
                        <div>
                            <label className={lClass}>Price (Rs)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required placeholder="e.g., 1500" className={iClass} />
                        </div>
                        <div>
                            <label className={lClass}>Upload Image (optional)</label>
                            <input id="imageInput" type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-white/20 file:text-white hover:file:bg-white/30 transition-all" />
                        </div>
                        <div className="sm:col-span-2 flex gap-3">
                            <button type="submit" className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full shadow-lg shadow-orange-900/30 transition-all active:scale-[0.98]">
                                {editingId ? 'Update Menu Item' : 'Add Menu Item'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full border border-white/20 transition-all">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-sm">🍽️</span>
                        Existing Menu Items
                    </h2>
                    <span className="text-xs text-gray-400 font-medium">{menuItems.length} total</span>
                </div>
                {menuItems.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🍽️</div>
                        <p className="text-gray-500 font-medium">No menu items yet</p>
                        <p className="text-gray-400 text-sm mt-1">Add your first item using the form above.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-50">
                        {menuItems.map(item => (
                            <li key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors gap-4">
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    {item.image_url
                                        ? <img src={item.image_url} alt={item.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0 border border-gray-100 shadow-sm" />
                                        : <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🍽️</div>
                                    }
                                    <div className="min-w-0">
                                        <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-orange-500 font-semibold mt-0.5">Rs. {Number(item.price).toLocaleString()}</p>
                                        {item.description && <p className="text-xs text-gray-400 truncate mt-0.5 max-w-xs">{item.description}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => handleEdit(item)} className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 text-xs font-bold rounded-full hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}