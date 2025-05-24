"use client"
import { Instagram, Twitter, PinIcon as Pinterest, Facebook, Youtube, Linkedin } from "lucide-react"
import sendRequest from "../../Utils/apirequest"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("")

  const socialIcons = [
    { Icon: Instagram, href: "#" },
    { Icon: Twitter, href: "#" },
    { Icon: Pinterest, href: "#" },
    { Icon: Facebook, href: "#" },
    { Icon: Youtube, href: "#" },
    { Icon: Linkedin, href: "#" },
  ]

  const footerSections = {
    "Become a McGee VIP": {
      description: t('footer.newsletterText'),
      signupSection: true,
    },
    "Shop": [
      { name: t('footer.about'), href: "#" },
      { name: t('footer.newArrivals'), href: "#" },
      { name: t('footer.bestSellers'), href: "#" }
    ],
    "Customer Service": [
      { name: t('footer.contact'), href: "#" },
      { name: t('footer.shipping'), href: "#" },
      { name: t('footer.returns'), href: "#" }
    ],
    "Resources": [
      { name: t('footer.fabricGuide'), href: "#" },
      { name: t('footer.rugGuide'), href: "#" },
      { name: t('footer.pillowGuide'), href: "#" }
    ],
    "Company": [
      { name: t('footer.privacy'), href: "#" },
      { name: t('footer.terms'), href: "#" },
      { name: t('footer.accessibility'), href: "#" }
    ],
  }

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await sendRequest('POST', '/subscribe', { email });
      if (response.status === 200) {
        toast.success(t('footer.subscribeSuccess'));
        setEmail("");
      } else {
        toast.error(t('footer.subscribeError'));
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      toast.error(t('footer.subscribeError'));
    }
  };

  return (
    <footer className="bg-gray-100 text-gray-800 py-8 px-4 sm:py-12 sm:px-6 md:py-16 md:px-8 lg:py-20 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Accordion Layout */}
        <div className="md:hidden">
          {/* VIP Sign Up Section - Always visible on mobile */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-4">{t('footer.newsletter')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('footer.newsletterText')}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={handleChange}
                placeholder={t('footer.emailPlaceholder')}
                className="flex-grow border border-gray-300 px-3 py-2 text-sm"
                required
              />
              <button 
                type="submit"
                className="bg-black text-white px-4 py-2 text-sm"
              >
                {t('footer.subscribe')}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              {t('footer.agreeTo')}{" "}
              <a href="#" className="underline">
                {t('footer.privacy')}
              </a>{" "}
              {t('footer.and')}{" "}
              <a href="#" className="underline">
                {t('footer.terms')}
              </a>
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              {socialIcons.map(({ Icon, href }, index) => (
                <a 
                  key={index} 
                  href={href} 
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Collapsible Sections for Mobile */}
          {Object.entries(footerSections)
            .filter(([key]) => key !== "Become a McGee VIP")
            .map(([sectionTitle, sectionItems]) => (
              <details key={sectionTitle} className="group border-b border-gray-200 py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="text-lg font-semibold">{sectionTitle}</h3>
                  <span className="transform group-open:rotate-180 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                {Array.isArray(sectionItems) && (
                  <ul className="mt-3 ml-2 space-y-2">
                    {sectionItems.map((item, index) => (
                      <li key={index}>
                        <a 
                          href={item.href} 
                          className="text-sm text-gray-600 hover:text-black transition-colors duration-200"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </details>
            ))}
        </div>

        {/* Desktop/Tablet Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* VIP Sign Up Section */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">{t('footer.newsletter')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('footer.newsletterText')}
            </p>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={handleChange}
                placeholder={t('footer.emailPlaceholder')}
                className="flex-grow border border-gray-300 px-3 py-2 text-sm"
                required
              />
              <button 
                type="submit"
                className="bg-black text-white px-4 py-2 text-sm whitespace-nowrap"
              >
                {t('footer.subscribe')}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              {t('footer.agreeTo')}{" "}
              <a href="#" className="underline">
                {t('footer.privacy')}
              </a>{" "}
              {t('footer.and')}{" "}
              <a href="#" className="underline">
                {t('footer.terms')}
              </a>
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              {socialIcons.map(({ Icon, href }, index) => (
                <a 
                  key={index} 
                  href={href} 
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Other Sections */}
          {Object.entries(footerSections)
            .filter(([key]) => key !== "Become a McGee VIP")
            .map(([sectionTitle, sectionItems]) => (
              <div key={sectionTitle}>
                <h3 className="text-lg font-semibold mb-4">{sectionTitle}</h3>
                {Array.isArray(sectionItems) && (
                  <ul className="space-y-2">
                    {sectionItems.map((item, index) => (
                      <li key={index}>
                        <a 
                          href={item.href} 
                          className="text-sm text-gray-600 hover:text-black transition-colors duration-200"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-8 md:mt-12 pt-6 border-t text-xs sm:text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} {t('footer.copyright')} |
          <a href="#" className="underline ml-1 mr-1">
            {t('footer.privacy')}
          </a>{" "}
          |
          <a href="#" className="underline">
            {t('footer.terms')}
          </a>
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center">
          <span>STUDIO MCGEE</span>
          <span className="hidden sm:inline">|</span>
          <span>MCGEE & CO.</span>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </footer>
  )
}

export default Footer


