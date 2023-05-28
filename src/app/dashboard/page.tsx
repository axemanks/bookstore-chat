// Dashboard
"use client"
import React, { useState, useEffect } from 'react';
import { getPineconeData } from '../../utils/getdbstats';
import { createCollection } from '../../utils/createCollection'; 
import addToPinecone from '../../utils/addtopinecone';




const indexName = process.env.INDEX_NAME ?? '';
const vectorDimension = 1536;

const Dashboard = () => {
  const [apiType, setApiType] = useState<'message' | 'langchain'>('message');
  const [darkMode, setDarkMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'Ready' | 'Error' | 'Waiting'>('Waiting'); // Connection status to DB
  const [dbStats, setDbStats] = useState<any>([]); // State for holding the DB stats
  const [success, setSuccess] = useState(false); // create index success indicator

  interface CollectionStatus {
    data: {
      collectionStatus?: string;
    };
  }

  // Handler for toggling the API type
  const handleToggleApi = () => {
    setApiType((prevType) => (prevType === 'message' ? 'langchain' : 'message'));
    console.log("API Route changed to:",apiType);
  };

  // Handler for toggling dark mode
  const handleToggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };
  // UseEffect to get DB stats
  useEffect(() => {
    // Attempt to connect to Pinecone, get status and index name
    const fetchDbData = async () => {
      try {
      // get the DB stats
        const dbStats = await getPineconeData();
        setDbStats(dbStats);
      } catch (err) {
        setConnectionStatus('Error');
      }
    };
    
    fetchDbData();
  }, []); // Empty dependency array means this effect will run only once on page load

  // To update stats icon
 useEffect(() => {
  if (!dbStats?.data?.collectionStatus) {
    setConnectionStatus('Waiting');
  } else {
    setConnectionStatus(dbStats.data.collectionStatus);
  }
 }, [dbStats?.data?.collectionStatus]);
  
  // Handle Create collection
  async function handleCreateCollection(collectionName: string) {
    try {
      await createCollection(collectionName);
      setSuccess(true);
      // refresh the page to see the new collection listed
      window.location.reload();
      
    } catch (error) {
      setSuccess(false);
      console.log("Error at creating Collection",error);
    }
  }
  // Handle Delete collection - coming soon

  // Handle Add to Pinecone
  



  
  

  return (
    <div className={`flex w-full h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className='h-[175px] border-solid ml-2'>
        <h1 className="text-3xl font-bold">Settings</h1>
        
        {/* Dark Mode Selector */}
        <div className="flex justify-left mt-2 ">
          <label className="flex items-center">            
          <input
            type="checkbox"
            checked={darkMode}
            onChange={handleToggleDarkMode}
            className={`${darkMode ? 'bg-gray-900' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11`}
          />
            <span className="ml-2">Dark Mode</span>
          </label>
        </div>
        
        <div className={`w-1/3 p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
          

        {/* Back button */}
        <button
          className={`mb-4 ${darkMode ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-200'} p-2 rounded position absolute top-4 right-4`}
          onClick={() => window.location.href = '/'}
        >
          Back
        </button>

        {/* Settings */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Settings</h2>
          {/* Your settings components here */}
        </div>

        {/* Toggle API type */}
        {/* Toggle API type */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">
            <span className='text-lg'>API Type:</span>
          </h2>
          <label
            className={`mr-4 cursor-pointer ${
              apiType === 'message' ? 'font-bold' : ''
            }`}
            onClick={() => setApiType('message')}
          >
            OpenAI
          </label>
          <label
            className={`mr-4 cursor-pointer ${
              apiType === 'langchain' ? 'font-bold' : ''
            }`}
            onClick={() => setApiType('langchain')}
          >
            LangChain
          </label>
        </div>

              </div>
        </div> 
      

      {/* RIGHT SIDE */}      
      <div className={`w-3/4 p-4 border-solid ${darkMode ? 'bg-gray-900 text-white border' : 'bg-blue-400 text-gray-900'}`}>
        <div className="text-3xl font-bold h-[75px]">
          <p>Dashboard</p></div>
        
        {/* Status icon */}
        <div className='flex font-bold justify-center mb-4 '><p>Status : </p>
        <div
            className={`status-icon ml-2 h-[25px] w-[25px] border rounded-full ${
              connectionStatus === 'Ready' ? 'bg-green-500' :
              connectionStatus === 'Waiting' ? 'bg-yellow-500' :
              connectionStatus === 'Error' || connectionStatus !== 'Ready' && connectionStatus !== 'Waiting' ? 'bg-red-500' : ''
            }`}
          >
          </div><p className='ml-2'>{connectionStatus}</p>
          </div>
        <div>        
    </div>       

        {/* Database Info */}
        <div className="mb-4 w-full border rounded-full px-10 text-center h-[150px]">
          <h2 className="text-lg font-bold mb-2">Database Info</h2>
         <div className='flex w-full justify-center'>
            {dbStats  === undefined ? (
              <p>Loading...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Index Name</th>
                    <th>Metrics</th>
                    <th>Dimensions</th>
                    <th>Pods</th>
                    <th>Replicas</th>
                    <th>Shards</th>
                    <th>Pod Type</th>                    
                  </tr>
                </thead>
                <tbody>
                  {dbStats.data === undefined ? (
                    <tr>
                      <td colSpan={10}>No data available</td>
                    </tr>
                  ) : (
                    <>
                      <tr>
                      <td><span className="font-bold text-blue-700 uppercase mr-2">{dbStats.data.indexName ?? "n/a"}</span></td>

                        <td>{dbStats.data.metrics ?? "n/a"}</td>
                        <td>{dbStats.data.dimensions ?? "n/a"}</td>
                        <td>{dbStats.data.pods ?? "n/a"}</td>
                        <td>{dbStats.data.replicas ?? "n/a"}</td>
                        <td>{dbStats.data.shards ?? "n/a"}</td>
                        <td>{dbStats.data.podType ?? "n/a"}</td>                        
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Collections Info */}
        <div className="mb-4 border rounded-full px-10 text-center h-[100px]">
        <h2 className="text-lg font-bold mb-2">Collections Info</h2>
         <div className='flex w-full justify-center'>
            {dbStats  === undefined ? (
              <p>Loading...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Collection Name</th>
                    <th>Collection Size</th>
                    <th>Collection Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dbStats.data === undefined ? (
                    <tr>
                      <td colSpan={10}>No data available</td>
                    </tr>
                  ) : (
                    <>
                      <tr>
                      <td><span className="font-bold text-blue-700 uppercase mr-2">{dbStats.data.indexName ?? "n/a"}</span></td>
                        <td>{dbStats.data.collectionName ?? "n/a"}</td>
                        <td>{dbStats.data.collectionSize ?? "n/a"}</td>
                        <td>{dbStats.data.collectionStatus ?? "n/a"}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            )}
            </div>


        </div>


      {/* Start of Management Section */}
        
        <div className="mb-4 border rounded-full w-full">
          <h2 className="text-lg font-bold mb-2 text-center">Collections Management</h2><br />
        <div className='flex justify-between px-20'>
          {/* Add Collection  */}
          <div >
          {success && <p>Action was successful!</p>}
          <input id='collectionNameInput' placeholder='Enter new collection name'></input>
          <button
            className='border cursor-pointer rounded-sm'
            onClick={() => { handleCreateCollection }}
          >
            Create! </button></div>
          
          {/* Delete Collection */}
          <div>
          {success && <p>Action was successful!</p>}
          <input id='collectionNameInput' placeholder='Enter name to delete'></input>
          <button
            className='border cursor-pointer rounded-sm'
            onClick={() => { handleCreateCollection }}
          >
                Delete! </button>
            </div>
          </div>    
        </div>
        
        <div className='w-full border-blue-700 border rounded-full h-[300px]'>
          {/* Add Document */}
          <div className='text-2xl text-center'>
            <p>Document Management</p>
          </div>
          </div>
      </div>
    </div>
      
  );
};

export default Dashboard;
export const  apiType = 'message';
