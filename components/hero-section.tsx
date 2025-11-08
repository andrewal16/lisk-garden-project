"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Users, Leaf, Heart, Cloud, Star, Zap } from 'lucide-react'

interface HeroSectionProps {
  onGetStarted: () => void
  onLearnMore: () => void
}

// Floating Asset Component - Compatible with Next.js
const FloatingAsset = ({ src, alt, delay = 0, size = 120, position, animationDuration = 4 }) => (
  <motion.div
    className="absolute"
    style={position}
    initial={{ opacity: 0, scale: 0, rotate: -10 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ delay, duration: 0.6, type: "spring" }}
  >
    <motion.div
      animate={{ 
        y: [0, -20, 0],
        rotate: [-5, 5, -5],
      }}
      transition={{ 
        duration: animationDuration, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      whileHover={{ scale: 1.15, rotate: 0 }}
      className="cursor-pointer filter drop-shadow-2xl"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={src} 
        alt={alt} 
        width={size} 
        height={size}
        className="w-full h-full object-contain"
      />
    </motion.div>
  </motion.div>
)

// Floating Cloud
const FloatingCloud = ({ delay = 0, left, top }) => (
  <motion.div
    className="absolute z-0"
    style={{ left, top }}
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 0.4 }}
    transition={{ delay, duration: 2 }}
  >
    <motion.div
      animate={{ x: [0, 30, 0], y: [0, -15, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    >
      <Cloud className="w-20 h-20 text-white fill-white drop-shadow-lg" />
    </motion.div>
  </motion.div>
)

// Cute Feature Card
const CuteFeatureCard = ({ icon: Icon, title, description, color, delay = 0, gradient }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
    whileHover={{ scale: 1.08, y: -8 }}
    className="group cursor-pointer"
  >
    <div className={`p-6 rounded-3xl bg-white/95 backdrop-blur-md border-4 ${color} shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-full`}>
      {/* Animated gradient overlay */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />
      
      {/* Cute corner sparkle */}
      <motion.div 
        className="absolute -top-1 -right-1"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-6 h-6 text-yellow-400" />
      </motion.div>
      
      <motion.div 
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-8 h-8 text-white drop-shadow" />
      </motion.div>
      
      <h3 className="font-black text-xl text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>
)

export default function HeroSection({ onGetStarted, onLearnMore }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-transparent to-yellow-200/30"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        {/* Cute pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(147, 197, 253, 0.4) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating Clouds */}
      <FloatingCloud left="3%" top="8%" delay={0.2} />
      <FloatingCloud left="88%" top="12%" delay={0.5} />
      <FloatingCloud left="8%" top="78%" delay={0.8} />
      <FloatingCloud left="85%" top="75%" delay={1.1} />

      {/* Floating Hearts, Stars & Sparkles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`decoration-${i}`}
          className="absolute z-5"
          style={{
            left: `${10 + i * 9}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.9, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        >
          {i % 3 === 0 ? (
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
          ) : i % 3 === 1 ? (
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          ) : (
            <Sparkles className="w-5 h-5 text-purple-400" />
          )}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative z-20"
          >
            {/* Cute Badge with Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.08 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full 
                bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 
                border-4 border-white shadow-2xl mb-8 relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5 text-purple-700" />
              </motion.div>
              <span className="text-sm font-black text-purple-800">
                Powered by Lisk Blockchain ⚡
              </span>
              <motion.div
                className="absolute inset-0 bg-white/30"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            {/* Main Heading with Enhanced Animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                <motion.span 
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-2"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Grow Your
                </motion.span>
                <motion.span 
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Dream Garden
                </motion.span>
                <motion.span 
                  className="inline-block text-5xl ml-2"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🌱
                </motion.span>
              </h1>
            </motion.div>

            {/* Description with Better Styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-xl bg-white/40 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/60 shadow-lg">
                Plant cute <span className="font-black text-green-600">NFT seeds</span>, water them with love 💖, 
                and watch them bloom into beautiful flowers! 
                Earn <span className="font-black text-purple-600">GDN tokens</span> while having fun!
              </p>
            </motion.div>

            {/* CTA Buttons with Enhanced Effects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.button
                onClick={onGetStarted}
                className="group relative px-8 py-4 rounded-full font-black text-lg 
                  bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white 
                  shadow-2xl border-4 border-white overflow-hidden"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  initial={{ x: '100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  Start Growing 🌱
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                onClick={onLearnMore}
                className="relative px-8 py-4 rounded-full font-black text-lg 
                  bg-white text-purple-600 shadow-xl 
                  border-4 border-purple-300 overflow-hidden group"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative">Learn More 📚</span>
              </motion.button>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { value: "10K+", label: "Happy Plants", emoji: "🌺", color: "from-pink-400 to-rose-400" },
                { value: "5K+", label: "Gardeners", emoji: "👨‍🌾", color: "from-green-400 to-emerald-400" },
                { value: "50K+", label: "Rewards", emoji: "💎", color: "from-purple-400 to-blue-400" },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  className="flex items-center gap-3 px-5 py-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border-3 border-white relative overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{
                    y: { duration: 2, repeat: Infinity, delay: i * 0.3 }
                  }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity`}
                  />
                  <motion.span 
                    className="text-3xl relative z-10"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    {stat.emoji}
                  </motion.span>
                  <div className="relative z-10">
                    <div className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 font-bold">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - SVG Assets Garden Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            className="relative h-[600px] flex items-center justify-center"
          >
            {/* Central Glow Effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-green-300/40 via-blue-300/40 to-purple-300/40 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Large Center Plant (Image 3) - plantPot.png */}
            <FloatingAsset
              src="/plantPot.png"
              alt="Main Plant"
              size={140}
              delay={0.5}
              position={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 30 }}
              animationDuration={3.5}
            />

            {/* Top Left - Fertilizer (Image 2) - fertilizer.png */}
            <FloatingAsset
              src="/fertilizer.png"
              alt="Fertilizer"
              size={160}
              delay={0.7}
              position={{ left: '5%', top: '15%', zIndex: 20 }}
              animationDuration={4.5}
            />

            {/* Top Right - Plant with Care (Image 1) - plantCare.png */}
            <FloatingAsset
              src="/plantCare.png"
              alt="Plant with Care"
              size={180}
              delay={0.9}
              position={{ right: '5%', top: '10%', zIndex: 20 }}
              animationDuration={4}
            />

            {/* Bottom Left - Small Plant - plantPot.png (reuse) */}
            <FloatingAsset
              src="/plantPot.png"
              alt="Small Plant"
              size={140}
              delay={1.1}
              position={{ left: '10%', bottom: '15%', zIndex: 15 }}
              animationDuration={5}
            />

            {/* Bottom Right - Water Drop (Image 4) - waterDrop.png */}
            <FloatingAsset
              src="/waterDrop.png"
              alt="Water Drop"
              size={70}
              delay={1.3}
              position={{ right: '8%', bottom: '18%', zIndex: 15 }}
              animationDuration={4.5}
            />

            {/* Multiple Sparkles Around Assets */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute"
                style={{
                  left: `${20 + (i * 7) % 60}%`,
                  top: `${15 + (i * 11) % 70}%`,
                  zIndex: i % 2 === 0 ? 25 : 10,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.8, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                <Sparkles className="w-7 h-7 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
              </motion.div>
            ))}

            {/* Cute Little Stars */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${25 + (i % 2) * 30}%`,
                  zIndex: 5,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              >
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Feature Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-24"
        >
          <CuteFeatureCard
            icon={Leaf}
            title="Own Your Plants"
            description="Each plant is a unique NFT that truly belongs to you forever! 🌿"
            color="border-green-400"
            gradient="from-green-400 to-emerald-500"
            delay={1.1}
          />
          <CuteFeatureCard
            icon={Sparkles}
            title="Magic Growth"
            description="Watch your plants grow with blockchain magic and love! ✨"
            color="border-purple-400"
            gradient="from-purple-400 to-pink-500"
            delay={1.2}
          />
          <CuteFeatureCard
            icon={Users}
            title="Garden Friends"
            description="Help your friends water their plants and grow together! 🤝"
            color="border-blue-400"
            gradient="from-blue-400 to-cyan-500"
            delay={1.3}
          />
          <CuteFeatureCard
            icon={Heart}
            title="Earn Rewards"
            description="Get GDN tokens when your beautiful flowers bloom! 💖"
            color="border-pink-400"
            gradient="from-pink-400 to-rose-500"
            delay={1.4}
          />
        </motion.div>
      </div>

      {/* Enhanced Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <svg viewBox="0 0 1440 120" className="w-full">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(167, 243, 208, 0.4)" />
              <stop offset="50%" stopColor="rgba(196, 181, 253, 0.4)" />
              <stop offset="100%" stopColor="rgba(191, 219, 254, 0.4)" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,60 Q360,90 720,60 T1440,60 L1440,120 L0,120 Z"
            fill="url(#waveGradient)"
            animate={{ 
              d: [
                "M0,60 Q360,90 720,60 T1440,60 L1440,120 L0,120 Z",
                "M0,70 Q360,50 720,70 T1440,70 L1440,120 L0,120 Z",
                "M0,60 Q360,90 720,60 T1440,60 L1440,120 L0,120 Z",
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </section>
  )
}