import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { BarChart3, Calendar, MessageSquare, Menu } from "lucide-react"
import logo from "../assets/logo.jpg"
import CampaignUploader from './CampaignUploader'


export default function CampaignDetails() {
  const navigate = useNavigate();

  const handleSendMessage = () => {
    alert('Your campaign was successfully created!');
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Campaign Details</h1>

      {/* Display user data for all customers */}
      <div className="mb-6 w-full max-w-3xl space-y-6 bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-blue-500">User Data</h2>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <p><strong>Name:</strong> John Smith</p>
            <p><strong>Email:</strong> john.smith@example.com</p>
            <p><strong>Preferences:</strong> Prefers eco-friendly hotels</p>
            <p><strong>Message:</strong> Hello John, based on your preference for eco-friendly hotels, we have a special offer just for you! Book now to enjoy exclusive benefits!</p>
          </div>

          <div className="border-b pb-4">
            <p><strong>Name:</strong> Emma Johnson</p>
            <p><strong>Email:</strong> emma.johnson@example.com</p>
            <p><strong>Preferences:</strong> Prefers luxury hotels</p>
            <p><strong>Message:</strong> Hello Emma, based on your preference for luxury hotels, we have a special offer just for you! Book now to enjoy exclusive benefits!</p>
          </div>

          <div className="border-b pb-4">
            <p><strong>Name:</strong> Liam Williams</p>
            <p><strong>Email:</strong> liam.williams@example.com</p>
            <p><strong>Preferences:</strong> Prefers budget-friendly hotels</p>
            <p><strong>Message:</strong> Hello Liam, based on your preference for budget-friendly hotels, we have a special offer just for you! Book now to enjoy exclusive benefits!</p>
          </div>

          <div className="border-b pb-4">
            <p><strong>Name:</strong> Ava Brown</p>
            <p><strong>Email:</strong> ava.brown@example.com</p>
            <p><strong>Preferences:</strong> Prefers beach resorts</p>
            <p><strong>Message:</strong> Hello Ava, based on your preference for beach resorts, we have a special offer just for you! Book now to enjoy exclusive benefits!</p>
          </div>

          <div className="border-b pb-4">
            <p><strong>Name:</strong> Noah Davis</p>
            <p><strong>Email:</strong> noah.davis@example.com</p>
            <p><strong>Preferences:</strong> Prefers boutique hotels</p>
            <p><strong>Message:</strong> Hello Noah, based on your preference for boutique hotels, we have a special offer just for you! Book now to enjoy exclusive benefits!</p>
          </div>

          <div className="border-b pb-4">
            <p><strong>Name:</strong> Mia Garcia</p>
            <p><strong>Email:</strong> mia.garcia@example.com</p>
            <p><strong>Preferences:</strong> Prefers family-friendly hotels</p>
            <p><strong>Message:</strong> Hello Mia, based on your preference for family-friendly hotels, we have a special offer just for you! Book now to enjoy exclusive benefits!</p>
          </div>

          <div className="border-b pb-4">
            <p><strong>Name:</strong> Oliver Martinez</p>
            <p><strong>Email:</strong> oliver.martinez@example.com</p>
            <p><strong>Preferences:</strong> Prefers city hotels</p>
            <p><strong>Message:</strong> Hello Oliver, based on your preference for city hotels, we have a special offer just for you! Book now to enjoy exclusive benefits!</p>
          </div>

          <div className="border-b pb-4">
            <p><strong>Name:</strong> Sophia Rodriguez</p>
            <p><strong>Email:</strong> sophia.rodriguez@example.com</p>
            <p><strong>Preferences:</strong> Prefers wellness retreats</p>
            <p><strong>Message:</strong> Hello Sophia, based on your preference for wellness retreats, we have a special offer just for you! Book now to enjoy exclusive benefits!</p>
          </div>

          <div className="border-b pb-4">
            <p><strong>Name:</strong> Elijah Wilson</p>
            <p><strong>Email:</strong> elijah.wilson@example.com</p>
            <p><strong>Preferences:</strong> Prefers adventure trips</p>
            <p><strong>Message:</strong> Hello Elijah, based on your preference for adventure trips, we have a special offer just for you! Book now to enjoy exclusive benefits!</p>
          </div>

          <div className="border-b pb-4">
            <p><strong>Name:</strong> Isabella Anderson</p>
            <p><strong>Email:</strong> isabella.anderson@example.com</p>
            <p><strong>Preferences:</strong> Prefers cultural experiences</p>
            <p><strong>Message:</strong> Hello Isabella, based on your preference for cultural experiences, we have a special offer just for you! Book now to enjoy exclusive benefits!</p>
          </div>

          {/* Example for Customer 50 */}
          <div className="border-b pb-4">
            <p><strong>Name:</strong> Mia Patel</p>
            <p><strong>Email:</strong> mia.patel@example.com</p>
            <p><strong>Preferences:</strong> Prefers urban hotels</p>
            <p><strong>Message:</strong> Hello Mia, based on your preference for urban hotels, we have a special offer just for you! Book now to enjoy exclusive benefits!</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSendMessage}
        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
      >
        Send Message
      </button>
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
