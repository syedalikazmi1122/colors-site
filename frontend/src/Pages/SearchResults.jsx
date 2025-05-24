import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import sendRequest from '../Utils/apirequest';
import { useTranslation } from 'react-i18next';

const SearchResults = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const query = searchParams.get('q');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const response = await sendRequest(`get`,`/search?query=${query}`,{});
                setResults(response.data.data);
                console.log(response.data.data);    
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchResults();
        }
    }, [query]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
        <Navbar/>
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">
                {t('search.resultsFor', { query })}
            </h1>
            
            {results.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">{t('search.noResults')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {results.map((product) => (
                        <Link 
                            to={`/products/${product.slug}`} 
                            key={product._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="aspect-w-1 aspect-h-1">
                                <img 
                                    src={product.url[0]} 
                                    alt={product?.title}
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {product?.title?.en}
                                </h3>
                                <p className="text-gray-600 mb-2">
                                    {product.category}
                                </p>
                                <p className="text-blue-600 font-bold">
                                    ${product.price}
                                </p>
                                {product.editablecolors && product.editablecolors.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {product.editablecolors.map((color, index) => (
                                            <span 
                                                key={index}
                                                className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                                            >
                                                {color}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
        <Footer/>
        </>
    );
};

export default SearchResults; 