"use client"
import React, { useState } from 'react';

const Dashboard = () => {
  const [apiType, setApiType] = useState<'message' | 'langchain'>('message');
  const [darkMode, setDarkMode] = useState(false);

  // Handler for toggling the API type
  const handleToggleApi = () => {
    setApiType(prevType => (prevType === 'message' ? 'langchain' : 'message'));
  };

  // Handler for toggling dark mode
  const handleToggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  


  return (
    <div
      className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      <div className="w-1/4 bg-gray-100 p-4">
        {/* Back button */}
        <button
          className={`mb-4 ${
            darkMode ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-200'
          } p-2 rounded`}
          onClick={() => console.log('Back button clicked')}
        >
          Back
        </button>

        {/* Settings */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2 ">Settings</h2>
          {/* Your settings components here */}
        </div>
      </div>

      <div className="w-3/4 bg-white dark:bg-blue-400 p-4">
        {/* Upload and embed documents */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Upload and Embed Documents</h2>
          {/* Your upload and embed components here */}
        </div>

        {/* Current items in Pinecone database */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Current Items in Pinecone Database</h2>
          {/* Your current items components here */}
        </div>

        {/* Toggle API type */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">API Type OpenAI or LangChain</h2>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={apiType === 'langchain'}
              onChange={handleToggleApi}
            />
            <span>{apiType === 'langchain' ? 'Langchain' : 'OpenAI'}</span>
          </label>
        </div>
      </div>

      {/* Dark mode toggle */}
      <div className="fixed top-4 right-4">
        <label className="flex items-center">
          <span className="mr-2">Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={handleToggleDarkMode}
            className={`${
              darkMode ? 'bg-gray-900' : 'bg-gray-200'
            } relative inline-flex items-center h-6 rounded-full w-11`}
          />
          <span
            className={`${
              darkMode ? 'translate-x-6 bg-white' : 'translate-x-1 bg-gray-400'
            } inline-block w-4 h-4 transform rounded-full transition-transform`}
          />
        </label>
      </div>
    </div>
  );
};

export default Dashboard;
export let apiType: 'message' | 'langchain' = 'message';

