
import React from 'react';
import { PlayCircle, Clock, Award, TrendingUp, BookOpen, ArrowRight, MoreHorizontal } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-10">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-white shadow-xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Award size={300} />
        </div>
        <div className="relative z-10 p-8 md:p-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FFC107]"></span>
            New Courses Added
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
            Continue Your Journey to Mastery
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-lg">
            You're making great progress! Pick up where you left off in "Advanced React Patterns" or explore new topics.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-white text-[#1565C0] font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <PlayCircle size={20} />
              Resume Learning
            </button>
            <button className="px-6 py-3 bg-[#1E88E5]/50 border border-white/30 hover:bg-[#1E88E5] text-white font-semibold rounded-xl backdrop-blur-md transition-all duration-300">
              View Analytics
            </button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Courses in Progress', value: '4', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Hours Learned', value: '26.5', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Certificates Earned', value: '2', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-slate-400 cursor-pointer hover:text-slate-600">
                <MoreHorizontal size={20} />
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Continue Learning - Course Cards */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">In Progress</h2>
          <button className="text-[#1E88E5] font-semibold hover:text-[#1565C0] flex items-center gap-1 transition-colors">
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="relative h-48 bg-slate-200 overflow-hidden">
                <img 
                  src={`https://source.unsplash.com/random/800x600?tech,code&sig=${item}`} 
                  alt="Course Thumbnail" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <button className="w-full py-2 bg-white text-slate-900 font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 hover:bg-[#FFC107] hover:text-white transition-colors">
                    <PlayCircle size={18} /> Continue
                  </button>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                    Development
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> 4h 30m left
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-[#1E88E5] transition-colors">
                  Fullstack Modern React with Supabase and Tailwind
                </h3>
                
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                  Master the art of building scalable web applications using the latest tech stack.
                </p>
                
                <div className="mt-auto">
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-700">65% Complete</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1E88E5] w-[65%] rounded-full shadow-[0_0_10px_rgba(30,136,229,0.5)]"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
