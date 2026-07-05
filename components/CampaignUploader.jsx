import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';   
import { useNavigate } from 'react-router-dom'; 

export default function CampaignUploader() {
  const [uploadedReport, setUploadedReport] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    setUploadedReport(e.target.files[0]);
  };

  const handleCreateCampaign = () => {
    setShowReport(true);
  };

  const handleTriggerCampaign = () => {
    navigate('/CampaignDetails') // Route to campaign details page
  }

  const predefinedReport = {
    campaignTitle: "End of Year Booking Surge",
    duration: "3 Weeks",
    predictedOccupancyIncrease: "12%",
    recommendedAdSpend: "$5000",
    targetAudience: "Families, Holiday Travelers",
    channels: ["Google Ads", "Facebook Ads", "Email Campaign"],
    contentExample: "Book early and save! Special holiday offers available for a limited time.",
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-10 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-extrabold text-blue-600">Upload Last Year's Report</h2>

      <div className="flex flex-col items-center w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-4">
        <input
          type="file"
          accept=".pdf,.csv,.xlsx"
          onChange={handleFileUpload}
          className="border border-gray-300 p-2 rounded w-full text-gray-700"
        />
        <Button
          className={`w-full py-3 text-lg font-semibold text-white rounded transition-colors ${
            uploadedReport ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={handleCreateCampaign}
          disabled={!uploadedReport}
        >
          Create AutoCampaign
        </Button>
      </div>

      {showReport && (
        <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-xl mt-6">
          <h3 className="text-2xl font-bold text-blue-500 mb-4">AutoCampaign Generated Report</h3>
          <ul className="text-gray-800 space-y-3">
            <li>
              <strong className="text-gray-900">Campaign Title:</strong> {predefinedReport.campaignTitle}
            </li>
            <li>
              <strong className="text-gray-900">Duration:</strong> {predefinedReport.duration}
            </li>
            <li>
              <strong className="text-gray-900">Predicted Occupancy Increase:</strong> {predefinedReport.predictedOccupancyIncrease}
            </li>
            <li>
              <strong className="text-gray-900">Recommended Ad Spend:</strong> {predefinedReport.recommendedAdSpend}
            </li>
            <li>
              <strong className="text-gray-900">Target Audience:</strong> {predefinedReport.targetAudience}
            </li>
            <li>
              <strong className="text-gray-900">Channels:</strong> {predefinedReport.channels.join(", ")}
            </li>
            <li>
              <strong className="text-gray-900">Content Example:</strong> {predefinedReport.contentExample}
            </li>
          </ul>

          <button
            onClick={handleTriggerCampaign}
            className="w-full mt-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Trigger Campaign
          </button>
        </div>
      )}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">
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
    
  );
}
