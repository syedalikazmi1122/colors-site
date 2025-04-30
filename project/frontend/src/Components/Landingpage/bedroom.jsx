import React from 'react';

const BedroomRefresh = () => {
  const colors = [
    { name: "SILK", color: "#D5D5D5" },
    { name: "SALT", color: "#D6E0DC" },
    { name: "WHITE", color: "#FFFFFF" },
    { name: "MIST", color: "#C5CAC3" },
  ];

  return (
    <div className="py-6 sm:py-10 md:py-16 px-4 sm:px-8 bg-white">
      <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row lg:items-start lg:gap-8 xl:gap-16">
        {/* Image - Full width on mobile, 2/3 on desktop */}
        <div className="w-full lg:w-2/3 mb-6 lg:mb-0 overflow-hidden rounded-sm">
          <img
            src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
            alt="Bedroom with Prairie Wallpaper"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Content - Full width on mobile, 1/3 on desktop */}
        <div className="w-full lg:w-1/3 space-y-4 md:space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light font-serif text-gray-800 lowercase">refresh your</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase font-serif text-gray-900">BEDROOM</h3>
          </div>

          <button className="bg-gray-800 hover:bg-black text-white px-4 sm:px-6 py-2 sm:py-3 text-sm tracking-wider transition-colors font-serif">
            SHOP NOW
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-4 border-t pt-4 md:pt-6 mt-4 md:mt-6">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
              alt="Gracie"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-xs   sm:text-sm text-gray-800 font-serif">
                "Bedroom wall got an upgrade and I am so happy with it!! Check out this gorgeous wallpaper from Love Vs
                Design - super easy to install and great quality."
              </p>
              <p className="text-xs text-gray-500 mt-1 md:mt-2 font-serif">@spacelivingrace</p>
            </div>
          </div>

          <div className="mt-4 md:mt-6">
            {/* <h4 className="text-xs sm:text-sm text-gray-800 mb-2 md:mb-4 font-serif">GRACIE'S CUSTOM COLORS</h4> */}
            {/* <div className="flex flex-wrap gap-3 md:gap-4">
              {colors.map((color) => (
                <div key={color.name} className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color.color }}
                  />
                  <span className="text-xs mt-1 md:mt-2 text-gray-700 font-serif">{color.name}</span>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedroomRefresh;