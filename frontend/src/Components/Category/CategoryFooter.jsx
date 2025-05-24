"use client"
import { useTranslation } from "../../Context/TranslationContext"

const CategoryFooter = () => {
  const { translations } = useTranslation();
  
  return (
    <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold mb-4">{translations.aboutCategory || "About This Category"}</h2>
          <p className="text-gray-600 mb-4">
            {translations.categoryDescription || "Discover our curated collection of premium wallpapers, murals, and wall decor. Each piece is carefully selected to bring beauty and character to your space."}
          </p>
          <p className="text-gray-600 mb-4">
            {translations.categoryFeatures || "Our collection features a wide range of styles, from modern geometric patterns to timeless floral designs. Whether you're looking to create a bold statement wall or add subtle texture to your room, you'll find the perfect piece here."}
          </p>
          <p className="text-gray-600">
            {translations.categoryQuality || "All our wallpapers and murals are made with high-quality materials, ensuring durability and easy installation. We offer both traditional and peel-and-stick options to suit your needs."}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CategoryFooter