// const Footer = () => {
//     return (
//       <footer className="bg-[#f0eee9] p-4 sm:p-6 md:p-10 text-gray-800 py-6 md:py-8">
//         <div className="container mx-auto px-4">
//           {/* Grid layout - responsive from 1 column on mobile to 2 on tablet to 4 on desktop */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//             {/* Shop Column */}
//             <div className="mb-6 sm:mb-0">
//               <h4 className="font-semibold mb-3 md:mb-4">Shop</h4>
//               <ul>
//                 <li className="mb-2">
//                   <a href="#" className="text-gray-600 hover:text-gray-900">
//                     All Wallpapers
//                   </a>
//                 </li>
//                 <li className="mb-2">
//                   <a href="#" className="text-gray-600 hover:text-gray-900">
//                     Shop By Inspiration
//                   </a>
//                 </li>
//                 <li className="mb-2">
//                   <a href="#" className="text-gray-600 hover:text-gray-900">
//                     Measuring Guide
//                   </a>
//                 </li>
//                 <li className="mb-2">
//                   <a href="#" className="text-gray-600 hover:text-gray-900">
//                     How To
//                   </a>
//                 </li>
//                 <li className="mb-2">
//                   <a href="#" className="text-gray-600 hover:text-gray-900">
//                     Materials
//                   </a>
//                 </li>
//                 <li className="mb-2">
//                   <a href="#" className="text-gray-600 hover:text-gray-900">
//                     FAQ
//                   </a>
//                 </li>
//               </ul>
//             </div>
  
//             {/* Company Column */}
//             <div className="mb-6 sm:mb-0">
//               <h4 className="font-semibold mb-3 md:mb-4">Company</h4>
//               <ul>
//                 <li className="mb-2">
//                   <a href="#" className="text-gray-600 hover:text-gray-900">
//                     About Us
//                   </a>
//                 </li>
//                 <li className="mb-2">
//                   <a href="#" className="text-gray-600 hover:text-gray-900">
//                     Trade Program
//                   </a>
//                 </li>
//                 <li className="mb-2">
//                   <a href="#" className="text-gray-600 hover:text-gray-900">
//                     Collab Program
//                   </a>
//                 </li>
//               </ul>
//             </div>
  
//             {/* Customer Support Column */}
//             <div className="mb-6 sm:mb-0">
//               <h4 className="font-semibold mb-3 md:mb-4">Customer Support</h4>
//               <ul>
//                 <li className="mb-2">
//                   <a href="#" className="text-gray-600 hover:text-gray-900">
//                     Love It Guarantee
//                   </a>
//                 </li>
//                 <li className="mb-2">
//                   <a href="#" className="text-gray-600 hover:text-gray-900">
//                     Order Assistance
//                   </a>
//                 </li>
//                 <li className="mb-2">
//                   <a href="#" className="text-gray-600 hover:text-gray-900">
//                     Shipping Policy
//                   </a>
//                 </li>
//                 <li className="mb-2">
//                   <a href="#" className="text-gray-600 hover:text-gray-900">
//                     Returns & Exchanges
//                   </a>
//                 </li>
//               </ul>
//             </div>
  
//             {/* Need Help Column */}
//             <div>
//               <h4 className="font-semibold mb-3 md:mb-4">Need help?</h4>
//               <p className="text-gray-600 mb-3 md:mb-4">
//                 Chat with us or call us at
//                 <br />
//                 1.800.325.5705
//               </p>
//               <p className="text-gray-600">Mon-Fri, 9AM - 5PM MST. Closed all major holidays</p>
//             </div>
//           </div>
  
//           {/* Bottom Section - stack on mobile, row on desktop */}
//           <div className="container mx-auto px-4 mt-6 md:mt-8 pt-4 border-t flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//             <div className="text-gray-600 text-sm order-3 md:order-1">
//               © 2020-2025, Love Vs Design. All rights reserved.
//             </div>
  
//             <div className="flex flex-wrap gap-x-4 gap-y-2 order-2 md:order-2">
//               <a href="#" className="text-gray-600 text-sm hover:text-gray-900">
//                 Accessibility Statement
//               </a>
//               <a href="#" className="text-gray-600 text-sm hover:text-gray-900">
//                 Privacy Policy
//               </a>
//             </div>
  
