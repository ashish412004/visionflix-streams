"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"

const faqData = [
  {
    question: "What is Initiators Tools?",
    answer: "Initiators Tools is your premier destination for premium digital subscriptions. We offer the cheapest OTT subscriptions, AI plans, software licenses, and Instagram services with instant delivery via WhatsApp and Email. Trusted by 3000+ customers, we provide secure, reliable access to your favorite digital services at unbeatable prices."
  },
  {
    question: "How will I receive my login details?",
    answer: "You'll receive your login details instantly after payment confirmation via WhatsApp and Email. Our automated system ensures quick delivery, typically within minutes. For combo packs and VIP memberships, you'll receive all necessary credentials and setup instructions immediately."
  },
  {
    question: "Are these accounts safe and private?",
    answer: "Absolutely! We prioritize your security and privacy. Personal accounts are 100% private with your own PIN and password change access. Shared accounts are carefully managed with admin profiles to ensure stability. All transactions are secure, and we never share your personal information with third parties."
  },
  {
    question: "What if I face a login issue?",
    answer: "Our dedicated 24/7 support team is always ready to help. If you face any login issues, simply reach out via WhatsApp or our support channels, and we'll resolve it within minutes. We provide full warranty on all accounts and offer quick replacements if needed."
  },
  {
    question: "Which OTT platforms are available?",
    answer: "We offer a wide range of premium OTT platforms including Netflix, Prime Video, SonyLIV, Zee5, Disney+ Hotstar, YouTube Premium, and more. We provide both shared and personal account options to fit your budget and privacy needs. Our OTT Bonanza combo pack offers multiple platforms at an unbeatable price."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept payments via UPI, bank transfers, and other popular payment methods in India. All payments are processed securely, and you'll receive instant confirmation. For bulk orders or custom packages, contact us on WhatsApp for special pricing."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="px-3 py-8 md:px-4 md:py-12 max-w-7xl mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <HelpCircle className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Frequently Asked Questions
          </h2>
        </motion.div>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
          Got questions? We've got answers. Find everything you need to know about our services.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
        {faqData.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between text-left"
            >
              <span className="text-white font-semibold text-sm md:text-base pr-4">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-purple-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 md:px-6 pb-4 md:pb-5 pt-0">
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-8 md:mt-12"
      >
        <p className="text-gray-400 text-sm md:text-base">
          Still have questions?{" "}
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
          >
            Contact us on WhatsApp
          </a>
        </p>
      </motion.div>
    </section>
  )
}
