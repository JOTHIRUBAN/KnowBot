import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const GetStarted = () => {
  let navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-black text-white flex items-center justify-center ">
      <div className="max-w-4xl w-full pd-10 mt-10">
        <h2 className="text-3xl font-bold mb-8 text-center">Get started</h2>
        <div className="grid grid-cols-1 pl-10 md:grid-cols-2 gap-8">
          {/* Step 1 */}
          <div>
            <h3 className="text-xl font-semibold">1. Login or Create an Account</h3>
            <p>Log onto your existing account or create a new one here</p>
          </div>
          {/* Step 2 */}
          <div>
            <h3 className="text-xl font-semibold">2. Enroll for Subjects</h3>
            <p>Choose the subjects you want to learn</p>
          </div>
          {/* Step 3 */}
          <div>
            <h3 className="text-xl font-semibold">3. Get Feeds Daily</h3>
            <p>Receive daily learning feeds customized to your chosen subjects.</p>
          </div>
          {/* Step 4 */}
          <div>
            <h3 className="text-xl font-semibold">4. Upload Your PDF to Interact with It</h3>
            <p>Ask questions and get insights directly from your PDFs.</p>
          </div>
          {/* Step 5 */}
          <div>
            <h3 className="text-xl font-semibold">5. Paste YouTube Video Link</h3>
            <p>Chat with the generated content to enhance your understanding.</p>
          </div>
          {/* Step 6 */}
          <div>
            <h3 className="text-xl font-semibold">6. Have Fun with Our Chatbot</h3>
            <p>Want to explore new knowledge, our chatbot is here to help.</p>
          </div>
        </div>
        {/* Buttons */}
        <div className="mt-8 flex justify-center space-x-14 pb-14 pt-4">
          <Button 
            className='bg-black w-1/4 text-white border border-white font-bold hover:bg-[#5b5858] hover:text-black'
            onClick={() => handleNavigation('/login')}
          >
            Login
          </Button>
          <Button 
            className='w-1/4 bg-white text-black font-bold border border-transparent hover:bg-[#5b5858] hover:text-black'
            onClick={() => handleNavigation('/playground')}
          >
            Go Chat
          </Button>
          <Button 
            className='bg-black w-1/4 text-white border border-white font-bold hover:bg-[#5b5858] hover:text-black'
            onClick={() => handleNavigation('/feeds')}
          >
            Get Feeds
          </Button>
          <Button 
            className='w-1/4 bg-white text-black font-bold border border-transparent hover:bg-[#5b5858] hover:text-black'
            onClick={() => handleNavigation('/pdf')}
          >
            Chat PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;
