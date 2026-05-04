"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, FileText, Heart, Search, HelpCircle, Check, AlertCircle, QrCode, Gift, Users, Download, Share2, Zap, ShoppingCart } from "lucide-react"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"
import { WHATSAPP_URL } from "@/config/constants"
import { useSound } from "@/contexts/sound-context"
import { supabase, Referral } from "@/lib/supabase"
import { MiniCartConfirmation } from "./mini-cart-confirmation"

type Category = "All" | "OTT" | "AI" | "Softwares" | "Utility" | "VPN" | "Food" | "Combo Packs"
type AccessType = "Shared" | "Personal"

interface Subscription {
  id: number;
  name: string;
  logo: string;
  logoSubtext: string;
  logoUrl?: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  bgColor: string;
  borderColor?: string;
  popular?: boolean;
  category: Category;
  accessType: AccessType;
  isCombo?: boolean;
  comboItems?: string[];
  isVIP?: boolean;
}

// Deduplication function: Keep the latest/updated entry for each service name
function deduplicateSubscriptions(subs: Subscription[]): Subscription[] {
  const uniqueMap = new Map<string, Subscription>();
  
  subs.forEach(sub => {
    const existing = uniqueMap.get(sub.name);
    // Keep the entry with higher ID (latest/updated) if duplicate exists
    if (!existing || sub.id > existing.id) {
      uniqueMap.set(sub.name, sub);
    }
  });
  
  return Array.from(uniqueMap.values()).sort((a, b) => a.id - b.id);
}

