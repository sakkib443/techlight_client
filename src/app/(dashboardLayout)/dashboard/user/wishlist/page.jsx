'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
    FiHeart, FiTrash2, FiShoppingCart, FiArrowRight, FiStar
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { hydrateWishlist, removeFromWishlist, clearWishlist } from '@/redux/wishlistSlice';
import { addToCart } from '@/redux/cartSlice';

export default function UserWishlistPage() {
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    const { items = [] } = useSelector((state) => state.wishlist || {});

    useEffect(() => {
        dispatch(hydrateWishlist());
    }, [dispatch]);

    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark
        ? 'bg-slate-800/50 border-white/5 hover:border-rose-500/20'
        : 'bg-white border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md'
        }`;

    const handleAddToCart = (item) => {
        dispatch(addToCart({
            id: item.id,
            title: item.title,
            price: item.discountPrice || item.price,
            image: item.image,
            type: item.type,
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 ${cardClass}`}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-[#c41e18] flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                        <FiHeart size={24} />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            My Wishlist
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {items.length} {items.length === 1 ? 'course' : 'courses'} saved for later
                        </p>
                    </div>
                </div>
                {items.length > 0 && (
                    <button
                        onClick={() => dispatch(clearWishlist())}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isDark
                            ? 'bg-slate-700 text-slate-200 hover:bg-red-500/20 hover:text-red-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500'
                            }`}
                    >
                        <FiTrash2 size={16} />
                        Clear All
                    </button>
                )}
            </div>

            {/* Empty State */}
            {items.length === 0 ? (
                <div className={`flex flex-col items-center justify-center text-center py-20 px-6 ${cardClass}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 ${isDark ? 'bg-slate-700/50' : 'bg-rose-50'}`}>
                        <FiHeart size={36} className="text-rose-400" />
                    </div>
                    <h2 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Your wishlist is empty
                    </h2>
                    <p className={`text-sm mb-6 max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Browse our courses and tap the heart icon to save the ones you love.
                    </p>
                    <Link
                        href="/courses"
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-[#c41e18] text-white rounded-xl text-sm font-bold shadow-md shadow-rose-500/20 hover:scale-105 transition-all"
                    >
                        Explore Courses
                        <FiArrowRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((item) => (
                        <div key={item.id} className={`overflow-hidden group ${cardClass}`}>
                            {/* Image */}
                            <div className="relative h-44 overflow-hidden">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                        <FiHeart size={32} className="text-slate-400" />
                                    </div>
                                )}
                                <button
                                    onClick={() => dispatch(removeFromWishlist(item.id))}
                                    title="Remove from wishlist"
                                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-rose-500 flex items-center justify-center shadow-md hover:bg-rose-500 hover:text-white transition-all"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                                {item.category && (
                                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 text-white text-[10px] font-semibold rounded-full backdrop-blur-sm">
                                        {item.category}
                                    </span>
                                )}
                            </div>

                            {/* Body */}
                            <div className="p-4 space-y-3">
                                <h3 className={`text-sm font-bold line-clamp-2 min-h-[2.5rem] ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {item.title}
                                </h3>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                            ৳{item.discountPrice || item.price}
                                        </span>
                                        {item.discountPrice && item.price && item.discountPrice !== item.price && (
                                            <span className="text-xs text-slate-400 line-through">৳{item.price}</span>
                                        )}
                                    </div>
                                    {item.rating ? (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                                            <FiStar size={13} className="fill-amber-400 text-amber-400" />
                                            {item.rating}
                                        </span>
                                    ) : null}
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-[#7A85F0] to-[#7A85F0] text-white rounded-lg text-xs font-bold shadow-md shadow-[#7A85F0]/10 hover:scale-[1.02] transition-all"
                                    >
                                        <FiShoppingCart size={15} />
                                        Add to Cart
                                    </button>
                                    <Link
                                        href={`/courses/${item.id}`}
                                        className={`flex items-center justify-center w-10 h-9 rounded-lg transition-all ${isDark
                                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        title="View course"
                                    >
                                        <FiArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
