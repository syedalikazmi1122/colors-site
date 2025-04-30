export function ProductGrid({ categoryData }) {
  const products = categoryData.map((item) => ({
    id: item.id,
    name: item.title,
    price: item.price,
    image: item.url[0]||item.url,
    slug: item.slug,
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
      {products?.map((product) => (
        <div key={product.id} className="group">
          <a
            href={`/products/${product.slug}`}
            className="flex flex-col items-center justify-center bg-white rounded-md shadow-sm hover:shadow-lg transition-shadow duration-200 p-4"
          >
            <div className="relative mb-4">
              {/* Display SVG or fallback to placeholder */}
              <img
                src={product.image || "/placeholder.svg"} // Use the SVG URI or a placeholder
                alt={product.name} // Use product name for accessibility
                className="w-full aspect-square object-cover rounded-sm"
              />
            </div>
            <h3 className="text-sm text-gray-900 group-hover:text-gray-600 transition-colors duration-200 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-900 mt-1">${product.price.toFixed(2)}</p>
          </a>
        </div>
      ))}
    </div>
  );
}