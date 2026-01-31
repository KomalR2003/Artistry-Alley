import React from 'react';
import Image from 'next/image';
import abt1 from '../../../public/Images/abt1.png';
import abt2 from '../../../public/Images/abt2.png';
import abt3 from '../../../public/Images/abt3.png';
import abt4 from '../../../public/Images/abt4.png';
import galleryHero from '../../../public/Images/gallery_hero.png';

export default function AboutUs({ onNavigate }) {
  return (
    <div className="w-full h-full bg-white text-gray-900 overflow-y-auto selection:bg-[#D1CAF2]/30">

      {/* Hero Section - Welcome to Artistry */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#D1CAF2]/10 to-[#98C4EC]/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-8 py-16">
          {/* Left Side - Content */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-[#171C3C] leading-tight">
              Welcome to <span className="bg-gradient-to-r from-[#171C3C] via-[#98C4EC] to-[#FE9E8F] bg-clip-text text-transparent">Artistry</span>
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              At <span className="font-semibold text-[#171C3C]">Artistry</span>, we celebrate the beauty and diversity of art through a meticulously curated collection and dynamic exhibitions. Our gallery is a vibrant hub for art enthusiasts, collectors, and creatives, offering an immersive experience in the world of visual arts.
            </p>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => onNavigate?.('events')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FE9E8F] to-[#FF7A66] text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Explore Events
              </button>
              <button
                onClick={() => onNavigate?.('products')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#98C4EC] to-[#6BA3DC] text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Explore Products
              </button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-[#D1CAF2]/30">
            <Image
              src={galleryHero}
              alt="Art Gallery Interior"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="h-1 bg-gradient-to-r from-[#98C4EC] via-[#D1CAF2] to-[#FE9E8F] opacity-40 max-w-7xl mx-auto"></div>

      {/* Explore Our Collection Sections */}
      <section className="max-w-7xl mx-auto px-8 py-16 space-y-12">
        {/* First Collection Section */}
        <div className="bg-gradient-to-br from-[#D1CAF2]/20 via-[#98C4EC]/10 to-white rounded-2xl p-10 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#D1CAF2]/30">
          <h2 className="text-3xl font-bold text-[#171C3C] mb-4">
            Explore Our Collection
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Explore our collection of art, where each piece invites you to discover the rich world of creativity. From vibrant expressions to thought-provoking works, our collection offers glimpses into diverse cultures, emotions, and perspectives.
          </p>
        </div>

        {/* Second Collection Section */}
        <div className="bg-white rounded-2xl p-10 border-2 border-[#98C4EC]/40 shadow-lg hover:shadow-xl hover:border-[#98C4EC] transition-all duration-300">
          <h2 className="text-3xl font-bold text-[#171C3C] mb-4">
            Dynamic Exhibitions
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our gallery presents a dynamic lineup of exhibitions throughout the year, showcasing a diverse array of fresh and original artworks. Whether you experience them in person or through our engaging online events, each exhibition promises to unveil new inspirations and artistic viewpoints.
          </p>
        </div>
      </section>

      {/* Explore the Art Universe */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-4xl font-bold text-[#171C3C] mb-12 text-center">
          Explore the Art Universe
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vibrant Gallery Card */}
          <div className="group bg-white rounded-xl p-6 border-l-4 border-l-[#98C4EC] shadow-md hover:shadow-2xl transition-all duration-300 flex items-center gap-6 hover:scale-105 hover:border-l-[#FE9E8F]">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-[#171C3C] mb-2 group-hover:text-[#FE9E8F] transition-colors">
                Vibrant Gallery
              </h3>
              <p className="text-gray-600">
                Discover stunning artworks from talented artists around the world.
              </p>
            </div>
            <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
              <Image
                src={abt1}
                alt="Gallery"
                width={128}
                height={96}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Event Highlights Card */}
          <div className="group bg-white rounded-xl p-6 border-l-4 border-l-[#D1CAF2] shadow-md hover:shadow-2xl transition-all duration-300 flex items-center gap-6 hover:scale-105 hover:border-l-[#FE9E8F]">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-[#171C3C] mb-2 group-hover:text-[#FE9E8F] transition-colors">
                Event Highlights
              </h3>
              <p className="text-gray-600">
                Stay updated on upcoming events and exclusive exhibitions.
              </p>
            </div>
            <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
              <Image
                src={abt2}
                alt="Events"
                width={128}
                height={96}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="bg-gradient-to-br from-[#D1CAF2]/10 via-white to-[#98C4EC]/10 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-[#171C3C] text-center mb-16">
            Our Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Artworks Available */}
            <div className="group relative bg-white p-8 rounded-2xl border-2 border-[#98C4EC]/30 hover:border-[#98C4EC] transition-all duration-300 hover:shadow-2xl cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#98C4EC] to-[#98C4EC]/70 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-5xl font-bold mb-3 text-[#98C4EC]">200+</h3>
              <p className="font-semibold text-[#171C3C] mb-2 text-lg">Artworks Available</p>
              <p className="text-sm text-gray-600 group-hover:text-[#FE9E8F] transition-colors font-medium">Explore now →</p>
            </div>

            {/* Exhibitions Held */}
            <div className="group relative bg-white p-8 rounded-2xl border-2 border-[#D1CAF2]/30 hover:border-[#D1CAF2] transition-all duration-300 hover:shadow-2xl cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D1CAF2] to-[#D1CAF2]/70 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-5xl font-bold mb-3 text-[#D1CAF2]">20</h3>
              <p className="font-semibold text-[#171C3C] mb-2 text-lg">Exhibitions Held</p>
              <p className="text-sm text-gray-600 group-hover:text-[#FE9E8F] transition-colors font-medium">Join Our Exhibitions →</p>
            </div>

            {/* Happy Customers */}
            <div className="group relative bg-white p-8 rounded-2xl border-2 border-[#FE9E8F]/30 hover:border-[#FE9E8F] transition-all duration-300 hover:shadow-2xl cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FE9E8F] to-[#FE9E8F]/70 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-5xl font-bold mb-3 text-[#FE9E8F]">1000+</h3>
              <p className="font-semibold text-[#171C3C] mb-2 text-lg">Happy Customers</p>
              <p className="text-sm text-gray-600 group-hover:text-[#171C3C] transition-colors font-medium">Join with Us →</p>
            </div>

            {/* Talented Artists */}
            <div className="group relative bg-white p-8 rounded-2xl border-2 border-[#171C3C]/20 hover:border-[#171C3C] transition-all duration-300 hover:shadow-2xl cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#171C3C] to-[#171C3C]/80 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-5xl font-bold mb-3 text-[#171C3C]">30</h3>
              <p className="font-semibold text-[#171C3C] mb-2 text-lg">Talented Artists</p>
              <p className="text-sm text-gray-600 group-hover:text-[#FE9E8F] transition-colors font-medium">Explore more →</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-[#171C3C] text-center mb-16">
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vibrant Gallery Card */}
          <div className="group bg-white rounded-2xl p-8 border-2 border-[#98C4EC]/40 hover:border-[#98C4EC] shadow-lg hover:shadow-2xl transition-all duration-300 flex items-start gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#171C3C] mb-4 group-hover:text-[#FE9E8F] transition-colors">
                Vibrant Gallery
              </h3>
              <p className="text-gray-700 leading-relaxed">
                A collection that spans various styles and mediums, offering something special for everyone.
              </p>
            </div>
            <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
              <Image
                src={abt3}
                alt="Artwork"
                width={112}
                height={112}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Engaging Events Card */}
          <div className="group bg-white rounded-2xl p-8 border-2 border-[#D1CAF2]/40 hover:border-[#D1CAF2] shadow-lg hover:shadow-2xl transition-all duration-300 flex items-start gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#171C3C] mb-4 group-hover:text-[#FE9E8F] transition-colors">
                Engaging Events
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Join us for workshops, artist talks, and exclusive previews of upcoming exhibitions.
              </p>
            </div>
            <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
              <Image
                src={abt4}
                alt="Events Grid"
                width={112}
                height={112}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Compact Footer */}
      <footer className="bg-[#171C3C] text-white py-8">
        <div className="max-w-7xl mx-auto px-8">
          {/* Single Row Layout */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            {/* Left: Brand & Copyright */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">Artistry</h3>
              <p className="text-gray-400 text-sm">© 2026 Artistry. All rights reserved.</p>
            </div>

            {/* Center: Quick Links */}
            <div className="flex gap-6 flex-wrap justify-center">
              <a href="#" className="text-gray-300 hover:text-[#FE9E8F] text-sm transition-colors duration-300">Home</a>
              <a href="#" className="text-gray-300 hover:text-[#FE9E8F] text-sm transition-colors duration-300">Gallery</a>
              <a href="#" className="text-gray-300 hover:text-[#FE9E8F] text-sm transition-colors duration-300">Events</a>
              <a href="#" className="text-gray-300 hover:text-[#FE9E8F] text-sm transition-colors duration-300">Contact</a>
              <a href="#" className="text-gray-300 hover:text-[#FE9E8F] text-sm transition-colors duration-300">Privacy</a>
            </div>

            {/* Right: Social Media Icons */}
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FE9E8F] transition-all duration-300">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FE9E8F] transition-all duration-300">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FE9E8F] transition-all duration-300">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
