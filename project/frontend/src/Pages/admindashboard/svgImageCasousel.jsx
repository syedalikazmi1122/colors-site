import React,{useState ,useEffect} from "react";

function SvgImageCarousel({ urls, alt, className }) {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      // Only set interval if there's more than one image
      if (urls && urls.length > 1) {
        const intervalId = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % urls.length);
        }, 5000); // Change image every 5 seconds
  
        // Cleanup function to clear the interval when the component unmounts
        // or before the effect runs again if dependencies change
        return () => clearInterval(intervalId);
      }
      // Reset to first image if urls change or become single/empty
      setCurrentIndex(0);
    }, [urls]); // Dependency array includes urls
  
    if (!urls || urls.length === 0) {
      return <div className={`${className} flex items-center justify-center bg-gray-100 text-gray-400`}>No Image</div>; // Placeholder
    }
  
    return (
      <img
        src={urls[currentIndex]}
        alt={alt}
        className={className}
        loading="lazy" // Add lazy loading for potentially many images
      />
    );
  }
  
  export default SvgImageCarousel;