const allSubscriptionsRaw: Subscription[] = [
  // VIP Pass - Special Card
  { id: 0, name: "VIP Membership", logo: "VIP", logoSubtext: "PASS", price: 99, period: "1 Year", description: "Exclusive access to all premium services.", bgColor: "bg-black", borderColor: "border-[#FFD700]", popular: true, category: "All", accessType: "Shared", isVIP: true },
  // OTT Shared
  { id: 1, name: "Netflix", logo: "N", logoSubtext: "Netflix", logoUrl: "https://cdn.worldvectorlogo.com/logos/netflix-3.svg", price: 199, period: "1 Month", description: "Premium streaming entertainment.", bgColor: "bg-red-600", borderColor: "border-red-500", popular: true, category: "OTT", accessType: "Shared" },
  { id: 2, name: "Prime Video", logo: "P", logoSubtext: "Prime", logoUrl: "https://cdn.worldvectorlogo.com/logos/amazon-prime-video-1.svg", price: 199, period: "1 Year", description: "Movies and originals.", bgColor: "bg-blue-600", borderColor: "border-blue-500", category: "OTT", accessType: "Shared" },
  { id: 3, name: "Zee5", logo: "Z", logoSubtext: "Zee5", price: 249, period: "1 Year", description: "Premium content no ads.", bgColor: "bg-purple-700", borderColor: "border-purple-500", category: "OTT", accessType: "Shared" },
  { id: 4, name: "Sony LIV", logo: "S", logoSubtext: "Sony LIV", price: 399, period: "1 Year", description: "Live sports entertainment.", bgColor: "bg-gray-700", borderColor: "border-blue-600", category: "OTT", accessType: "Shared" },
  { id: 5, name: "Hotstar", logo: "D+", logoSubtext: "Hotstar", price: 699, period: "1 Year", description: "Super Plan content.", bgColor: "bg-blue-800", borderColor: "border-blue-700", category: "OTT", accessType: "Shared" },
  // OTT Personal
  { id: 6, name: "Prime Video", logo: "P", logoSubtext: "Prime", price: 499, period: "1 Year", description: "Personal Prime account.", bgColor: "bg-blue-600", borderColor: "border-blue-500", popular: true, category: "OTT", accessType: "Personal" },
  { id: 7, name: "Sony LIV", logo: "S", logoSubtext: "Sony LIV", price: 499, period: "1 Year", description: "Personal Sony LIV.", bgColor: "bg-gray-700", borderColor: "border-blue-600", category: "OTT", accessType: "Personal" },
  { id: 8, name: "Zee5", logo: "Z", logoSubtext: "Zee5", price: 499, period: "1 Year", description: "Personal Zee5 access.", bgColor: "bg-purple-700", borderColor: "border-purple-500", category: "OTT", accessType: "Personal" },
  { id: 9, name: "YouTube Premium", logo: "YT", logoSubtext: "YouTube", logoUrl: "https://cdn.worldvectorlogo.com/logos/youtube-icon.svg", price: 999, period: "1 Year", description: "Ad-free YouTube.", bgColor: "bg-red-600", borderColor: "border-red-500", category: "OTT", accessType: "Personal" },
  { id: 10, name: "Amazon Full Benefit", logo: "A", logoSubtext: "Amazon", price: 1099, period: "1 Year", description: "Complete benefits.", bgColor: "bg-orange-600", borderColor: "border-orange-500", popular: true, category: "OTT", accessType: "Personal" },
  // Softwares
  { id: 11, name: "Adobe CC", logo: "Ad", logoSubtext: "Adobe", logoUrl: "https://cdn.worldvectorlogo.com/logos/adobe-creative-cloud-2.svg", price: 999, period: "4 Months", description: "All Adobe apps.", bgColor: "bg-red-600", borderColor: "border-red-500", category: "Softwares", accessType: "Shared" },
  { id: 12, name: "Adobe CC", logo: "Ad", logoSubtext: "Adobe", logoUrl: "https://cdn.worldvectorlogo.com/logos/adobe-creative-cloud-2.svg", price: 5999, period: "1 Year", description: "Best Value Pack.", bgColor: "bg-red-700", borderColor: "border-red-600", popular: true, category: "Softwares", accessType: "Shared" },
  { id: 13, name: "LinkedIn Career", logo: "in", logoSubtext: "LinkedIn", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png", price: 3499, period: "1 Year", description: "Professional journey.", bgColor: "bg-blue-700", borderColor: "border-blue-600", category: "Softwares", accessType: "Shared" },
  { id: 14, name: "LinkedIn Sales", logo: "in", logoSubtext: "LinkedIn", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png", price: 3499, period: "1 Month", description: "For sales pros.", bgColor: "bg-blue-800", borderColor: "border-blue-700", category: "Softwares", accessType: "Shared" },
  { id: 15, name: "Microsoft 365", logo: "MS", logoSubtext: "MS", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", price: 799, period: "1 Year", description: "Office + 1TB Cloud.", bgColor: "bg-blue-600", borderColor: "border-blue-500", popular: true, category: "Softwares", accessType: "Shared" },
  { id: 16, name: "Canva Pro", logo: "C", logoSubtext: "Canva", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_logo_2021.svg", price: 499, period: "1 Year", description: "Design pro style.", bgColor: "bg-cyan-600", borderColor: "border-cyan-500", category: "Softwares", accessType: "Shared" },
  // AI
  { id: 17, name: "ChatGPT Plus", logo: "GPT", logoSubtext: "OpenAI", price: 499, period: "1 Month", description: "Advanced AI.", bgColor: "bg-emerald-600", borderColor: "border-emerald-500", popular: true, category: "AI", accessType: "Shared" },
  { id: 18, name: "Rezi AI", logo: "RZ", logoSubtext: "Rezi", price: 1299, period: "1 Year", description: "AI Resume builder.", bgColor: "bg-indigo-600", borderColor: "border-indigo-500", category: "AI", accessType: "Shared" },
  { id: 19, name: "Gemini AI", logo: "GM", logoSubtext: "Google", price: 499, period: "1 Year", description: "Advanced Assistant.", bgColor: "bg-blue-500", borderColor: "border-blue-400", category: "AI", accessType: "Shared" },
  { id: 20, name: "Perplexity AI", logo: "PX", logoSubtext: "AI", price: 1999, period: "1 Year", description: "Search AI.", bgColor: "bg-purple-600", borderColor: "border-purple-500", popular: true, category: "AI", accessType: "Shared" },
  { id: 21, name: "Gemini AI Pro", logo: "GM", logoSubtext: "Google", price: 1399, period: "1 Year", description: "Advanced AI assistant.", bgColor: "bg-blue-500", borderColor: "border-blue-400", category: "AI", accessType: "Shared" },
  { id: 22, name: "Gamma AI", logo: "GM", logoSubtext: "Gamma", price: 4999, period: "1 Year", description: "AI presentation builder.", bgColor: "bg-purple-600", borderColor: "border-purple-500", category: "AI", accessType: "Shared" },
  { id: 23, name: "Notion Business", logo: "NT", logoSubtext: "Notion", price: 499, period: "1 Year", description: "Productivity workspace.", bgColor: "bg-gray-700", borderColor: "border-gray-600", category: "AI", accessType: "Shared" },
  { id: 24, name: "Lovable Pro", logo: "LV", logoSubtext: "Lovable", price: 199, period: "1 Year", description: "AI development tool.", bgColor: "bg-pink-600", borderColor: "border-pink-500", category: "AI", accessType: "Shared" },
  { id: 25, name: "Grammarly Pro", logo: "GR", logoSubtext: "Grammarly", price: 2199, period: "1 Year", description: "AI writing assistant.", bgColor: "bg-green-600", borderColor: "border-green-500", category: "AI", accessType: "Shared" },
  // Professional - Updated
  { id: 26, name: "Canva Pro", logo: "C", logoSubtext: "Canva", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_logo_2021.svg", price: 1599, period: "1 Year", description: "Design pro style.", bgColor: "bg-cyan-600", borderColor: "border-cyan-500", category: "Softwares", accessType: "Shared" },
  { id: 27, name: "Canva Edu", logo: "C", logoSubtext: "Canva", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_logo_2021.svg", price: 499, period: "1 Year", description: "Education edition.", bgColor: "bg-cyan-500", borderColor: "border-cyan-400", category: "Softwares", accessType: "Shared" },
  { id: 28, name: "Adobe CC", logo: "Ad", logoSubtext: "Adobe", logoUrl: "https://cdn.worldvectorlogo.com/logos/adobe-creative-cloud-2.svg", price: 4999, period: "1 Year", description: "All Adobe apps.", bgColor: "bg-red-700", borderColor: "border-red-600", popular: true, category: "Softwares", accessType: "Shared" },
  { id: 29, name: "MS Office 365", logo: "MS", logoSubtext: "MS", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", price: 999, period: "1 Year", description: "Office + 1TB Cloud.", bgColor: "bg-blue-600", borderColor: "border-blue-500", popular: true, category: "Softwares", accessType: "Shared" },
  // OTT - Updated
  { id: 30, name: "Netflix 4K", logo: "N", logoSubtext: "Netflix", logoUrl: "https://cdn.worldvectorlogo.com/logos/netflix-3.svg", price: 199, period: "1 Month", description: "Premium 4K streaming.", bgColor: "bg-red-600", borderColor: "border-red-500", popular: true, category: "OTT", accessType: "Shared" },
  { id: 31, name: "Netflix 4K", logo: "N", logoSubtext: "Netflix", logoUrl: "https://cdn.worldvectorlogo.com/logos/netflix-3.svg", price: 1299, period: "1 Year", description: "Premium 4K streaming.", bgColor: "bg-red-700", borderColor: "border-red-600", category: "OTT", accessType: "Shared" },
  { id: 32, name: "Prime Video", logo: "P", logoSubtext: "Prime", logoUrl: "https://cdn.worldvectorlogo.com/logos/amazon-prime-video-1.svg", price: 299, period: "1 Year", description: "Movies and originals.", bgColor: "bg-blue-600", borderColor: "border-blue-500", category: "OTT", accessType: "Shared" },
  { id: 33, name: "Hotstar Premium", logo: "D+", logoSubtext: "Hotstar", price: 599, period: "1 Year", description: "Premium content.", bgColor: "bg-blue-800", borderColor: "border-blue-700", category: "OTT", accessType: "Shared" },
  { id: 34, name: "Sony LIV", logo: "S", logoSubtext: "Sony LIV", price: 399, period: "1 Year", description: "Live sports entertainment.", bgColor: "bg-gray-700", borderColor: "border-blue-600", category: "OTT", accessType: "Shared" },
  { id: 35, name: "Sony LIV", logo: "S", logoSubtext: "Sony LIV", price: 699, period: "1 Year", description: "Premium sports pack.", bgColor: "bg-gray-800", borderColor: "border-blue-700", category: "OTT", accessType: "Shared" },
  { id: 36, name: "Apple TV", logo: "AP", logoSubtext: "Apple", price: 799, period: "1 Year", description: "Apple streaming.", bgColor: "bg-gray-800", borderColor: "border-gray-700", category: "OTT", accessType: "Shared" },
  { id: 37, name: "Apple Music", logo: "AP", logoSubtext: "Apple", price: 499, period: "1 Year", description: "Music streaming.", bgColor: "bg-pink-700", borderColor: "border-pink-600", category: "OTT", accessType: "Shared" },
  { id: 38, name: "IPTV", logo: "IP", logoSubtext: "IPTV", price: 2999, period: "1 Year", description: "Live TV channels.", bgColor: "bg-purple-800", borderColor: "border-purple-700", category: "OTT", accessType: "Shared" },
  // Utility/Learning
  { id: 39, name: "Coursera", logo: "CO", logoSubtext: "Coursera", price: 1899, period: "1 Year", description: "Online courses.", bgColor: "bg-blue-700", borderColor: "border-blue-600", category: "Utility", accessType: "Shared" },
  { id: 40, name: "Duolingo", logo: "DU", logoSubtext: "Duolingo", price: 1199, period: "1 Year", description: "Language learning.", bgColor: "bg-green-600", borderColor: "border-green-500", category: "Utility", accessType: "Shared" },
  { id: 41, name: "CapCut Pro", logo: "CC", logoSubtext: "CapCut", price: 499, period: "1 Month", description: "Video editing.", bgColor: "bg-black", borderColor: "border-gray-600", category: "Utility", accessType: "Shared" },
  { id: 42, name: "CapCut Pro", logo: "CC", logoSubtext: "CapCut", price: 2999, period: "1 Year", description: "Video editing pro.", bgColor: "bg-black", borderColor: "border-gray-700", category: "Utility", accessType: "Shared" },
  { id: 43, name: "Google Storage", logo: "GS", logoSubtext: "Google", price: 399, period: "1 Year", description: "Cloud storage.", bgColor: "bg-blue-500", borderColor: "border-blue-400", category: "Utility", accessType: "Shared" },
  // VPN
  { id: 44, name: "Nord VPN", logo: "ND", logoSubtext: "Nord", price: 399, period: "1 Year", description: "Secure VPN.", bgColor: "bg-blue-800", borderColor: "border-blue-700", category: "VPN", accessType: "Shared" },
  // Food
  { id: 45, name: "Zomato", logo: "ZO", logoSubtext: "Zomato", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Zomato_Logo.png", price: 0, period: "20% OFF", description: "Food discounts. On orders of ₹999+ only.", bgColor: "bg-red-600", borderColor: "border-red-500", category: "Food", accessType: "Shared" },
  // Combo Packs
  { id: 46, name: "Student Pack", logo: "SP", logoSubtext: "Student", price: 3999, originalPrice: 4497, period: "1 Year", description: "Perfect for students and creators.", bgColor: "bg-gradient-to-br from-purple-600 to-blue-600", borderColor: "border-purple-400", popular: true, category: "Combo Packs", accessType: "Shared", isCombo: true, comboItems: ["ChatGPT Plus", "Canva Pro", "LinkedIn Career"] },
  { id: 47, name: "OTT Bonanza", logo: "OB", logoSubtext: "Bonanza", price: 949, originalPrice: 1097, period: "1 Year", description: "Ultimate entertainment bundle.", bgColor: "bg-gradient-to-br from-red-600 to-orange-600", borderColor: "border-orange-500", popular: true, category: "Combo Packs", accessType: "Shared", isCombo: true, comboItems: ["Netflix", "Hotstar", "Prime Video"] },
  { id: 48, name: "AI Pro Pack", logo: "AI", logoSubtext: "Pro Pack", price: 2499, originalPrice: 2997, period: "1 Year", description: "Complete AI toolkit.", bgColor: "bg-gradient-to-br from-emerald-600 to-cyan-600", borderColor: "border-emerald-500", popular: true, category: "Combo Packs", accessType: "Shared", isCombo: true, comboItems: ["Gemini AI", "Perplexity AI", "ChatGPT Plus"] }
];

// Export deduplicated subscriptions - keeps latest entry for each service name
const allSubscriptions = deduplicateSubscriptions(allSubscriptionsRaw);

export function SubscriptionCards() {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const { addItem: addToCart, removeItem: removeFromCart, isInCart } = useCart();
  const { playHoverSound, playClickSound } = useSound();
  const [category, setCategory] = useState<Category>("All");
  const [accessType, setAccessType] = useState<AccessType>("Shared");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilter, setActiveFilter] = useState("");
  const [addedAnimation, setAddedAnimation] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState<Subscription | null>(null);
  
  // Refer & Earn State
  const [referralMobile, setReferralMobile] = useState("");
  const [showReferralCard, setShowReferralCard] = useState(false);
  const [referralData, setReferralData] = useState({
    mobileNumber: "",
    referralUrl: "",
    qrCode: "",
    points: 0,
    referralCount: 0
  });
  const [loadingReferral, setLoadingReferral] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Generate suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filteredSuggestions = allSubscriptions
      .filter(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(sub => sub.name)
      .slice(0, 5);

    setSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  }, [searchTerm]);

  // Handle search execution
  const handleSearch = () => {
    setActiveFilter(searchTerm);
    setShowSuggestions(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setActiveFilter(suggestion);
    setShowSuggestions(false);
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filtered = allSubscriptions.filter(sub => {
    const matchesSearch = activeFilter === "" || sub.name.toLowerCase().includes(activeFilter.toLowerCase());
    const matchesCategory = category === "All" || sub.category === category;
    const matchesType = category !== "OTT" || sub.accessType === accessType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Highlight matching text in suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="text-purple-400 font-bold">{part}</span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  // Refer & Earn Functions
  const generateReferralQR = async () => {
    console.log('Button Clicked!');
    
    if (!referralMobile.trim() || !/^\d{10}$/.test(referralMobile)) {
      console.log('Validation failed: Invalid mobile number (must be exactly 10 digits)');
      alert('Please enter exactly 10 digits');
      return;
    }
    
    console.log('Starting QR generation for mobile:', referralMobile);
    setLoadingReferral(true);
    
    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase not configured - generating QR in offline mode');
        // Generate QR without database (offline mode)
        generateOfflineQR();
        return;
      }

      // Check if referral already exists
      console.log('Checking if referral exists for mobile:', referralMobile);
      const { data: existingReferral, error: fetchError } = await supabase
        .from('referrals')
        .select('*')
        .eq('mobile_number', referralMobile)
        .single();

      console.log('Fetch result:', { existingReferral, fetchError });

      // Handle network/connection errors gracefully
      if (fetchError && fetchError.message === 'Failed to fetch') {
        console.warn('Network error - falling back to offline mode');
        generateOfflineQR();
        return;
      }

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Database fetch error:', fetchError.message, fetchError.details);
        // Don't show error to user, just use offline mode
        generateOfflineQR();
        return;
      }

      let referralData;
      
      if (existingReferral) {
        // Use existing referral data
        console.log('Found existing referral:', existingReferral);
        referralData = existingReferral;
      } else {
        // Create new referral
        console.log('Creating new referral for mobile:', referralMobile);
        
        const insertData = {
          mobile_number: referralMobile,
          referral_code: referralMobile,
          referral_count: 0
        };
        
        console.log('Insert data:', insertData);
        
        const { data: newReferral, error: insertError } = await supabase
          .from('referrals')
          .insert(insertData)
          .select()
          .single();

        if (insertError) {
          console.error('Database insert error:', insertError.message);
          // Fall back to offline mode instead of showing error
          generateOfflineQR();
          return;
        }

        console.log('Successfully created new referral:', newReferral);
        referralData = newReferral;
      }

      const qrCode = `QR:https://initiators-tools.com?ref=${referralMobile}`;
      const referralUrl = `https://initiators.shop/ref?num=91${referralMobile}`;
      
      console.log('Setting referral data for card display');
      setReferralData({
        mobileNumber: referralData.mobile_number,
        referralUrl: referralUrl,
        qrCode: qrCode,
        points: 0,
        referralCount: referralData.referral_count
      });
      
      console.log('Showing referral card');
      setShowReferralCard(true);
      
    } catch (error) {
      console.error('Unexpected error in generateReferralQR:', error);
      // Fall back to offline mode on any error
      generateOfflineQR();
    } finally {
      setLoadingReferral(false);
    }
  };

  // Offline QR generation (when database is unavailable)
  const generateOfflineQR = () => {
    console.log('Generating QR in offline mode for:', referralMobile);
    
    const qrCode = `QR:https://initiators-tools.com?ref=${referralMobile}`;
    const referralUrl = `https://initiators.shop/ref?num=91${referralMobile}`;
    
    setReferralData({
      mobileNumber: referralMobile,
      referralUrl: referralUrl,
      qrCode: qrCode,
      points: 0,
      referralCount: 0
    });
    
    setShowReferralCard(true);
    setLoadingReferral(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralData.referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
    showToast("Copied to clipboard!");
  };

  const shareOnWhatsApp = () => {
    const message = `Bhai, check out Initiators Services for premium OTT & Tools! Use my link to get deals and I get ₹30 cashback: ${referralData.referralUrl}`;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank');
    showToast("Shared on WhatsApp!");
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2000);
  };

  const downloadReferralCard = () => {
    const element = document.getElementById('referral-card');
    if (!element) return;

    // Create a canvas and convert the card to image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (phone screen size)
    canvas.width = 375;
    canvas.height = 667;

    // Draw background gradient (Deep Purple/Black)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a0033');
    gradient.addColorStop(0.5, '#2d1b69');
    gradient.addColorStop(1, '#0a0014');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add neon pink glow effect
    ctx.shadowColor = '#ff1493';
    ctx.shadowBlur = 20;

    // Draw title
    ctx.fillStyle = '#ff1493';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('INITIATORS TOOLS', 20, 60);

    // Draw QR code placeholder (center)
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText('QR CODE', 140, 320);
    ctx.font = '12px Arial';
    ctx.fillText(referralData.qrCode.substring(0, 30) + '...', 80, 340);

    // Draw referral code
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`Referral Code: ${referralData.mobileNumber}`, 50, 600);

    // Download the image
    const link = document.createElement('a');
    link.download = 'referral-card.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Check for referral parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref');
    if (refParam) {
      // Store referral info for WhatsApp message
      localStorage.setItem('referralCode', refParam);
    }
  }, []);

  return (
    <section className="px-3 py-8 md:px-4 md:py-12 max-w-7xl mx-auto">
      <div className="relative max-w-xl mx-auto mb-8 md:mb-12">
        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
        <input 
          type="text" 
          placeholder="Search services..." 
          className="w-full pl-10 md:pl-12 pr-16 md:pr-20 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-full text-white text-sm md:text-base focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 md:px-4 py-1 md:py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs md:text-sm font-medium rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
        >
          Search
        </button>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto"
            >
              <div className="p-2">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                      {suggestion.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {highlightMatch(suggestion, searchTerm)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {allSubscriptions.find(sub => sub.name === suggestion)?.category}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-6 md:mb-8 relative">
        {["All", "OTT", "Softwares", "AI", "Utility", "VPN", "Food", "Combo Packs"].map((cat) => (
          <motion.button
            key={cat}
            onClick={() => {
              setCategory(cat as Category);
              setSearchTerm("");
              setActiveFilter("");
              setShowSuggestions(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 relative ${
              category === cat 
                ? "text-white shadow-lg" 
                : "text-gray-400 border border-white/20 hover:text-white"
            }`}
          >
            {category === cat && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full"
                style={{
                  boxShadow: "0 0 20px rgba(236, 72, 153, 0.3), 0 0 40px rgba(168, 85, 247, 0.2)"
                }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </motion.button>
        ))}
      </div>

      {category === "OTT" && (
        <div className="flex justify-center gap-3 md:gap-4 mb-8 md:mb-12">
          <button onClick={() => {
            setAccessType("Shared");
            setSearchTerm("");
            setActiveFilter("");
            setShowSuggestions(false);
          }} className={`px-4 md:px-6 py-2 rounded-lg flex items-center gap-2 text-xs md:text-sm ${accessType === "Shared" ? "bg-white/20 text-white" : "text-gray-500"}`}><Lock className="text-lg md:text-xl"/> Shared</button>
          <button onClick={() => {
            setAccessType("Personal");
            setSearchTerm("");
            setActiveFilter("");
            setShowSuggestions(false);
          }} className={`px-4 md:px-6 py-2 rounded-lg flex items-center gap-2 text-xs md:text-sm ${accessType === "Personal" ? "bg-white/20 text-white" : "text-gray-500"}`}><FileText className="text-lg md:text-xl"/> Personal</button>
        </div>
      )}

      {/* Comparison Table */}
      {category === "OTT" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Shared vs Personal: Which one is for you?</h2>
            </div>
            <p className="text-gray-400 text-sm">Choose the best plan according to your needs and budget.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            {/* Mobile Responsive Wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-white font-semibold">Feature</th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4 text-orange-400" />
                        Shared Access
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-white font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4 text-green-400" />
                        Personal Access
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-gray-300 font-medium">Price</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 font-medium">Budget Friendly</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">Premium Price</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-gray-300 font-medium">Privacy</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400">Shared with others</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">100% Private</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-gray-300 font-medium">Profile Lock</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400">No (Use Admin Profile)</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Yes (Your own PIN)</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-gray-300 font-medium">Device Login</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400">1 Device Only</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Multiple Devices</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-300 font-medium">Password Change</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400">Not Allowed</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Fully Allowed</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
          key={category}
          layout
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
        >
          <AnimatePresence mode="wait">
            {filtered.map((sub, index) => (
              <motion.div
                key={sub.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.05
                  }
                }}
                exit={{ 
                  opacity: 0,
                  y: -20,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`backdrop-blur-xl bg-black/40 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.1)] ${sub.isVIP ? 'border-[#FFD700]/30 hover:border-[#FFD700]/50 shadow-[0_4px_30px_rgba(255,215,0,0.15)] hover:shadow-[0_8px_40px_rgba(255,215,0,0.25),0_0_30px_rgba(255,215,0,0.3)]' : sub.isCombo ? 'border-purple-400/30 hover:border-purple-400/50 shadow-[0_4px_30px_rgba(168,85,247,0.15)] hover:shadow-[0_8px_40px_rgba(168,85,247,0.25),0_0_30px_rgba(168,85,247,0.3)]' : `border-white/10 hover:border-pink-500/40 shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(236,72,153,0.25),0_0_30px_rgba(236,72,153,0.3)]`} p-3 md:p-5 rounded-2xl relative group transition-all duration-300 h-full flex flex-col`}
              >
                {/* Heart/Wishlist Button - Top Right Corner */}
                <motion.button
                  onClick={() => {
                    playClickSound();
                    if (isInWishlist(sub.id)) {
                      removeItem(sub.id);
                      showToast("Removed from wishlist");
                    } else {
                      addItem(sub);
                      showToast("Added to wishlist!");
                    }
                  }}
                  onMouseEnter={playHoverSound}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="absolute top-3 right-3 md:top-4 md:right-4 p-3 md:p-2 rounded-full border transition-all duration-300 hover:scale-110 z-10 bg-black/30 backdrop-blur-sm"
                  style={{ borderColor: isInWishlist(sub.id) ? 'rgba(236, 72, 153, 0.8)' : 'rgba(255, 255, 255, 0.1)' }}
                >
                  <Heart size={16} className={`w-4 h-4 md:w-[18px] md:h-[18px] ${isInWishlist(sub.id) ? 'fill-pink-500 text-pink-500' : 'text-gray-400 hover:text-pink-400'}`} />
                </motion.button>

                {/* VIP Limited Seats Badge */}
                {sub.isVIP && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 md:-top-3">
                    <span className="px-1.5 py-0.5 md:px-2 md:py-0.5 bg-red-500 text-white text-[8px] md:text-[10px] font-bold rounded-full shadow-lg animate-pulse">
                      Limited Seats
                    </span>
                  </div>
                )}

                {/* Combo Badge */}
                {sub.isCombo && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 md:-top-3">
                    <span className="px-1.5 py-0.5 md:px-2 md:py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-[8px] md:text-[10px] font-bold rounded-full shadow-lg">
                      Value Pack
                    </span>
                  </div>
                )}

                {/* Hot Deal Badge for regular cards */}
                {!sub.isVIP && !sub.isCombo && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 md:-top-3">
                    <span className="px-1.5 py-0.5 md:px-2 md:py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[8px] md:text-[10px] font-bold rounded-full shadow-lg">
                      Hot Deal
                    </span>
                  </div>
                )}

                <div className={`w-10 h-10 md:w-12 md:h-12 ${sub.bgColor} ${sub.isVIP ? 'border border-[#FFD700]' : 'border border-white/20'} rounded-xl mb-3 md:mb-4 flex flex-col items-center justify-center font-bold text-white overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]`}>
                  {/* Dark overlay for better contrast */}
                  <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                  {sub.logoUrl ? (
                    <img 
                      src={sub.logoUrl} 
                      alt={sub.name}
                      className="w-full h-full object-contain p-1 relative z-10 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] brightness-110"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          // Show styled fallback text with service name
                          const fallback = parent.querySelector('.image-fallback');
                          if (fallback) fallback.classList.remove('hidden');
                        }
                      }}
                    />
                  ) : null}
                  {/* Logo Text Fallback (for cards without logoUrl) */}
                  <div className={`fallback-logo flex flex-col items-center justify-center relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${sub.logoUrl ? 'hidden' : ''}`}>
                    <span className="text-base md:text-lg">{sub.logo}</span>
                    <span className="text-[7px] md:text-[8px]">{sub.logoSubtext}</span>
                  </div>
                  {/* Image Error Fallback - Shows service name when image fails */}
                  <div className={`image-fallback hidden flex-col items-center justify-center relative z-10 text-center px-1`}>
                    <span className="text-[9px] md:text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] leading-tight">{sub.name}</span>
                  </div>
                </div>

                <h3 className={`font-bold text-sm md:text-base mb-1 ${sub.isVIP ? 'text-[#FFD700]' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'}`}>{sub.name}</h3>
                <p className="text-gray-400 text-[10px] md:text-xs mb-2 md:mb-3">{sub.period}</p>
                
                {/* Price with Original Price for Combos */}
                <div className="flex items-baseline gap-2 mb-3 md:mb-4">
                  {sub.id === 45 ? (
                    <span className={`text-xl md:text-2xl font-bold ${sub.isVIP ? 'text-[#FFD700]' : 'text-white'}`}>{sub.period}</span>
                  ) : (
                    <>
                      <span className={`text-xl md:text-2xl font-bold ${sub.isVIP ? 'text-[#FFD700]' : 'text-white drop-shadow-[0_0_8px_rgba(255,0,150,0.6)]'}`}>{sub.price}</span>
                      {sub.originalPrice && (
                        <span className="text-gray-500 text-xs md:text-sm line-through ml-2">{sub.originalPrice}</span>
                      )}
                    </>
                  )}
                </div>

                <p className="text-gray-400 text-[9px] md:text-xs mb-3 md:mb-4 line-clamp-2">{sub.description}</p>

                <div className="flex gap-1.5 md:gap-2 mt-auto">
                  <motion.button 
                    onClick={() => {
                      playClickSound();
                      const referralCode = localStorage.getItem('referralCode');
                      const baseMessage = sub.isVIP 
                        ? `Hi, I'm interested in VIP Membership. Please send payment details for 99 Yearly Pass!`
                        : `I want to buy ${sub.name}`;
                      const referralText = referralCode ? `\n\n Referred by: ${referralCode}` : '';
                      window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(baseMessage + referralText)}`);
                    }}
                    onMouseEnter={playHoverSound}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className={`flex-1 py-3 md:py-2.5 min-h-[48px] md:min-h-auto rounded-xl font-bold text-xs md:text-sm ${sub.isVIP 
                      ? 'bg-gradient-to-r from-[#FFD700] to-yellow-600 text-black hover:from-yellow-600 hover:to-orange-600 hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]' 
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]'
                    } transition-all duration-300`}
                  >
                    Buy Now
                  </motion.button>
                  <motion.button 
                    onClick={() => {
                      playClickSound();
                      if (isInCart(sub.id)) {
                        // Remove from cart
                        removeFromCart(sub.id);
                        showToast("Removed from cart");
                      } else {
                        // Add to cart
                        addToCart({
                          id: sub.id,
                          name: sub.name,
                          price: sub.price,
                          period: sub.period,
                          bgColor: sub.bgColor
                        });
                        setAddedAnimation(sub.id);
                        setTimeout(() => setAddedAnimation(null), 1000);
                        setAddedProduct(sub);
                        setMiniCartOpen(true);
                      }
                    }}
                    onMouseEnter={playHoverSound}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className={`px-3 md:px-3 py-3 md:py-2.5 min-w-[48px] md:min-w-auto min-h-[48px] md:min-h-auto rounded-xl font-bold text-xs md:text-sm border-2 transition-all duration-300 ${isInCart(sub.id)
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'border-white/20 text-gray-400 hover:border-purple-400 hover:text-purple-400'
                    } ${addedAnimation === sub.id ? 'scale-110' : ''}`}
                  >
                    {addedAnimation === sub.id ? (
                      <span className="text-red-400 text-[10px] md:text-xs">Added!</span>
                    ) : isInCart(sub.id) ? (
                      <span className="text-white text-[10px] md:text-xs">Remove</span>
                    ) : (
                      <ShoppingCart size={14} className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
                    )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Refer & Earn Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-16 mb-12"
      >
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Refer & Earn Cashback</h2>
          </div>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto px-4">
            Turn your friends into discounts! Generate your unique QR and start earning.
          </p>
        </div>

        {/* How It Works - 3 Step Guide */}
        <div className="max-w-4xl mx-auto mb-8 md:mb-12">
          <h3 className="text-lg md:text-xl font-semibold text-white text-center mb-6 md:mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Step 1 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 text-center"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <QrCode className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-purple-400 mb-1 md:mb-2">Step 1</div>
              <h4 className="text-white font-semibold text-sm md:text-base mb-1 md:mb-2">Generate QR</h4>
              <p className="text-gray-400 text-xs md:text-sm">
                Enter your mobile number and generate your unique Referral QR Card.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 text-center"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Share2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-purple-400 mb-1 md:mb-2">Step 2</div>
              <h4 className="text-white font-semibold text-sm md:text-base mb-1 md:mb-2">Share with Friends</h4>
              <p className="text-gray-400 text-xs md:text-sm">
                Share the card on your WhatsApp Status or with friends.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 text-center"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Gift className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-purple-400 mb-1 md:mb-2">Step 3</div>
              <h4 className="text-white font-semibold text-sm md:text-base mb-1 md:mb-2">Earn Cashback</h4>
              <p className="text-gray-400 text-xs md:text-sm">
                When your friend buys using your QR, they get a discount, and you get <span className="text-green-400 font-bold">50 cashback</span> on your next order!
              </p>
            </motion.div>
          </div>
        </div>

        {/* QR Generator */}
        <div className="max-w-md mx-auto mb-6 md:mb-8 px-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
            <div className="mb-3 md:mb-4">
              <label className="block text-gray-300 text-xs md:text-sm font-medium mb-2">
                Enter Your Mobile Number
              </label>
              <input
                type="text"
                value={referralMobile}
                onChange={(e) => setReferralMobile(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm md:text-base placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && generateReferralQR()}
              />
            </div>
            <button
              onClick={generateReferralQR}
              disabled={!referralMobile.trim() || !/^\d{10}$/.test(referralMobile) || loadingReferral}
              className="w-full py-2.5 md:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm md:text-base rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loadingReferral ? (
                <>
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-xs md:text-sm">Generating...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm">Generate My QR</span>
                </>
              )}
            </button>
          </div>
        </div>
        {/* Referral Card Display */}
        <AnimatePresence>
          {showReferralCard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex justify-center"
            >
              <div 
                id="referral-card"
                className="w-[320px] md:w-[375px] h-[568px] md:h-[667px] bg-gradient-to-br from-purple-950 via-pink-950 to-purple-950 rounded-3xl p-4 md:p-8 relative overflow-hidden shadow-2xl border border-pink-500/20"
                style={{
                  boxShadow: "0 0 40px rgba(236, 72, 153, 0.4), 0 0 80px rgba(168, 85, 247, 0.2)"
                }}
              >
                {/* Neon Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-purple-500/10 rounded-3xl"></div>
                
                {/* Card Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="text-center mb-4 md:mb-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                      <span className="text-white font-bold text-lg md:text-xl">IT</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-pink-400 mb-1 md:mb-2">
                      Initiators Tools
                    </h3>
                    <p className="text-gray-300 text-xs md:text-sm">Refer & Earn Program</p>
                  </div>

                  {/* Cashback Branding */}
                  <div className="text-center mb-4 md:mb-6">
                    <p className="text-sm md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 leading-tight">
                      Share this link & Get ₹30 Instant Cashback on every successful referral!
                    </p>
                  </div>

                  {/* QR Code Area */}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-36 h-36 md:w-48 md:h-48 bg-white rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-xl">
                      <div className="text-center">
                        <QrCode className="w-18 h-18 md:w-24 md:h-24 text-purple-600 mx-auto mb-1 md:mb-2" />
                        <p className="text-[10px] md:text-xs text-gray-600">Scan to Refer</p>
                      </div>
                    </div>
                    <div className="text-center mb-4 md:mb-6">
                      <p className="text-gray-300 text-xs md:text-sm mb-1 md:mb-2">Referral Code:</p>
                      <p className="text-xl md:text-2xl font-bold text-green-400">{referralData.mobileNumber}</p>
                    </div>
                  </div>

                  {/* Stylish Neon Link Box */}
                  <div className="mb-3 md:mb-4">
                    <div className="bg-black/40 backdrop-blur-sm border-2 border-green-400/50 rounded-xl p-3 md:p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-500/10"></div>
                      <div className="relative z-10">
                        <p className="text-[10px] md:text-xs text-green-400 mb-1 font-semibold">Your Referral Link</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] md:text-sm text-white break-all flex-1">{referralData.referralUrl}</p>
                          <button
                            onClick={copyToClipboard}
                            className={`px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all duration-300 flex items-center gap-1 ${
                              copied 
                                ? 'bg-green-500 text-white' 
                                : 'bg-white/10 text-green-400 hover:bg-green-500 hover:text-white'
                            }`}
                          >
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Share Button */}
                  <button
                    onClick={shareOnWhatsApp}
                    className="w-full py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-xs md:text-sm rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/30"
                  >
                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm">Share on WhatsApp</span>
                  </button>

                  {/* Footer */}
                  <div className="text-center mt-3 md:mt-4">
                    <div className="grid grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4">
                      <div className="bg-white/10 rounded-lg p-2 md:p-3">
                        <div className="flex items-center justify-center gap-1 md:gap-2 text-green-400 mb-1">
                          <Gift className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-[10px] md:text-xs">Points</span>
                        </div>
                        <p className="text-lg md:text-xl font-bold text-green-400">{referralData.points}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2 md:p-3">
                        <div className="flex items-center justify-center gap-1 md:gap-2 text-blue-400 mb-1">
                          <Users className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-[10px] md:text-xs">Referrals</span>
                        </div>
                        <p className="text-lg md:text-xl font-bold text-blue-400">{referralData.referralCount}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-[10px] md:text-xs">Share with friends & earn ₹30 cashback per referral</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {showReferralCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex gap-3 md:gap-4 justify-center mt-6 md:mt-8 flex-col sm:flex-row px-4"
          >
            <button
              onClick={downloadReferralCard}
              className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-xs md:text-sm rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm">Download Image</span>
            </button>
            <button
              onClick={() => window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(`Hey! Check out this amazing service: ${referralData.referralUrl}`)}`, '_blank')}
              className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-xs md:text-sm rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
            >
              <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm">Share on WhatsApp</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Mini Cart Confirmation Drawer */}
      {addedProduct && (
        <MiniCartConfirmation
          isOpen={miniCartOpen}
          onClose={() => setMiniCartOpen(false)}
          product={{
            id: addedProduct.id,
            name: addedProduct.name,
            price: addedProduct.price,
            period: addedProduct.period,
            bgColor: addedProduct.bgColor
          }}
        />
      )}
    </section>
  );
}




