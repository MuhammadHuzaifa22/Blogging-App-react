import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { auth, db } from '../Config/firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";



const NavbarFlowbite = () => {
  const navigate = useNavigate();
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  let [loading, setLoading] = useState(true);
  let location = useLocation();
  let [userImage,setUserImage] = useState('');
 

  console.log(location.pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        console.log(user.uid)
        getUserData(user.uid);

       async function getUserData(uid){

        const q = query(collection(db, "users"), where("userUID", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          setUserImage(doc.data().profileImage)
        });
        
        }
        
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    
    return () => unsubscribe();
  }, []); 

  if (loading) {
    return (
      <nav className="bg-indigo-600 p-2 px-[100px]">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-medium">Personal Blogging</h1>
          <h1 className='text-white'>Loading...</h1>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-indigo-600 p-2 px-[100px]">
     
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-medium">Personal Blogging</h1>
          {isLoggedIn ? (
            <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={userImage} className='border-[1px] rounded-full' />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow  border-[1px] border-spacing-11">

 {/* Home */}
 {location.pathname === '/' ? null : (
        <li>
          <Link to="/" className="flex items-center space-x-2 justify-between">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v12a2 2 0 002 2h4a2 2 0 002-2V12m-6 0l-2 2" />
            </svg>
            <span className='hover:animate-pulse'>Home</span>
          </Link>
        </li>
      )}

      {/* Dashboard */}
      {location.pathname === '/dashboard' ? null : (
        <li>
          <Link to="/dashboard" className="flex items-center space-x-2 justify-between">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z" />
            </svg>
            <span className='hover:animate-pulse'>Dashboard</span>
          </Link>
        </li>
      )}

      {/* Profile */}
      {location.pathname === '/profile' ? null : (
        <li>
          <Link to="/profile" className="flex items-center space-x-2 justify-between">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 18.579A10.947 10.947 0 0112 15c2.96 0 5.639 1.19 7.879 3.579M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className='hover:animate-pulse'>Profile</span>
          </Link>
        </li>
      )}

      {/* Settings */}
      {location.pathname === '/settings' ? null : (
        <li>
          <Link to="/settings" className="flex items-center space-x-2 justify-between">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm1 7h-2v2h2v-2zm0-5h-2v3h2V10zm6 2v3h3v-3h-3z" />
            </svg>
            <span className='hover:animate-pulse'>Settings</span>
          </Link>
        </li>
      )}

      {/* Logout */}
      <li>
        <p className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
          <span>Logout</span>
        </p>
      </li>
            </ul>

            
          </div>
        
        )
      
           : (
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                <Link to='/login'>
                  Login
                </Link>
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                <Link to='/signup'>
                  Sign Up
                </Link>
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavbarFlowbite;