//             <div className="flex flex-wrap gap-3 order-1 md:order-3 mb-4 md:mb-0">
//               <img src="/placeholder.svg" alt="Discover" className="h-5" />
//               <img src="https://cdn.worldvectorlogo.com/logos/google-pay-2.svg" alt="Google Pay" className="h-5" />
//               <img
//                 src="https://play-lh.googleusercontent.com/q-t4T9ViJkLJsUSNzF4G8h7L9tTjpIlPxf_jFzjdaG6vBcRVJn9zZbkxElKJxCHiJw"
//                 alt="Amex"
//                 className="h-5"
//               />
//               <img
//                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvGspplJJLok3PvZdIoyIpKQ6q-TtIEy5PzQ&s"
//                 alt="Visa"
//                 className="h-5"
//               />
//               <img
//                 src="https://download.logo.wine/logo/Apple_Pay/Apple_Pay-Logo.wine.png"
//                 alt="Apple Pay"
//                 className="h-5"
//               />
//             </div>
//           </div>
//         </div>
//       </footer>
//     )
//   }
  
//   export default Footer
  
  
import React from 'react';
import { 
  Instagram, 
  TicketIcon, 
  Pinterest, 
  Facebook, 
  Youtube, 
  Linkedin 
} from 'lucide-react';

const Footer = () => {
  const socialIcons = [
    { Icon: Instagram, href: '#' },
    { Icon: TicketIcon, href: '#' },
    { Icon: TicketIcon, href: '#' },
    { Icon: Facebook, href: '#' },
    { Icon: Youtube, href: '#' },
    { Icon: Linkedin, href: '#' }
  ];

  const footerSections = {
    'Become a McGee VIP': {
      description: 'Get early access to sales, exclusive offers and more when you sign up for our newsletter.',
      signupSection: true
    },
    'Shop': [
      'About Us', 'Designer Trade', 'Careers', 'Affiliate', 
      'Registry', 'Rewards', 'Reviews'
    ],
    'Customer Service': [
      'Help Center', 'Track Your Order', 'Shipping & Returns', 
      'Contact Us', 'Gift Cards', 'Affirm Financing', 'Accessibility'
    ],
    'Resources': [
      'Request Swatches', 'Artwork Guide', 'Fabric Guide', 
      'Fabric Care Guide', 'Rug Guide', 'Pillow Guide', 
      'Wallpaper Guide', 'Catalogue Request'
    ],
    'Company': [
      'Terms of Service', 'Privacy Policy', 'Accessibility'
    ]
  };

  return (
    <footer className="bg-gray-100 text-gray-800 py-20 px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
        {/* VIP Sign Up Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Become a McGee VIP</h3>
          <p className="text-sm text-gray-600 mb-4">
            Get early access to sales, exclusive offers and more when you sign up for our newsletter.
          </p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="flex-grow border border-gray-300 px-3 py-2 text-sm"
            />
            <button className="bg-black text-white px-4 py-2 text-sm">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You agree to our <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms of Service</a>
          </p>
          
          {/* Social Icons */}
          <div className="flex space-x-4 mt-6">
            {socialIcons.map(({ Icon, href }, index) => (
              <a 
                key={index} 
                href={href} 
                className="text-gray-600 hover:text-black"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Other Sections */}
        {Object.entries(footerSections)
          .filter(([key]) => key !== 'Become a McGee VIP')
          .map(([sectionTitle, sectionItems]) => (
            <div key={sectionTitle}>
              <h3 className="text-lg font-semibold mb-4">{sectionTitle}</h3>
              {Array.isArray(sectionItems) && (
                <ul className="space-y-2">
                  {sectionItems.map((item, index) => (
                    <li key={index}>
                      <a 
                        href="#" 
                        className="text-sm text-gray-600 hover:text-black"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-12 border-t pt-6 text-sm text-gray-500 flex justify-between items-center">
        <p>© 2025 - McGee & Co. All Rights Reserved | <a href="#" className="underline">Privacy Policy</a> | <a href="#" className="underline">Terms & Conditions</a></p>
        <div className="flex space-x-4">
          <span>STUDIO MCGEE</span>
          <span>MCGEE & CO.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;