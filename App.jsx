import LandingPage from './components/landing-page.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import LandingPage from "./components/landing-page.jsx"
import CampaignUploader from './components/CampaignUploader.jsx'
import CampaignDetails from './components/CampaignDetails.jsx'



function App() {
  return <Router>
    <Routes>
      {/* Define your routes here */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/CampaignUploader" element={<CampaignUploader />} />
      <Route path="/CampaignDetails" element={<CampaignDetails/>}/>
    </Routes>
  </Router>
}

export default App