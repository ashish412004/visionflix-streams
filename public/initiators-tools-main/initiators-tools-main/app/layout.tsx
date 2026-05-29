import type { Metadata } from 'next'
import { Inter, Poppins, Orbitron } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const products = [
  { id: 0, name: "VIP Membership", price: 99, period: "1 Year", description: "Exclusive access to all premium services." },
  { id: 1, name: "Netflix", price: 199, period: "1 Month", description: "Premium streaming entertainment." },
  { id: 2, name: "Prime Video", price: 199, period: "1 Year", description: "Movies and originals." },
  { id: 3, name: "Zee5", price: 249, period: "1 Year", description: "Premium content no ads." },
  { id: 4, name: "Sony LIV", price: 399, period: "1 Year", description: "Live sports entertainment." },
  { id: 5, name: "Hotstar", price: 699, period: "1 Year", description: "Super Plan content." },
  { id: 6, name: "Prime Video", price: 499, period: "1 Year", description: "Personal Prime account." },
  { id: 7, name: "Sony LIV", price: 499, period: "1 Year", description: "Personal Sony LIV." },
  { id: 8, name: "Zee5", price: 499, period: "1 Year", description: "Personal Zee5 access." },
  { id: 9, name: "YouTube Premium", price: 999, period: "1 Year", description: "Ad-free YouTube." },
  { id: 10, name: "Amazon Full Benefit", price: 1099, period: "1 Year", description: "Complete benefits." },
  { id: 11, name: "Adobe CC", price: 999, period: "4 Months", description: "All Adobe apps." },
  { id: 12, name: "Adobe CC", price: 5999, period: "1 Year", description: "Best Value Pack." },
  { id: 13, name: "LinkedIn Career", price: 3499, period: "1 Year", description: "Professional journey." },
  { id: 14, name: "LinkedIn Sales", price: 3499, period: "1 Month", description: "For sales pros." },
  { id: 15, name: "Microsoft 365", price: 799, period: "1 Year", description: "Office + 1TB Cloud." },
  { id: 16, name: "Canva Pro", price: 499, period: "1 Year", description: "Design pro style." },
  { id: 17, name: "ChatGPT Plus", price: 499, period: "1 Month", description: "Advanced AI." },
  { id: 18, name: "Rezi AI", price: 1299, period: "1 Year", description: "AI Resume builder." },
  { id: 19, name: "Gemini AI", price: 499, period: "1 Year", description: "Advanced Assistant." },
  { id: 20, name: "Perplexity AI", price: 1999, period: "1 Year", description: "Search AI." },
  { id: 21, name: "1K Followers", price: 249, period: "Lifetime", description: "High Quality." },
  { id: 22, name: "1K Likes", price: 149, period: "Fast", description: "Real accounts." },
  { id: 23, name: "Student Pack", price: 3999, period: "1 Year", description: "Perfect for students and creators." },
  { id: 24, name: "OTT Bonanza", price: 949, period: "1 Year", description: "Ultimate entertainment bundle." },
  { id: 25, name: "AI Pro Pack", price: 2499, period: "1 Year", description: "Complete AI toolkit." }
]

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins'
})

const orbitron = Orbitron({ 
  subsets: ["latin"],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron'
})

export const metadata: Metadata = {
  title: 'VisionFlix Streams | Premium Digital Subscriptions',
  description: 'Get the cheapest OTT and digital tool subscriptions with instant delivery.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": `https://visionflixstreams.shop/product/${product.id}`
        }
      }
    }))
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is VisionFlix Streams?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "VisionFlix Streams is your premier destination for premium digital subscriptions. We offer the cheapest OTT subscriptions, AI plans, software licenses, and Instagram services with instant delivery via WhatsApp and Email. Trusted by 3000+ customers, we provide secure, reliable access to your favorite digital services at unbeatable prices."
        }
      },
      {
        "@type": "Question",
        "name": "How will I receive my login details?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You'll receive your login details instantly after payment confirmation via WhatsApp and Email. Our automated system ensures quick delivery, typically within minutes. For combo packs and VIP memberships, you'll receive all necessary credentials and setup instructions immediately."
        }
      },
      {
        "@type": "Question",
        "name": "Are these accounts safe and private?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! We prioritize your security and privacy. Personal accounts are 100% private with your own PIN and password change access. Shared accounts are carefully managed with admin profiles to ensure stability. All transactions are secure, and we never share your personal information with third parties."
        }
      },
      {
        "@type": "Question",
        "name": "What if I face a login issue?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our dedicated 24/7 support team is always ready to help. If you face any login issues, simply reach out via WhatsApp or our support channels, and we'll resolve it within minutes. We provide full warranty on all accounts and offer quick replacements if needed."
        }
      },
      {
        "@type": "Question",
        "name": "Which OTT platforms are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a wide range of premium OTT platforms including Netflix, Prime Video, SonyLIV, Zee5, Disney+ Hotstar, YouTube Premium, and more. We provide both shared and personal account options to fit your budget and privacy needs. Our OTT Bonanza combo pack offers multiple platforms at an unbeatable price."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods do you accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept payments via UPI, bank transfers, and other popular payment methods in India. All payments are processed securely, and you'll receive instant confirmation. For bulk orders or custom packages, contact us on WhatsApp for special pricing."
        }
      }
    ]
  }

  return (
    <html lang="en" className="bg-background">
      <head>
        <meta name="google-site-verification" content="6i3ABerR-GRlPvODJWKFjkmrsHLrgiv-RCPVgtjxbFc" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} ${orbitron.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
