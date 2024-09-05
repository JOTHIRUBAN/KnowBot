import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@material-tailwind/react';

function UploadLink() {
  const [isUploading, setIsUploading] = useState(false);
  const [inputData , setInput] = useState("");
  const navigate = useNavigate();

  const handleLinkUpload = async (event) => {
    setIsUploading(true);
    console.log(inputData);
    try {
      // Send the file to the backend
      const response = await axios.post('http://localhost:5000/api/uploadLink', {
        "link" : inputData,
      });

      // Navigate to the chat interface after successful upload
      setIsUploading(false);
      navigate('/chatLink',{ state: { summary: response.data } });
    } catch (error) {
      console.error('Error uploading the file:', error);
      setIsUploading(false);
    }
  };


  return (
    <div className="min-h-60 flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center space-y-4">
        {!isUploading ? (
          <>
            <h1 className="text-2xl font-bold">Upload your Link</h1>
            <input
              type="input"
              onChange={(e)=>{setInput(e.target.value)}}
              className="px-4 py-3 w-64 text-center bg-gray-800 text-white rounded-lg border-2 border-gray-600 cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
            />
            <Button className='px-3' onClick={handleLinkUpload}>
                 Submit
            </Button>
            

            
           
          </>
        ) : (
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        )}
      </div>
    </div>
  );
}

export default UploadLink;
