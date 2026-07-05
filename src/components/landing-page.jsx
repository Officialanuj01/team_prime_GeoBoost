import React, { useState, useEffect } from 'react'
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { BarChart3, Calendar, MessageSquare, Menu } from "lucide-react"
import logo from "../assets/logo.jpg"
import CampaignUploader from './CampaignUploader'
import { useNavigate,Link } from 'react-router-dom'
// import { Link } from 'lucide-react'


export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)
  const [email, setEmail] = useState('')
  const navigate = useNavigate(); 
  // const navigate = useNavigate(); 

  const features = [
    { icon: <Calendar className="h-12 w-12 text-blue-400" />, title: "Intelligent Timing", description: "Automatically determine the optimal time to launch campaigns based on real-time data and historical trends." },
    { icon: <MessageSquare className="h-12 w-12 text-green-400" />, title: "Dynamic Content Creation", description: "Generate tailored marketing content that resonates with your target audience, increasing conversion rates." },
    { icon: <BarChart3 className="h-12 w-12 text-purple-400" />, title: "Real-time Analytics", description: "Monitor campaign performance and occupancy rates with intuitive dashboards and actionable insights." },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Thank you for subscribing with email: ${email}`)
    setEmail('')
  }

  const handleGetStarted = () => {
    navigate('/CampaignUploader');  // Navigate to the Get Started page when clicked
  };

  const handleNotificationSender = () => {
    navigate('/NotificationSender');  // Corrected path
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800">
        <a className="flex items-center justify-center" href="#">
          <img src={logo} className="h-6 w-6 text-blue-400" />
          <span className="ml-2 font-bold text-xl">Lodging Lift</span>
          {/* <img src={logo} className="h-6 w-6 text-blue-400" /> */}
          {/* <span className="ml-2 font-bold text-xl">Lodging Lift</span> */}
        </a>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
          <a className="text-sm font-medium hover:text-blue-400 transition-colors" href="#">
            Features
          </a>
          <a className="text-sm font-medium hover:text-blue-400 transition-colors" href="#">
            Pricing
          </a>
          <a className="text-sm font-medium hover:text-blue-400 transition-colors" href="#">
            About
          </a>
          <a className="text-sm font-medium hover:text-blue-400 transition-colors" href="#">
            Notification
          </a>
          {/* <a href="" onClick={handleNotificationSender }>Anuj</a> */}
        </nav>
        <Button
          className="ml-auto md:hidden"
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </header>
      {isMenuOpen && (
        <nav className="flex flex-col items-center gap-4 p-4 bg-gray-800 md:hidden">
          <a className="text-sm font-medium hover:text-blue-400 transition-colors" href="#">
            Features
          </a>
          <a className="text-sm font-medium hover:text-blue-400 transition-colors" href="#">
            Pricing
          </a>
          <a className="text-sm font-medium hover:text-blue-400 transition-colors" href="#">
            About
          </a>
          <a className="text-sm font-medium hover:text-blue-400 transition-colors" href="#">
            Contact
          </a>

        </nav>
      )}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none animate-fade-in-down">
                  Maximize Occupancy with Minimize Efforts
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl animate-fade-in-up">
                  Automate your marketing campaigns, optimize timing, and boost occupancy rates during low seasons with
                  our intelligent hotel management solution.
                </p>
              </div>
              <div className="space-x-4">
                <Button onClick = {handleGetStarted} className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"> Upload fie to Get Started</Button>
                {/* <Button onClick = {handleGetStarted} className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"> Upload fie to Get Started</Button> */}
                <Button variant="outline" className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900 transition-colors">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800 overflow-hidden">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-400">Key Features</h2>
            <div className="relative w-full max-w-md mx-auto h-[300px]">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`absolute top-0 w-full p-6 bg-gray-700 rounded-lg shadow-lg transition-all duration-500 ease-in-out ${
                    index === currentFeature
                      ? 'left-0 opacity-100'
                      : index === (currentFeature + 1) % features.length
                      ? 'left-full opacity-0'
                      : '-left-full opacity-0'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    {feature.icon}
                    <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
                    <p className="text-sm text-gray-300 mt-2">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-blue-400">
                  Empower Your Hotel Management Team
                </h2>
                <p className="max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our solution streamlines operations for Revenue Managers, Sales & Marketing teams, and General
                  Managers, allowing them to focus on strategy rather than manual campaign management.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-4">
                  <li className="flex items-center gap-4 animate-fade-in-left">
                    <CheckIcon className="h-6 w-6 text-green-400" />
                    <span className="text-lg">Minimize manual intervention</span>
                  </li>
                  <li className="flex items-center gap-4 animate-fade-in-left" style={{ animationDelay: '0.2s' }}>
                    <CheckIcon className="h-6 w-6 text-green-400" />
                    <span className="text-lg">Increase operational efficiency</span>
                  </li>
                  <li className="flex items-center gap-4 animate-fade-in-left" style={{ animationDelay: '0.4s' }}>
                    <CheckIcon className="h-6 w-6 text-green-400" />
                    <span className="text-lg">Drive higher occupancy rates</span>
                  </li>
                  <li className="flex items-center gap-4 animate-fade-in-left" style={{ animationDelay: '0.6s' }}>
                    <CheckIcon className="h-6 w-6 text-green-400" />
                    <span className="text-lg">Optimize revenue during low seasons</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-blue-400">
                  Ready to Boost Your Hotel's Occupancy?
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join the revolution in hotel management. Sign up now to learn how our AI-driven solution can transform
                  your occupancy rates and streamline your marketing efforts.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2" onSubmit={handleSubmit}>
                <input
                  class=" font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-blue-950 outline-none duration-300 placeholder:text-white placeholder:opacity-50 rounded-lg px-4 py-1 shadow-md focus:shadow-lg focus:shadow-blue-300 max-w-lg flex-1 bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-blue-400"
                  autocomplete="off"
                  placeholder="Enter email here"
                  name="text"
                  type="text"
                />
                  <Button type="submit" className="bg-green-600 text-white hover:bg-green-700 transition-colors">Subscribe</Button>
                </form>
                <p className="text-xs text-gray-400">
                  By subscribing, you agree to our Terms & Conditions and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">
          © 2024 Lodging Lift. All rights reserved.
          © 2024 Lodging Lift. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:text-blue-400 transition-colors" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:text-blue-400 transition-colors" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  )
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}