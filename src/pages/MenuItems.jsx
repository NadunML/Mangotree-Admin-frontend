import { useState, useEffect } from 'react';
import axios from 'axios';
import { UtensilsCrossed, Pencil, Plus } from '../icons';

export default function MenuItems() {
    const [menuItems,   setMenuItems]   = useState([]);
    const [categories,  setCategories]  = useState([]);
    const [editingId,   setEditingId]   = useState(null);
    const [categoryId,  setCategoryId]  = useState('');
    const [name,        setName]        = useState('');
    const [description, setDescription] = useState('');
    const [price,       setPrice]       = useState('');
    const [imageFile,   setImageFile]   = useState(null);

    const fetchData = async () => {
        try {
            const [itemsRes, catsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/menu-items'),
                axios.get('http://localhost:5000/api/categories'),
            ]);
            setMenuItems(itemsRes.data);
            setCategories(catsRes.data);
        } catch (e) { console.error(e); }
    };
    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('category_id', categoryId); fd.append('name', name);
        fd.append('description', description); fd.append('price', price);
        if (imageFile) fd.append('image', imageFile);
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/menu-items/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await axios.post('http://localhost:5000/api/menu-items', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            setEditingId(null); setCategoryId(''); setName(''); setDescription(''); setPrice(''); setImageFile(null);
            document.getElementById('imageInput').value = '';
            fetchData();
        } catch (e) { console.error(e); }
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
                fetchData();
            } catch (e) { console.error(e); }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null); setCategoryId(''); setName(''); setDescription(''); setPrice(''); setImageFile(null);
        document.getElementById('imageInput').value = '';
    };

    const iClass = "w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all";
    const lClass = "block text-[10px] font-bold tracking-[0.15em] uppercase text-stone-500 mb-1.5";

    return (
        <div className="space-y-6">

            {/* Form Card — White with Orange & Green Border */}
            <div className="rounded-2xl p-[2px] bg-gradient-to-r from-orange-500 to-green-500 shadow-xl">
                <div className="relative overflow-hidden rounded-[14px] p-6 bg-white h-full">
                    <h2 className="text-sm font-bold text-stone-900 mb-5 flex items-center gap-2">
                        <span className="w-8 h-8 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center">
                            {editingId ? <Pencil className="w-4 h-4 text-orange-500" /> : <Plus className="w-4 h-4 text-orange-500" />}
                        </span>
                        {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={lClass}>Select Category</label>
                            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required
                                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all [&>option]:text-stone-900 [&>option]:bg-white">
                                <option value="" disabled>-- Select a Category --</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={lClass}>Item Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g., Special Seafood Rice" className={iClass} />
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
                                className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-600 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-all cursor-pointer" />
                        </div>
                        <div className="sm:col-span-2 flex gap-3 pt-1">
                            <button type="submit" className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98]">
                                {editingId ? 'Update Menu Item' : 'Add Menu Item'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit}
                                    className="flex-1 py-3 border border-stone-200 text-stone-600 font-bold text-sm rounded-xl hover:bg-stone-50 transition-all">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* List Card — White */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                    <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <span className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" />
                        </span>
                        Existing Menu Items
                    </h2>
                    <span className="text-xs text-stone-500 font-semibold bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
                        {menuItems.length} Total
                    </span>
                </div>

                {menuItems.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <UtensilsCrossed className="w-8 h-8 text-orange-200" />
                        </div>
                        <p className="text-stone-700 font-bold">No menu items yet</p>
                        <p className="text-stone-400 text-sm mt-1">Add your first item using the form above.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-stone-50">
                        {menuItems.map(item => (
                            <li key={item.id} className="flex items-center justify-between px-6 py-4 bg-white hover:bg-orange-50/30 transition-colors gap-4">
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    {item.image_url
                                        ? <img src={item.image_url} alt={item.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0 border border-stone-100 shadow-sm" />
                                        : <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <UtensilsCrossed className="w-6 h-6 text-orange-200" />
                                          </div>
                                    }
                                    <div className="min-w-0">
                                        <p className="font-bold text-stone-900 text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-orange-500 font-bold mt-0.5">Rs. {Number(item.price).toLocaleString()}</p>
                                        {item.description && <p className="text-xs text-stone-400 truncate mt-0.5 max-w-xs">{item.description}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => handleEdit(item)}
                                        className="px-4 py-1.5 border-2 border-orange-500 text-orange-500 text-xs font-bold rounded-full hover:bg-orange-500 hover:text-white transition-all duration-200">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(item.id)}
                                        className="px-4 py-1.5 border-2 border-stone-200 text-stone-500 text-xs font-bold rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200">
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}