import React from 'react'
import re from '../../public/images/heroSection.png'
import { Button } from './ui/button'
import { useNavigate } from 'react-router'
import Logo from './Logo';

function Hero() {
    const navigate = useNavigate();
  return (
    <>
    
    <div id="Hero-Section" className='flex flex-row justify-center gap-20 py-10 '>
        <div className='flex flex-col  ml-20 items-center justify-center flex-1 '>
            <div className='flex-col px-10 pl-34    justify-center '>
               <div className='py-10'> <h1 className='font-sans text-5xl   text-white'><span className='inline-block py-4'>Empower Your</span> <br/> Learning with AI</h1>
            
               </div>
               <div>
                <h5 className='text-white pr-10'>Chat with your documents, get insights
                from videos, and enhance your knowledge.</h5>
                </div>
            <div className='flex-row space-x-12 py-7'>
                    <Button onClick={()=>navigate("/create-account")} 
                    className='w-1/3 bg-black text-white border  border-white font-bold hover:bg-white hover:text-black'>
                        Create Account
                    </Button>
                    <Button  onClick={()=>navigate("/login")}
                     className= "w-1/3 bg-white text-black font-bold border border-transparent hover:bg-black hover:text-white hover:border-white">
                        Login
                    </Button>
            </div>
            </div>
        </div>
        <div className='flex-1 flex items-center justify-center'><img src={re} className='h-[90%]'></img></div>
    </div>
    </>
  )
}
export default Hero