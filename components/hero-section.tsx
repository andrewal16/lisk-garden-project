"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Users, Leaf, Heart, Cloud, Star } from 'lucide-react'

interface HeroSectionProps {
  onGetStarted: () => void
  onLearnMore: () => void
}

// Cute Simple Plant Component
const CutePlant = ({ delay = 0, size = "md" }) => {
  const sizes = {
    sm: { pot: "w-16 h-20", stem: "h-8", leaf: "w-6 h-8", flower: "w-8 h-8" },
    md: { pot: "w-24 h-28", stem: "h-12", leaf: "w-8 h-10", flower: "w-10 h-10" },
    lg: { pot: "w-32 h-36", stem: "h-16", leaf: "w-10 h-12", flower: "w-12 h-12" }
  }
  
  const s = sizes[size]
  
  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Cute Flower */}
      <motion.div
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Petals */}
        <div className="relative">
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <div
              key={angle}
              className={`absolute ${s.flower} bg-gradient-to-br from-pink-300 to-pink-400 rounded-full`}
              style={{
                transform: `rotate(${angle}deg) translateY(-12px)`,
                transformOrigin: "center center"
              }}
            />
          ))}
        </div>
        {/* Center */}
        <div className={`relative ${s.flower} bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center shadow-lg`}>
          <div className="w-2 h-2 bg-yellow-600 rounded-full" />
          <div className="w-1 h-1 bg-yellow-600 rounded-full ml-1" />
        </div>
      </motion.div>

      {/* Stem */}
      <div className={`w-2 ${s.stem} bg-gradient-to-b from-green-400 to-green-500 rounded-full`} />

      {/* Leaves */}
      <div className="absolute top-1/2 left-0 right-0">
        <motion.div
          animate={{ rotate: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -left-3 ${s.leaf} bg-gradient-to-br from-green-300 to-green-400 rounded-full`}
          style={{ clipPath: "ellipse(70% 85% at 30% 50%)" }}
        />
        <motion.div
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className={`absolute -right-3 ${s.leaf} bg-gradient-to-br from-green-300 to-green-400 rounded-full`}
          style={{ clipPath: "ellipse(70% 85% at 70% 50%)" }}
        />
      </div>

      {/* Cute Pot */}
      <div className={`${s.pot} bg-gradient-to-b from-orange-200 to-orange-300 rounded-3xl shadow-xl border-4 border-orange-400/30 relative overflow-hidden`}>
        {/* Pot shine */}
        <div className="absolute top-2 left-2 right-2 h-3 bg-white/40 rounded-full blur-sm" />
        {/* Soil */}
        <div className="absolute top-3 left-3 right-3 h-4 bg-amber-800 rounded-full" />
        {/* Cute face on pot */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-2 h-2 bg-orange-600 rounded-full" />
          <div className="w-2 h-2 bg-orange-600 rounded-full" />
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-orange-600 rounded-full" />
      </div>
    </motion.div>
  )
}

// Floating Cloud
const FloatingCloud = ({ delay = 0, left, top }) => (
  <motion.div
    className="absolute"
    style={{ left, top }}
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 0.6 }}
    transition={{ delay, duration: 2 }}
  >
    <motion.div
      animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <Cloud className="w-16 h-16 text-white fill-white drop-shadow-lg" />
    </motion.div>
  </motion.div>
)

// Cute Feature Card
const CuteFeatureCard = ({ icon: Icon, title, description, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="group"
  >
    <div className={`p-6 rounded-3xl bg-white/90 backdrop-blur-sm border-4 ${color} shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}>
      {/* Cute corner decoration */}
      <div className="absolute -top-2 -right-2 w-12 h-12 bg-white/50 rounded-full" />
      
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color.replace('border-', 'from-').replace('-400', '-200')} to-white flex items-center justify-center mb-4 shadow-md`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="font-bold text-lg text-gray-800 mb-2">
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
      
      {/* Cute Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        {/* Soft overlay pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 192, 203, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Floating Clouds */}
      <FloatingCloud left="5%" top="10%" delay={0.2} />
      <FloatingCloud left="85%" top="15%" delay={0.5} />
      <FloatingCloud left="10%" top="75%" delay={0.8} />
      <FloatingCloud left="80%" top="70%" delay={1.1} />

      {/* Floating Hearts & Stars */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {i % 2 === 0 ? (
            <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
          ) : (
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          )}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Cute Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full 
                bg-gradient-to-r from-purple-200 to-pink-200 
                border-3 border-white shadow-lg mb-6"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-700">
                Powered by Lisk Blockchain ✨
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-2">
                Grow Your
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
                Dream Garden
              </span>
              <motion.span 
                className="inline-block text-4xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🌱
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-xl"
            >
              Plant cute NFT seeds, water them with love, and watch them bloom into beautiful flowers! 
              <span className="font-bold text-purple-600"> Earn GDN tokens</span> while having fun! 💖
            </motion.p>

            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={onGetStarted}
                className="group px-8 py-4 rounded-full font-bold text-lg 
                  bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white 
                  shadow-xl hover:shadow-2xl border-4 border-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center gap-2">
                  Start Growing 🌱
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                onClick={onLearnMore}
                className="px-8 py-4 rounded-full font-bold text-lg 
                  bg-white text-purple-600 shadow-lg hover:shadow-xl 
                  border-4 border-purple-200"
                whileHover={{ scale: 1.05, borderColor: "rgb(216, 180, 254)" }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More 📚
              </motion.button>
            </motion.div>

            {/* Cute Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6 mt-12"
            >
              {[
                { value: "5K+", label: "Happy Plants", emoji: "🌺" },
                { value: "2K+", label: "Gardeners", emoji: "👨‍🌾" },
                { value: "50K+", label: "Rewards", emoji: "💎" },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  className="flex items-center gap-2 px-4 py-3 bg-white/80 rounded-2xl shadow-md border-2 border-purple-100"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <span className="text-2xl">{stat.emoji}</span>
                  <div>
                    <div className="text-2xl font-black text-purple-600">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 font-semibold">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Cute Plants */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative h-[500px] flex items-center justify-center"
          >
            {/* Center big plant */}
            <div className="z-20">
              <CutePlant size="lg" delay={0.5} />
            </div>

            {/* Side plants */}
            <div className="absolute left-[10%] top-[20%] z-10">
              <CutePlant size="md" delay={0.7} />
            </div>
            <div className="absolute right-[10%] top-[25%] z-10">
              <CutePlant size="md" delay={0.9} />
            </div>
            <div className="absolute left-[15%] bottom-[15%] z-10">
              <CutePlant size="sm" delay={1.1} />
            </div>
            <div className="absolute right-[15%] bottom-[20%] z-10">
              <CutePlant size="sm" delay={1.3} />
            </div>

            {/* Cute sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${10 + (i % 3) * 30}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}

            {/* Soft glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 via-purple-300/20 to-blue-300/20 rounded-full blur-3xl" />
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          <CuteFeatureCard
            icon={Leaf}
            title="Own Your Plants"
            description="Each plant is a unique NFT that truly belongs to you!"
            color="border-green-400"
            delay={0.9}
          />
          <CuteFeatureCard
            icon={Sparkles}
            title="Magic Growth"
            description="Watch your plants grow with blockchain magic ✨"
            color="border-purple-400"
            delay={1.0}
          />
          <CuteFeatureCard
            icon={Users}
            title="Garden Friends"
            description="Help your friends water their plants and grow together!"
            color="border-pink-400"
            delay={1.1}
          />
          <CuteFeatureCard
            icon={Heart}
            title="Earn Rewards"
            description="Get GDN tokens when your flowers bloom! 💖"
            color="border-yellow-400"
            delay={1.2}
          />
        </motion.div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full">
          <path
            d="M0,40 Q360,60 720,40 T1440,40 L1440,80 L0,80 Z"
            fill="rgba(255,255,255,0.5)"
          />
        </svg>
      </div>
    </section>
  )
}