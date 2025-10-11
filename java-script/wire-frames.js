import React, { useState } from 'react';
import { Smartphone, Monitor, Home, Users, User, Heart, Info, Search, Menu, ChevronRight, Calendar, Trophy, Image, Newspaper } from 'lucide-react';

const WireframeViewer = () => {
  const [view, setView] = useState('mobile');
  const [activeScreen, setActiveScreen] = useState('home');

  // Mobile Wireframes
  const MobileHome = () => (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-200">
        <Menu className="w-6 h-6 text-gray-700" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-800">Uganda Footy</span>
        </div>
        <Search className="w-6 h-6 text-gray-700" />
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-red-600 rounded-lg p-4 mb-4">
        <div className="h-32 bg-white/10 rounded mb-2 flex items-center justify-center">
          <Image className="w-12 h-12 text-white/50" />
        </div>
        <p className="text-white text-sm font-semibold">Celebrating Uganda's Football Legacy</p>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-100 rounded-full px-4 py-3 mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-400" />
        <span className="text-gray-400 text-sm">Search teams, players, events...</span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-900">150+</div>
          <div className="text-xs text-gray-600">Events</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">25+</div>
          <div className="text-xs text-gray-600">Teams</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-700">100+</div>
          <div className="text-xs text-gray-600">Players</div>
        </div>
      </div>

      {/* Timeline Preview */}
      <div className="flex-1 overflow-hidden">
        <h3 className="font-bold text-gray-800 mb-3">Recent History</h3>
        <div className="space-y-3">
          {[2023, 2020, 2018].map((year) => (
            <div key={year} className="border-l-4 border-blue-900 pl-3">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-blue-900">{year}</div>
                  <div className="text-xs text-gray-600 line-clamp-2">
                    Historic event description...
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 inline" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around pt-4 mt-4 border-t-2 border-gray-200">
        <div className="flex flex-col items-center gap-1">
          <Home className="w-5 h-5 text-blue-900" />
          <span className="text-xs text-blue-900 font-semibold">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-400">Teams</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <User className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-400">Players</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Heart className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-400">Saved</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Info className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-400">About</span>
        </div>
      </div>
    </div>
  );

  const MobileTimeline = () => (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200">
        <Menu className="w-6 h-6 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Timeline</h2>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-blue-900 text-white rounded-full text-sm whitespace-nowrap">All</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap">League</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap">Cup</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap">Players</button>
      </div>

      {/* Timeline Cards */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-blue-900 text-white rounded-lg px-3 py-1 text-sm font-bold">
                {2024 - i * 2}
              </div>
              <Trophy className="w-5 h-5 text-red-600 mt-1" />
            </div>
            <div className="h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
              <Image className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Event Title Here</h3>
            <p className="text-sm text-gray-600 mb-3">
              Brief description of the historic football event that happened...
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">League</span>
              <ChevronRight className="w-5 h-5 text-blue-900" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Desktop Wireframe
  const DesktopHome = () => (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-blue-900" />
          </div>
          <span className="text-xl font-bold">Uganda Footy Hub</span>
        </div>
        <nav className="flex gap-6 text-sm">
          <span className="font-semibold border-b-2 border-white pb-1">Home</span>
          <span className="opacity-80 hover:opacity-100 cursor-pointer">Timeline</span>
          <span className="opacity-80 hover:opacity-100 cursor-pointer">Teams</span>
          <span className="opacity-80 hover:opacity-100 cursor-pointer">Players</span>
          <span className="opacity-80 hover:opacity-100 cursor-pointer">News</span>
          <span className="opacity-80 hover:opacity-100 cursor-pointer">About</span>
        </nav>
        <div className="bg-white/20 rounded-full px-4 py-2 flex items-center gap-2">
          <Search className="w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm placeholder-white/70 w-32"
          />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-red-600 px-8 py-12 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-3">
            Explore Uganda's Football Heritage
          </h1>
          <p className="text-white/90 text-lg mb-6">
            Discover the stories, teams, and legends that shaped Ugandan football
          </p>
          <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Explore Now →
          </button>
        </div>
        <div className="w-80 h-48 bg-white/10 rounded-lg flex items-center justify-center">
          <Image className="w-20 h-20 text-white/50" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Filters */}
        <div className="w-64 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto">
          <h3 className="font-bold text-gray-800 mb-4">Filters</h3>
          
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-700 mb-2">Decade</div>
            <div className="space-y-2">
              {['2020s', '2010s', '2000s', '1990s', '1980s'].map((decade) => (
                <label key={decade} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-600">{decade}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-700 mb-2">Competition</div>
            <div className="space-y-2">
              {['League', 'Cup', 'International'].map((comp) => (
                <label key={comp} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-600">{comp}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Teams</div>
            <select className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm">
              <option>All Teams</option>
              <option>KCCA FC</option>
              <option>Villa SC</option>
              <option>Express FC</option>
            </select>
          </div>
        </div>

        {/* Main Content - Timeline Grid */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Historical Timeline</h2>
            <p className="text-gray-600">Journey through Uganda's football history</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-900 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-900 text-white rounded-lg px-4 py-2 font-bold">
                    {2024 - i * 3}
                  </div>
                  <Trophy className="w-6 h-6 text-red-600" />
                </div>
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Image className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Historic Event Title</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  Description of the significant football moment in Uganda's history...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-50 text-blue-900 px-3 py-1 rounded-full">League</span>
                  <ChevronRight className="w-5 h-5 text-blue-900" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - News & Favorites */}
        <div className="w-80 bg-gray-50 p-6 border-l border-gray-200 overflow-y-auto">
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              Latest News
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="h-24 bg-gray-200 rounded mb-2"></div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">News Headline</h4>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Quick Facts
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Founded', value: '1924' },
                { label: 'Top League', value: 'FUFA' },
                { label: 'Clubs', value: '25+' }
              ].map((fact, i) => (
                <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-500">{fact.label}</div>
                  <div className="text-lg font-bold text-blue-900">{fact.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Uganda Footy Hub</h1>
          <p className="text-gray-600">Enhanced Creative Wireframes</p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setView('mobile')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              view === 'mobile'
                ? 'bg-blue-900 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            Mobile View
          </button>
          <button
            onClick={() => setView('desktop')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              view === 'desktop'
                ? 'bg-blue-900 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Monitor className="w-5 h-5" />
            Desktop View
          </button>
        </div>

        {/* Mobile Screen Selector */}
        {view === 'mobile' && (
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setActiveScreen('home')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeScreen === 'home'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Home Screen
            </button>
            <button
              onClick={() => setActiveScreen('timeline')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeScreen === 'timeline'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Timeline Screen
            </button>
          </div>
        )}

        {/* Wireframe Display */}
        <div className="flex justify-center">
          {view === 'mobile' ? (
            <div className="w-96 h-[800px] bg-gray-800 rounded-3xl p-3 shadow-2xl">
              <div className="bg-gray-900 rounded-2xl h-full overflow-hidden">
                {activeScreen === 'home' ? <MobileHome /> : <MobileTimeline />}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-6xl h-[800px]">
              <DesktopHome />
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Enhanced Design Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Interactive Timeline</h3>
              <p className="text-sm text-gray-600">Visual cards with images, filters, and smooth scrolling</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Rich Team Profiles</h3>
              <p className="text-sm text-gray-600">Detailed information with logos, stats, and achievements</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Personal Favorites</h3>
              <p className="text-sm text-gray-600">Save and organize your favorite teams and players</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WireframeViewer;