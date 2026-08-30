import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance'; // Secure instance handling tokens
import { Tag, Pencil, Plus } from '../icons';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [editingId,  setEditingId]  = useState(null);
    const [name,       setName]       = useState('');
    const [imageFile,  setImageFile]  = useState(null);

    const fetchCategories = async () => {
        try {
            // Using axiosInstance and relative paths
            const res = await axiosInstance.get('/categories');
            setCategories(res.data);
        } catch (e) { console.error(e); }
    };
    
    useEffect(() => { fetchCategories(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('name', name);
        if (imageFile) fd.append('image', imageFile);
        
        try {
            if (editingId) {
                await axiosInstance.put(`/categories/${editingId}`, fd, { 
                    headers: { 'Content-Type': 'multipart/form-data' } 
                });
            } else {
                await axiosInstance.post('/categories', fd, { 
                    headers: { 'Content-Type': 'multipart/form-data' } 
                });
            }
            
            setEditingId(null); setName(''); setImageFile(null);
            document.getElementById('categoryImageInput').value = '';
            fetchCategories();
        } catch (e) { console.error(e); }
    };

    const handleEdit = (cat) => {
        setEditingId(cat.id); setName(cat.name); setImageFile(null);
        document.getElementById('categoryImageInput').value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('WARNING: Deleting this category will also DELETE ALL MENU ITEMS inside it!\n\nAre you sure?')) {
            try {
                await axiosInstance.delete(`/categories/${id}`);
                fetchCategories();
            } catch (e) { console.error(e); }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null); setName(''); setImageFile(null);
        document.getElementById('categoryImageInput').value = '';
    };

    const iClass = "w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all";
    const lClass = "block text-[10px] font-bold tracking-[0.15em] uppercase text-stone-500 mb-1.5";

    return (
        <div className="space-y-6">

            {/* Form Card */}
            <div className="rounded-2xl p-[2px] bg-gradient-to-r from-orange-500 to-green-500 shadow-xl">
                <div className="relative overflow-hidden rounded-[14px] p-6 bg-white h-full">
                    <h2 className="text-sm font-bold text-stone-900 mb-5 flex items-center gap-2">
                        <span className="w-8 h-8 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center">
                            {editingId ? <Pencil className="w-4 h-4 text-orange-500" /> : <Plus className="w-4 h-4 text-orange-500" />}
                        </span>
                        {editingId ? 'Edit Category' : 'Add New Category'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={lClass}>Category Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g., Seafood Special" className={iClass} />
                        </div>
                        <div>
                            <label className={lClass}>Upload Image (optional)</label>
                            <input id="categoryImageInput" type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                                className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-600 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-all cursor-pointer" />
                        </div>
                        <div className="sm:col-span-2 flex gap-3 pt-1">
                            <button type="submit" className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98]">
                                {editingId ? 'Update Category' : 'Add Category'}
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

            {/* List Card */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                    <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <span className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Tag className="w-3.5 h-3.5 text-orange-500" />
                        </span>
                        Existing Categories
                    </h2>
                    <span className="text-xs text-stone-500 font-semibold bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
                        {categories.length} Total
                    </span>
                </div>

                {categories.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Tag className="w-8 h-8 text-orange-200" />
                        </div>
                        <p className="text-stone-700 font-bold">No categories yet</p>
                        <p className="text-stone-400 text-sm mt-1">Add your first category using the form above.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-stone-50">
                        {categories.map(cat => (
                            <li key={cat.id} className="flex items-center justify-between px-6 py-4 bg-white hover:bg-orange-50/30 transition-colors">
                                <div className="flex items-center gap-4 min-w-0">
                                    {cat.image
                                        ? <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded-xl flex-shrink-0 border border-stone-100 shadow-sm" />
                                        : <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Tag className="w-5 h-5 text-orange-300" />
                                          </div>
                                    }
                                    <div>
                                        <p className="font-bold text-stone-900 text-sm">{cat.name}</p>
                                        <p className="text-xs text-stone-400 mt-0.5">ID #{cat.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => handleEdit(cat)}
                                        className="px-4 py-1.5 border-2 border-orange-500 text-orange-500 text-xs font-bold rounded-full hover:bg-orange-500 hover:text-white transition-all duration-200">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)}
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