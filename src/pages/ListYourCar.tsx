import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Headphones, Search, Smartphone } from 'lucide-react';

export const BecomeHost: React.FC = () => {
   const [dailyPrice, setDailyPrice] = useState(80);
   const [days, setDays] = useState(15);
   const estimatedEarnings = dailyPrice * days;

   return (
      <div className="bg-white min-h-screen font-sans text-gray-900">
         {/* Hero Section */}
         <div className="relative h-[600px] flex items-center justify-center overflow-hidden bg-black">
            <img
               src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=2000&q=80"
               alt="Host Hero"
               className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
               <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                  Earn money by <br /> sharing your car
               </h1>
               <Link to="/host/verification">
                  <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white px-10 py-4 text-lg font-bold rounded-full shadow-2xl transition-transform hover:scale-105">
                     List your car
                  </Button>
               </Link>
            </div>
         </div>

         {/* Section 1: Build a business (Text Based - First Image) */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-gray-100">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight font-serif">
                  Build a business that’s...
               </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-16">
               <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Scalable</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                     You choose how many cars to share, scaling your business up or down however you want, and whether to reinvest your earnings or cash out.
                  </p>
               </div>

               <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Accessible</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                     Start with a car you already own or buy one to share — any car owner can start exercising their entrepreneurial muscles.
                  </p>
               </div>

               <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Flexible</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                     Whether you want to commit a lot of time or a little, you can earn at home or on the go, on your schedule, and divest any time.
                  </p>
               </div>
            </div>
         </div>

         {/* Section 2: Financials & Calculator (Second Image) */}
         <div className="bg-gray-50 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                     Entrepreneurs of all experience levels welcome
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                     Whether you want to host a few cars to earn extra income to pay for life’s expenses, or build a small shop with a portfolio of cars, start with one car and scale how you want.
                  </p>
               </div>

               <div className="grid lg:grid-cols-2 gap-16 items-center">
                  {/* Left Column: Static Stats */}
                  <div className="space-y-10">
                     <div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-1">$10,868</div>
                        <div className="text-gray-600">Average annual income of 1 car*</div>
                     </div>
                     <div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-1">$32,605</div>
                        <div className="text-gray-600">Average annual income of 3 cars*</div>
                     </div>
                     <div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-1">$54,341</div>
                        <div className="text-gray-600">Average annual income of 5 cars*</div>
                     </div>
                     <div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-1">$76,078</div>
                        <div className="text-gray-600">Average annual income of 7 cars*</div>
                     </div>
                     <div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-1">$97,814</div>
                        <div className="text-gray-600">Average annual income of 9 cars*</div>
                     </div>

                     <Link to="/host/verification">
                        <Button size="lg" className="bg-brand-600 text-white font-bold px-8 py-4 rounded-xl mt-4">
                           Get started
                        </Button>
                     </Link>
                  </div>

                  {/* Right Column: Calculator (Replacing Family Photo) */}
                  <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-[80px] -z-10"></div>

                     <h3 className="text-2xl font-bold text-gray-900 mb-8">Estimate your potential earnings</h3>

                     <div className="space-y-8">
                        <div>
                           <div className="flex justify-between mb-2">
                              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Daily Price</label>
                              <span className="font-bold text-gray-900 text-lg">${dailyPrice}</span>
                           </div>
                           <input
                              type="range"
                              min="30"
                              max="500"
                              value={dailyPrice}
                              onChange={(e) => setDailyPrice(Number(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                           />
                        </div>

                        <div>
                           <div className="flex justify-between mb-2">
                              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Utilization</label>
                              <span className="font-bold text-gray-900 text-lg">{days} days/mo</span>
                           </div>
                           <input
                              type="range"
                              min="1"
                              max="30"
                              value={days}
                              onChange={(e) => setDays(Number(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                           />
                        </div>

                        <div className="pt-8 border-t border-gray-100 text-center">
                           <p className="text-gray-500 mb-2">Estimated Monthly Earnings</p>
                           <div className="text-5xl font-extrabold text-brand-600 mb-2">
                              ${estimatedEarnings.toLocaleString()}
                           </div>
                           <p className="text-xs text-gray-400 max-w-xs mx-auto">
                              *Figures are estimates based on your inputs and do not guarantee actual earnings.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Section 3: Built-in infrastructure (Third Image) */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                  Built-in infrastructure to <br /> get you up & running
               </h2>
               <p className="text-gray-600 text-lg">
                  Morent provides the tools to help hosts thrive
               </p>
            </div>

            <div className="grid md:grid-cols-2 gap-x-16 gap-y-16">
               {/* Feature 1 */}
               <div className="flex gap-6">
                  <div className="flex-shrink-0">
                     <ShieldCheck size={40} className="text-brand-600" strokeWidth={1.5} />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-gray-900 mb-3">Insurance included</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Rest easy knowing you’re covered with up to $750,000** in third-party liability insurance, plus you choose from an array of protection plans that include varying levels of reimbursement for car repairs. <a href="#" className="text-brand-600 font-medium hover:underline">Learn more about vehicle protection.</a>
                     </p>
                  </div>
               </div>

               {/* Feature 2 */}
               <div className="flex gap-6">
                  <div className="flex-shrink-0">
                     <Headphones size={40} className="text-brand-600" strokeWidth={1.5} />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-gray-900 mb-3">Safety & support</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Get access to 24/7 Customer Support, roadside assistance for your guests, an experienced trust and safety team to support you through thick and thin, and one-on-one business coaching.
                     </p>
                  </div>
               </div>

               {/* Feature 3 */}
               <div className="flex gap-6">
                  <div className="flex-shrink-0">
                     <Search size={40} className="text-brand-600" strokeWidth={1.5} />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-gray-900 mb-3">Demand generation</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Get instant access to millions of active guests from around the world, plus marketing and advertising support from Morent, the world’s largest car sharing marketplace.
                     </p>
                  </div>
               </div>

               {/* Feature 4 */}
               <div className="flex gap-6">
                  <div className="flex-shrink-0">
                     <Smartphone size={40} className="text-brand-600" strokeWidth={1.5} />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-gray-900 mb-3">An easy-to-use app</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Manage your business and your bookings seamlessly on the go — manage trips, tweak your pricing, message your guests, and more, all from your phone.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};