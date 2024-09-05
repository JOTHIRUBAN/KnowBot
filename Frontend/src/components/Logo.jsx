import React from 'react'
import { useNavigate } from "react-router-dom";

function Logo({page}) {
  const navigate = useNavigate();
  return (
    <>
       {page=='Desktop' ? 
        <img className="top-0 left-[90px] z-10 absolute hover:cursor-pointer" src="/images/logo.svg" onClick={() => navigate("/")} />
        :<img className="top-0 left-0 z-10 absolute hover:cursor-pointer" src="/images/logo.svg" onClick={() => navigate("/")} />}
      
    </>
  );
}

export default Logo;
