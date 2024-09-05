import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



function Features() {
  return (
    <div className='pb-10'>
    <h1 className='font-bold py-2 text-2xl pt-14 text-center'>Features</h1>
    <div className='mt-10 pt-28 flex flex-row justify-evenly'>
        

       <div className='w-[13rem] h-[19rem] bg-black opacity-80 relative'>
       <Avatar className="absolute  left-[17%] top-[-40%] size-36">
  <AvatarImage  src="../../public/images/features/chat.jpeg" />
  <AvatarFallback>ChatBot</AvatarFallback>
</Avatar>
            <h1 className='text-white font-bold text-center text-[1.75rem] pt-7 '>Personalized Learning</h1>
            <p className='text-white text-center pt-5 px-10'>
            Tailored responses, daily feeds and suggestions to fit your learning style.
            </p>
       </div>
       <div className='w-[13rem] h-[19rem] bg-black opacity-80 relative'>
       <Avatar className="absolute  left-[17%] top-[-40%] size-36">
  <AvatarImage  src="../../public/images/features/pdf.jpeg" />
  <AvatarFallback>PDF chat</AvatarFallback>
</Avatar>
            <h1 className='text-white font-bold text-center text-[1.75rem] pt-7 px-2 '>Chat with Your PDFs</h1>
            <p className='text-white text-center pt-5 px-10'>
            Upload your documents and interact with them through our intelligent chatbot.            </p>
       </div>
       <div className='w-[13rem] h-[19rem] bg-black opacity-80 relative'>
       <Avatar className="absolute  left-[17%] top-[-40%] size-36">
  <AvatarImage  src="../../public/images/features/Youtube.png" />
  <AvatarFallback>Video Insights</AvatarFallback>
</Avatar>
            <h1 className='text-white font-bold text-center text-[1.75rem] pt-7 px-5 '>Video Insights</h1>
            <p className='text-white text-center pt-5 px-10'>
            Generate and chat with summaries of your favorite educational videos.
            </p>
       </div>
    
    </div>
    </div>
    
  )
}


export default Features