import React, { useEffect, useState } from 'react';
import { Heart, Trash2, Share2 } from 'lucide-react';
import Footer from '../../Components/Footer';
import Navbar from '../../Components/Navbar';
import sendRequest from '../../Utils/apirequest';
import toast, { Toaster } from 'react-hot-toast';


export function Wishlist() {
    const [Items, setItems] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await sendRequest("get", "/wishlist", null);
                console.log("Wishlist Items:", response.data);
                setItems(response.data.items);
            } catch (error) {
                console.error("Error fetching wishlist items:", error);
            }
        };
        fetchData();
    }, []);

    const [selectedItems, setSelectedItems] = useState(new Set());

    const handleRemoveItem = async (id) => {
        const response = await sendRequest("delete", "/wishlist/" + id, {});
        console.log("response", response);
        if (response.status === 200) {
            console.log("Item removed from wishlist:", id);
            toast.success("Item removed from wishlist");
        } else {
            console.error("Error removing item from wishlist:", response.statusText);
        }
        // Remove item from the wishlist
        setItems(Items.filter(item => item.productId._id !== id));
        setSelectedItems(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const handleSelectItem = (id) => {
        setSelectedItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };


    const handleMoveToCart = (items) => {
        // Implement move to cart functionality
        console.log('Move to cart:', items);
    };

    const selectedItemsList = Items.filter(item => selectedItems.has(item?._id));

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-serif">My Wishlist</h1>
                        <p className="text-gray-600 mt-2">{Items.length} items saved</p>
                    </div>

                </div>

                {Items.length > 0 ? (
                    <>
                        {
                            console.log(Items, "itemsdd")
                        }
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Items.map((item) => (
                                <div
                                    key={item.id} className="group relative">
                            {
                                console.log(item, "item")
                            }
                                    <div className="relative aspect-square mb-4">
                                        <img
                                            src={item.productId.url[0]}
                                            alt={item.productId.title}
                                            className="w-full h-full object-cover rounded-sm"
                                        />
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.has(item.productId._id)}
                                            onChange={() => handleSelectItem(item.productId._id)}
                                            className="absolute top-4 left-4 h-5 w-5 rounded border-gray-300"
                                        />
                                        <button
                                            onClick={() => handleRemoveItem(item.productId._id)}
                                            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                                        >
                                            <Trash2 className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {item.title}
                                        </h3>
                                        {
                                            console.log("item", item)
                                        }
                                        <p className="text-sm text-gray-500">{item.productId.category}</p>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg font-medium text-gray-900">
                                                ${item.productId.price}
                                            </span>
                                            <a
                                                href={`/products/${item.productId.slug}`}
                                                className='p-2 bg-gray-900 text-white rounded-full shadow-md hover:bg-gray-800'
                                            >
                                                Open Product
                                            </a>
                                        </div>

                                    </div>


                                </div>
                            ))}
                        </div>

                        {selectedItems.size > 0 && (
                            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                                    <div>
                                        <span className="text-sm text-gray-600">
                                            {selectedItems.size} items selected
                                        </span>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => {
                                                setItems(Items.filter(item => !selectedItems.has(item.id)));
                                                setSelectedItems(new Set());
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Remove Selected
                                        </button>
                                        <button
                                            onClick={() => handleMoveToCart(selectedItemsList)}
                                            className="px-4 py-2 bg-gray-900 text-white rounded-sm text-sm font-medium hover:bg-gray-800"
                                        >
                                            Move Selected to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-600">
                            Browse our collection and add items you love to your wishlist
                        </p>

                    </div>
                )}
            </div>
            <Toaster />
            <Footer />
        </>
    );
}