import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigate } from 'react-router-dom';

export default function NotificationSender() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Initialize Google Generative AI with your API Key
  const genAI = new GoogleGenerativeAI("AIzaSyAZ_kDwYZ6BSinhzoH-E6AojakoL9XKKPk");

  // Mock customer data
  const customers = [
    { name: 'John Doe', bookedRoom: 'Suite', preference: 'beach' },
    { name: 'Jane Smith', bookedRoom: 'Double', preference: 'mountain' },
    { name: 'Mark Johnson', bookedRoom: 'Single', preference: 'city' },
  ];

  const handleGenerateMessages = async () => {
    setLoading(true);
    setError(null);
    const generatedResponses = [];

    for (const customer of customers) {
      const prompt = `Create a friendly marketing message for ${customer.name}, who previously booked a ${customer.bookedRoom} room and prefers ${customer.preference} trips, inviting them to visit again.`;

      try {
        // Generate content using the Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);

        generatedResponses.push({
          customer: customer.name,
          message: result.response.text(), // Get the text from the response
        });
      } catch (error) {
        setError('Failed to generate message: ' + error.message);
      }
    }

    setResponses(generatedResponses);
    setLoading(false);
  };

  const handleSendMessage = () => {
    alert('Messages sent successfully!'); // Show alert
    navigate('/'); // Navigate to the home page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-400">Lodging Lift - Marketing Messages</h1>
      </header>

      <main className="flex-1 p-4">
        <button 
          onClick={handleGenerateMessages} 
          disabled={loading} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {loading ? 'Generating...' : 'Generate Messages'}
        </button>

        {error && <p className="text-red-500 mt-4">Error: {error}</p>}
        
        <div className="mt-6 space-y-4">
          {responses.map((res, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded">
              <h2 className="text-xl font-bold text-blue-300">Message for {res.customer}</h2>
              <p className="mt-2 text-gray-200">{res.message}</p>
            </div>
          ))}
        </div>

        {responses.length > 0 && ( // Only show the button if there are responses
          <button 
            onClick={handleSendMessage} 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Send Messages
          </button>
        )}
      </main>
    </div>
  );
}
