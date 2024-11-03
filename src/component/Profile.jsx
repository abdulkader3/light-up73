import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getDatabase, ref, set } from "firebase/database";
import Navbar from '../pages/Navbar';






const Profile = () => {

  const currentUserData = useSelector((state)=>state.prity.peraDitase)



  



  return (
    <>
      <Navbar/>
      <div className="max-w-sm mx-auto relative mt-10">
      {/* First Background Layer */}
      <div className="absolute inset-0 transform -rotate-6 bg-gradient-to-r from-indigo-500 to-purple-700  shadow-2xl z-0"></div>
      {/* Second Background Layer */}
      <div className="absolute inset-0 transform rotate-6 bg-gradient-to-r from-indigo-400 to-purple-600  shadow-xl z-0"></div>

      {/* Main Content Layer */}
      <div className="relative bg-white shadow-2xl overflow-hidden p-8 z-10"> 
        <div className="flex flex-col items-center">
          <img
            className="h-40 w-40 object-cover mt-4 rounded-full border-4 border-white shadow-lg"
            src={currentUserData?.photoURL}
            alt="Profile"
          />
          <div className="text-start mt-6">
            <div className=" text-center ">
            <div className="uppercase tracking-wide text-xl text-indigo-500 font-semibold">
              Developer
            </div>
            <h1 className="mt-2 text-2xl leading-tight font-bold text-gray-900">
              {currentUserData?.displayName}
            </h1>
            </div>
            <p className="mt-3 text-gray-700">
              Email: <Link to='#' className="text-indigo-600 hover:text-indigo-700">{currentUserData?.email} </Link>
            </p>
            <p className="mt-2 text-gray-700">
              Phone: <Link to='#' className="text-indigo-600 hover:text-indigo-700">+88 123456789</Link>
            </p>
            <p className="mt-2 text-gray-700">
              Address: 1234 Example Street, City, State, 12345
            </p>
            <p className="mt-2 text-gray-700">Location: New York, USA</p>
          </div>
          <div className="w-full text-center mt-2 ">
            {/* <Link to='/login'>⬅️ Back to Login page </Link> */}
          </div>
        </div>
      </div>
    </div>
      
    </>
  )
}

export default Profile
