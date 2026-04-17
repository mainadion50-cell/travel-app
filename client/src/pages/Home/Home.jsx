import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'

const Home = () => {
  const navigate = useNavigate()

  const features = [
    { icon: '✈️', title: 'Trip Management', desc: 'Create, organize, and manage group trips with dates, destinations, and detailed itineraries.' },
    { icon: '👥', title: 'Group Coordination', desc: 'Invite travelers, assign roles, share real-time updates, and keep the whole group aligned.' },
    { icon: '💳', title: 'Payment Tracking', desc: 'Track contributions, send gentle reminders, and accept instant M-Pesa payments.' },
    { icon: '📅', title: 'Smart Booking', desc: 'Handle reservations, confirmations, cancellations, and availability in one dashboard.' },
    { icon: '📊', title: 'Powerful Dashboard', desc: 'Get complete visibility with analytics, reports, and insights for all your trips.' },
    { icon: '🔔', title: 'Instant Notifications', desc: 'Automated alerts for payments, schedule changes, and important trip updates.' },
  ]

  const stats = [
    { value: '500+', label: 'Successful Group Trips' },
    { value: '120+', label: 'Destinations Worldwide' },
    { value: '10,000+', label: 'Happy Travelers' },
    { value: 'M-Pesa', label: 'Seamless Payments' },
  ]

  const plans = [
    {
      name: 'Free',
      price: 'KES 0',
      period: '/month',
      desc: 'Perfect for small groups just getting started.',
      features: ['Up to 3 trips', 'Up to 10 members per trip', 'Basic payment tracking', 'Email support'],
      cta: 'Get Started Free',
      highlight: false,
    },
    {
      name: 'Pro',
      price: 'KES 999',
      period: '/month',
      desc: 'For active organizers managing multiple groups.',
      features: ['Unlimited trips', 'Unlimited members', 'M-Pesa payment integration', 'Advanced analytics', 'Priority support', 'Custom itineraries'],
      cta: 'Start Pro',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'KES 3,499',
      period: '/month',
      desc: 'For travel agencies and large organizations.',
      features: ['Everything in Pro', 'Multi-admin access', 'White-label branding', 'Dedicated account manager', 'API access', 'SLA guarantee'],
      cta: 'Contact Us',
      highlight: false,
    },
  ]

  const steps = [
    { step: '01', icon: '📝', title: 'Create Your Account', desc: 'Sign up in seconds. No credit card required to get started.' },
    { step: '02', icon: '🗺️', title: 'Plan Your Trip', desc: 'Add destination, dates, budget, and itinerary details for your group.' },
    { step: '03', icon: '👥', title: 'Invite Your Group', desc: 'Share your trip link and let members join and confirm their spots.' },
    { step: '04', icon: '💰', title: 'Collect Payments', desc: 'Members pay their share via M-Pesa. Track who has paid in real time.' },
    { step: '05', icon: '✅', title: 'Travel & Enjoy', desc: 'Everything is confirmed. Show up and make memories together.' },
  ]

  const team = [
    { name: 'Aisha Kamau', role: 'CEO & Co-founder', emoji: '👩🏾‍💼', desc: 'Former travel agent with 10+ years organizing group tours across East Africa.' },
    { name: 'Brian Otieno', role: 'CTO & Co-founder', emoji: '👨🏾‍💻', desc: 'Full-stack engineer passionate about building tools that simplify real-world problems.' },
    { name: 'Cynthia Wanjiru', role: 'Head of Payments', emoji: '👩🏾‍🔧', desc: 'Fintech specialist who built the M-Pesa integration powering seamless collections.' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-6 md:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <div className="relative z-10 max-w-4xl text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
            Travel Smarter<br />
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Together.</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            The all-in-one platform to plan, coordinate, and manage group travel effortlessly.
            Track payments, bookings, and keep everyone in sync.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-10 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 group"
            >
              Get Started Free
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-zinc-400 hover:border-white hover:bg-white/10 transition-all duration-300 px-10 py-4 rounded-2xl font-semibold text-lg"
            >
              See How It Works
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-400">
          <span className="text-xs tracking-widest">SCROLL TO EXPLORE</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-zinc-400 to-transparent" />
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-zinc-800 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-blue-500 mb-3">{stat.value}</div>
              <div className="text-zinc-400 text-sm md:text-base tracking-wider uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 md:px-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything you need for perfect group travel</h2>
          <p className="text-zinc-400 mt-4 text-lg max-w-xl mx-auto">
            Built specifically for group organizers and travelers who want simplicity and control.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 hover:border-blue-600/50 rounded-3xl p-10 transition-all duration-300 hover:-translate-y-2 group">
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 md:px-20 bg-zinc-900/40 border-y border-zinc-800">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">How It Works</h2>
          <p className="text-zinc-400 mt-4 text-lg max-w-xl mx-auto">
            From signup to takeoff in five simple steps.
          </p>
        </div>
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-blue-600/40 transition-all">
              <div className="text-5xl shrink-0">{step.icon}</div>
              <div>
                <div className="text-blue-500 text-sm font-bold tracking-widest mb-1">STEP {step.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 md:px-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-zinc-400 mt-4 text-lg max-w-xl mx-auto">
            No hidden fees. Choose the plan that fits your group size.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-3xl p-8 border flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                plan.highlight
                  ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-900/40'
                  : 'bg-zinc-900 border-zinc-800 hover:border-blue-600/40'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-blue-600 text-xs font-bold px-4 py-1 rounded-full tracking-wider">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <p className={`text-sm mb-4 ${plan.highlight ? 'text-blue-100' : 'text-zinc-400'}`}>{plan.desc}</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={`mb-1 ${plan.highlight ? 'text-blue-100' : 'text-zinc-400'}`}>{plan.period}</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span className={plan.highlight ? 'text-white' : 'text-zinc-300'}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/register')}
                className={`py-3 rounded-2xl font-semibold transition-all ${
                  plan.highlight
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-6 md:px-20 bg-zinc-900/40 border-y border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">About TravelGroup</h2>
            <p className="text-zinc-400 mt-4 text-lg max-w-2xl mx-auto">
              We built TravelGroup because organizing group trips in Kenya was unnecessarily painful —
              WhatsApp groups, manual M-Pesa collections, missed confirmations. We fixed that.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 mb-12 text-center">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              To make group travel accessible, organized, and enjoyable for every Kenyan —
              whether it's a weekend trip to Nakuru or a full safari across the Maasai Mara.
              We handle the logistics so you can focus on the experience.
            </p>
          </div>

          {/* Team */}
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center hover:border-blue-600/40 transition-all">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <div className="text-blue-400 text-sm font-medium mb-3">{member.role}</div>
                <p className="text-zinc-400 text-sm leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to plan your next adventure?</h2>
        <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
          Join thousands of group organizers already using TravelGroup to run smoother, more enjoyable trips.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-blue-600 hover:bg-blue-700 px-12 py-4 rounded-2xl font-semibold text-lg transition-all"
        >
          Get Started Free →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-zinc-800 py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white font-bold text-xl w-9 h-9 flex items-center justify-center rounded-xl">TG</div>
            <span className="text-white font-semibold text-lg">TravelGroup</span>
          </div>
          <div className="flex gap-8 text-zinc-500 text-sm">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#about" className="hover:text-white transition">About</a>
          </div>
          <p className="text-zinc-600 text-sm">© 2026 TravelGroup. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home