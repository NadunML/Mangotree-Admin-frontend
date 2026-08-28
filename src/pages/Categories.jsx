import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        if (imageFile) formData.append('image', imageFile);
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/categories/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                alert('Category updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                alert('Category added successfully!');
            }
            setEditingId(null); setName(''); setImageFile(null);
            document.getElementById('categoryImageInput').value = '';
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category.');
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id); setName(category.name); setImageFile(null);
        document.getElementById('categoryImageInput').value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        const confirmMsg = "WARNING: Deleting this category will also DELETE ALL MENU ITEMS inside it!\n\nAre you sure you want to proceed?";
        if (window.confirm(confirmMsg)) {
            try {
                await axios.delete(`http://localhost:5000/api/categories/${id}`);
                alert('Category and its items deleted successfully!');
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Failed to delete category.');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null); setName(''); setImageFile(null);
        document.getElementById('categoryImageInput').value = '';
    };

    const inputClass = "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-200";
    const labelClass = "block text-[10px] font-bold tracking-[0.15em] uppercase text-white/60 mb-2";

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Category Management</h1>
                <p className="text-gray-400 text-sm mt-1">{categories.length} categories configured</p>
            </div>

            {/* Form card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-orange-950 to-stone-900 p-6 shadow-xl">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                    <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                        <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-base">
                            {editingId ? '✏️' : '➕'}
                        </span>
                        {editingId ? 'Edit Category' : 'Add New Category'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Category Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g., Seafood" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Upload Image (optional)</label>
                            <input id="categoryImageInput" type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-white/20 file:text-white hover:file:bg-white/30 transition-all" />
                        </div>
                        <div className="sm:col-span-2 flex gap-3">
                            <button type="submit" className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full shadow-lg shadow-orange-900/30 transition-all duration-200 active:scale-[0.98]">
                                {editingId ? 'Update Category' : 'Add Category'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full transition-all duration-200 border border-white/20">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Categories list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-sm">🏷️</span>
                        Existing Categories
                    </h2>
                    <span className="text-xs text-gray-400 font-medium">{categories.length} total</span>
                </div>

                {categories.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🏷️</div>
                        <p className="text-gray-500 font-medium">No categories yet</p>
                        <p className="text-gray-400 text-sm mt-1">Add your first category using the form above.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-50">
                        {categories.map((cat, idx) => (
                            <li key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                                <div className="flex items-center gap-4 min-w-0">
                                    {cat.image ? (
                                        <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded-xl flex-shrink-0 border border-gray-100 shadow-sm" />
                                    ) : (
                                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏷️</div>
                                    )}
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{cat.name}</p>
                                        <p className="text-xs text-gray-400">ID #{cat.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => handleEdit(cat)} className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 text-xs font-bold rounded-full hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200">
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