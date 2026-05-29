"use client"

import { motion } from "framer-motion"
import { Shield, Headphones, Zap } from "lucide-react"

export function AboutUs() {
  const features = [
    {
      icon: Shield,
      title: "100% Genuine",
      description: "Official Partner Plans only. We guarantee authentic subscriptions from verified sources."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Real-time assistance via WhatsApp. Our team is always ready to help you."
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Activation within minutes of purchase. No waiting, no delays."
    }
  ]

  return (
    <section 
      id="about-us" 
      className="relative py-24 px-4 md:px-6"
    >
      {/* Purple glow behind section */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[400px] bg-purple-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
              Our Vision & Mission
            </span>
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left Side - Description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-gray-300 text-lg leading-relaxed">
                <span className="text-red-500 font-semibold">VisionFlix Streams</span> is the most trusted third-party seller for digital subscriptions in India. We are committed to providing you with premium OTT platforms, software licenses, and VPN services at unbeatable prices.
              </p>
              <p className="text-gray-400 leading-relaxed">
                With over <span className="text-purple-400 font-semibold">5000+ happy customers</span>, we have established ourselves as a reliable partner for all your digital subscription needs. Our focus on affordability, security, and customer satisfaction sets us apart from the rest.
              </p>
              <p className="text-gray-400 leading-relaxed">
                We believe everyone deserves access to premium digital content without breaking the bank. That&apos;s why we work directly with official partners to bring you genuine subscriptions at the lowest possible prices.
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">5000+</p>
                  <p className="text-gray-500 text-sm">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">50+</p>
                  <p className="text-gray-500 text-sm">Digital Services</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">24/7</p>
                  <p className="text-gray-500 text-sm">Support Available</p>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Feature Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 rounded-xl p-5 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
