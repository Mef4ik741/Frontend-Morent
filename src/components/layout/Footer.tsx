import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <span className="text-3xl font-bold text-brand-600">MORENT</span>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Our vision is to provide convenience and help increase your sales business.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-xl mb-6 text-gray-900">About</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-brand-600 transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Featured</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Partnership</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Business Relation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-6 text-gray-900">Community</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-brand-600 transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Podcast</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Invite a friend</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-6 text-gray-900">Socials</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-brand-600 transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium text-gray-900">©2023 MORENT. All rights reserved</p>
          <div className="flex gap-8 text-sm font-medium text-gray-900">
            <a href="#" className="hover:text-brand-600">Privacy & Policy</a>
            <a href="#" className="hover:text-brand-600">Terms & Condition</a>
          </div>
        </div>
      </div>
    </footer>
  );
};