import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Search, Menu, X, ChevronRight, Star, ArrowRight, LayoutDashboard, User, LogOut, Trash2, Edit, Plus, Filter, SlidersHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn, Product, MOCK_PRODUCTS, CATEGORIES, FABRICS, SIZES } from './types';
import { GoogleGenAI } from "@google/genai";

// --- Components ---

const Navbar = ({ onCartOpen, isAdmin }: { onCartOpen: () => void; isAdmin?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/collections' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "glass py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-dark">
            LUXE<span className="text-accent">HOME</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent",
                  location.pathname === link.path ? "text-accent" : "text-dark/70"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-accent/10 rounded-full transition-colors">
            <Search size={20} />
          </button>
          <Link to="/admin" className="p-2 hover:bg-accent/10 rounded-full transition-colors hidden sm:block">
            <LayoutDashboard size={20} />
          </Link>
          <button 
            onClick={onCartOpen}
            className="p-2 hover:bg-accent/10 rounded-full transition-colors relative"
          >
            <ShoppingBag size={20} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[10px] flex items-center justify-center rounded-full">
              2
            </span>
          </button>
          <button 
            className="md:hidden p-2 hover:bg-accent/10 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-primary p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-serif font-bold">LUXEHOME</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-serif hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/admin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-3xl font-serif hover:text-accent transition-colors"
              >
                Admin Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-primary product-card-shadow transition-all duration-500">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.discountPrice && (
            <span className="bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Sale
            </span>
          )}
          {product.trending && (
            <span className="bg-sage text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Trending
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button className="p-2 bg-white rounded-full hover:bg-accent hover:text-white transition-colors shadow-lg">
            <Heart size={18} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full py-3 bg-dark text-white text-sm font-medium rounded-xl hover:bg-accent transition-colors shadow-xl">
            Quick Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-medium text-dark group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="text-accent font-semibold">${product.discountPrice}</span>
              <span className="text-dark/40 text-xs line-through">${product.price}</span>
            </>
          ) : (
            <span className="text-dark font-semibold">${product.price}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold">Shopping Bag (2)</h2>
              <button onClick={onClose} className="p-2 hover:bg-primary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {[MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]].map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-24 h-32 rounded-xl bg-primary overflow-hidden flex-shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-xs text-dark/50 mt-1">Size: King | Color: Beige</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded-lg">
                        <button className="px-2 py-1 hover:bg-primary">-</button>
                        <span className="px-3 text-sm">1</span>
                        <button className="px-2 py-1 hover:bg-primary">+</button>
                      </div>
                      <span className="font-semibold">${item.discountPrice || item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t bg-primary/30 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark/60">Subtotal</span>
                <span className="font-semibold">$144.00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark/60">Shipping</span>
                <span className="text-sage font-medium">Free</span>
              </div>
              <div className="pt-4 border-t flex items-center justify-between">
                <span className="font-serif font-bold text-lg">Total</span>
                <span className="font-serif font-bold text-lg">$144.00</span>
              </div>
              <button className="w-full py-4 bg-dark text-white rounded-xl font-medium hover:bg-accent transition-colors shadow-lg">
                Checkout Now
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Pages ---

const HomePage = () => {
  return (
    <div className="pt-0">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1505693322210-b31410ef4fc3?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero Bedroom"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-dark/30" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-white/80 uppercase tracking-[0.3em] text-xs font-bold mb-4"
          >
            Premium Home Textiles
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight"
          >
            Transform Your Home <br /> Into Comfort
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark rounded-full font-medium hover:bg-accent hover:text-white transition-all duration-300 group"
            >
              Shop Collection
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Curated Collections</h2>
            <p className="text-dark/60 max-w-md">Explore our range of premium textiles designed for your ultimate comfort and style.</p>
          </div>
          <Link to="/shop" className="text-accent font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Bedsheets', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800' },
            { name: 'Cushions', img: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800' },
            { name: 'Blankets', img: 'https://images.unsplash.com/photo-1580305751101-6df6ec73f1f2?auto=format&fit=crop&q=80&w=800' },
          ].map((cat, i) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer"
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-serif text-white mb-2">{cat.name}</h3>
                <span className="text-white/80 text-sm font-medium border-b border-white/40 pb-1 group-hover:border-white transition-colors">Explore</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-24 bg-primary/30 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Trending Bedroom Styles</h2>
            <p className="text-dark/60">The most loved pieces from our latest collection.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_PRODUCTS.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best for Winter */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-dark rounded-[3rem] overflow-hidden flex flex-col md:flex-row">
          <div className="flex-1 p-12 md:p-20 flex flex-col justify-center">
            <span className="text-sage font-bold tracking-widest text-xs uppercase mb-4">Seasonal Pick</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Best for Winter</h2>
            <p className="text-white/60 mb-8 max-w-md">Discover our heavy-weight comforters and woolen blankets designed to keep you warm and cozy during the coldest nights.</p>
            <Link to="/shop?filter=winter" className="inline-flex items-center justify-center px-8 py-4 bg-sage text-white rounded-full font-medium hover:bg-white hover:text-dark transition-all w-fit">
              Shop Winter Collection
            </Link>
          </div>
          <div className="flex-1 min-h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1511401139252-f158d3209c17?auto=format&fit=crop&q=80&w=1000" 
              alt="Winter Collection" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-serif mb-2">Our Collection</h1>
          <p className="text-dark/60">Showing 24 products</p>
        </div>
        
        <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
          {['All', ...CATEGORIES].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat ? "bg-accent text-white shadow-lg" : "bg-primary text-dark/60 hover:bg-primary/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 space-y-8">
          <div>
            <h3 className="font-serif font-bold mb-4 flex items-center gap-2">
              <SlidersHorizontal size={18} /> Filters
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-dark/40 mb-3">Fabric</h4>
                <div className="space-y-2">
                  {FABRICS.map(f => (
                    <label key={f} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 border rounded flex items-center justify-center group-hover:border-accent transition-colors">
                        <Check size={10} className="text-accent opacity-0" />
                      </div>
                      <span className="text-sm text-dark/70">{f}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-dark/40 mb-3">Size</h4>
                <div className="grid grid-cols-2 gap-2">
                  {SIZES.map(s => (
                    <button key={s} className="px-3 py-2 border rounded-lg text-xs hover:border-accent hover:text-accent transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-dark/40 mb-3">Price Range</h4>
                <input type="range" className="w-full accent-accent" />
                <div className="flex justify-between text-xs text-dark/50 mt-2">
                  <span>$0</span>
                  <span>$500+</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
            {MOCK_PRODUCTS.map(product => (
              <ProductCard key={product.id + '-copy'} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailPage = () => {
  const [selectedSize, setSelectedSize] = useState('King');
  const [selectedColor, setSelectedColor] = useState('Beige');
  const [quantity, setQuantity] = useState(1);
  const [aiTips, setAiTips] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const product = MOCK_PRODUCTS[0];

  const generateCareTips = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 3 short, professional fabric care tips for a ${product.fabric} ${product.name}. Keep it elegant and helpful for a luxury home decor brand. Format as a bulleted list.`,
      });
      setAiTips(response.text || "Wash in cold water, avoid bleach, and tumble dry low.");
    } catch (error) {
      console.error(error);
      setAiTips("Wash in cold water, avoid bleach, and tumble dry low.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-[2rem] overflow-hidden bg-primary">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-primary cursor-pointer hover:opacity-80 transition-opacity">
                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-accent">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill={i <= 4 ? "currentColor" : "none"} />)}
              </div>
              <span className="text-xs text-dark/50">(124 Reviews)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-serif text-accent">${product.discountPrice || product.price}</span>
              {product.discountPrice && <span className="text-xl text-dark/30 line-through">${product.price}</span>}
            </div>
          </div>

          <p className="text-dark/70 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3">Size</h4>
              <div className="flex gap-2">
                {SIZES.map(s => (
                  <button 
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={cn(
                      "px-6 py-2 border rounded-xl text-sm transition-all",
                      selectedSize === s ? "border-accent bg-accent text-white shadow-lg" : "hover:border-accent"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3">Color</h4>
              <div className="flex gap-3">
                {['Beige', 'White', 'Sage'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 p-0.5 transition-all",
                      selectedColor === c ? "border-accent" : "border-transparent"
                    )}
                  >
                    <div className={cn(
                      "w-full h-full rounded-full",
                      c === 'Beige' ? "bg-[#F5F1E8]" : c === 'White' ? "bg-white border" : "bg-[#9CAF88]"
                    )} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center border rounded-xl p-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-primary rounded-lg">-</button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-primary rounded-lg">+</button>
              </div>
              <button className="flex-1 py-4 bg-dark text-white rounded-xl font-medium hover:bg-accent transition-all shadow-xl flex items-center justify-center gap-2">
                <ShoppingBag size={20} /> Add to Cart
              </button>
              <button className="p-4 border rounded-xl hover:bg-primary transition-colors">
                <Heart size={20} />
              </button>
            </div>
          </div>

          {/* AI Care Tips */}
          <div className="p-6 bg-sage/5 rounded-3xl border border-sage/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sage">Fabric Care Tips</h3>
              <button 
                onClick={generateCareTips}
                disabled={isGenerating}
                className="text-xs font-bold text-accent hover:underline disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Generate with AI"}
              </button>
            </div>
            {aiTips ? (
              <div className="text-sm text-dark/70 space-y-2 whitespace-pre-line">
                {aiTips}
              </div>
            ) : (
              <p className="text-xs text-dark/40 italic">Click generate to get personalized care instructions for this fabric.</p>
            )}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag size={16} className="text-accent" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest block">Free Shipping</span>
            </div>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto">
                <ArrowRight size={16} className="text-accent" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest block">Easy Returns</span>
            </div>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Check size={16} className="text-accent" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest block">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete the Look */}
      <section className="mt-24">
        <h2 className="text-3xl font-serif mb-12">Complete the Look</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.slice(1, 5).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-serif mb-2">Admin Dashboard</h1>
          <p className="text-dark/60">Welcome back, here's what's happening today.</p>
        </div>
        <button className="px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-dark transition-all shadow-lg flex items-center gap-2">
          <Plus size={20} /> Add New Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Revenue', value: '$45,231.89', change: '+12.5%', icon: <ShoppingBag /> },
          { label: 'Total Orders', value: '1,234', change: '+3.2%', icon: <ChevronRight /> },
          { label: 'Total Products', value: '48', change: '0%', icon: <LayoutDashboard /> },
          { label: 'Low Stock Alert', value: '3 Items', change: '-2', icon: <Filter />, warning: true },
        ].map(stat => (
          <div key={stat.label} className="p-6 bg-white rounded-3xl product-card-shadow border border-primary">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-xl", stat.warning ? "bg-red-50 text-red-500" : "bg-primary text-accent")}>
                {stat.icon}
              </div>
              <span className={cn("text-xs font-bold", stat.change.startsWith('+') ? "text-sage" : "text-dark/40")}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-dark/50 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</h3>
            <p className="text-2xl font-serif font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[2rem] product-card-shadow border border-primary overflow-hidden">
        <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-serif font-bold">Product Management</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2 bg-primary/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <button className="p-2 bg-primary rounded-xl hover:bg-primary/80 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary/30 text-[10px] font-bold uppercase tracking-widest text-dark/40">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/50">
              {MOCK_PRODUCTS.map(product => (
                <tr key={product.id} className="hover:bg-primary/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-[10px] text-dark/40">{product.fabric}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark/60">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-medium">${product.price}</td>
                  <td className="px-6 py-4 text-sm text-dark/60">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      product.stock > 10 ? "bg-sage/10 text-sage" : "bg-red-50 text-red-500"
                    )}>
                      {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-primary rounded-lg transition-colors text-dark/40 hover:text-accent">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-primary rounded-lg transition-colors text-dark/40 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t flex items-center justify-between text-sm text-dark/40">
          <p>Showing 1-5 of 48 products</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border rounded-xl hover:bg-primary transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 border rounded-xl hover:bg-primary transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <Link to="/" className="text-2xl font-serif font-bold tracking-tight">
            LUXE<span className="text-accent">HOME</span>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed">
            Crafting premium home textiles for those who value comfort, elegance, and quality. Transform your living space with our curated collections.
          </p>
        </div>
        <div>
          <h4 className="font-serif font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm text-white/50">
            <li><Link to="/shop" className="hover:text-accent transition-colors">Shop All</Link></li>
            <li><Link to="/collections" className="hover:text-accent transition-colors">Collections</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif font-bold mb-6">Customer Care</h4>
          <ul className="space-y-4 text-sm text-white/50">
            <li><Link to="/shipping" className="hover:text-accent transition-colors">Shipping Policy</Link></li>
            <li><Link to="/returns" className="hover:text-accent transition-colors">Returns & Exchanges</Link></li>
            <li><Link to="/faq" className="hover:text-accent transition-colors">FAQs</Link></li>
            <li><Link to="/size-guide" className="hover:text-accent transition-colors">Size Guide</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif font-bold mb-6">Newsletter</h4>
          <p className="text-sm text-white/50 mb-4">Join our community for exclusive offers and home decor inspiration.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent"
            />
            <button className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-white hover:text-dark transition-all">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/30">
        <p>© 2024 LUXEHOME. All rights reserved.</p>
        <div className="flex gap-8">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onCartOpen={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {location.pathname === '/' && <HomePage />}
            {location.pathname === '/shop' && <ShopPage />}
            {location.pathname.startsWith('/product/') && <ProductDetailPage />}
            {location.pathname === '/admin' && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
