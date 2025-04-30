
import Image1 from "./../../../src/Assets/1.jpg"
const CustomSamples = () => {
    return (
      <div className="flex items-center justify-center py-10 md:py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-[1200px] w-full flex flex-col lg:flex-row lg:items-center lg:space-x-8 xl:space-x-16">
          {/* Image - Full width on mobile, 1/2 on desktop */}
          <div className="h w-full lg:w-1/2 mb-8 lg:mb-0">
            <img
              src={Image1}
              alt="Woman holding wallpaper sample"
              className="w-full object-cover"
            />
          </div>
  
          {/* Text Content - Full width on mobile, 1/2 on desktop */}
          <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 lowercase font-serif">
                large custom
              </h2>
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase text-gray-900 font-serif">SAMPLES</h3>
            </div>
  
            <p className="text-sm md:text-base text-gray-600 font-serif">
              Sample all of our materials in the custom colors of your choice for only $6. Add on our large color swatches
              to sample up to 8 colors in your home.
            </p>
  
            <button className="text-white px-4 sm:px-6 py-2 sm:py-3 text-sm tracking-wider bg-black hover:ring-offset-black transition-colors font-serif">
              SHOP NOW
            </button>
  
            <p className="text-xs text-gray-500 italic">real customer photo by @bcouturephoto</p>
          </div>
        </div>
      </div>
    )
  }
  
  export default CustomSamples
  
  