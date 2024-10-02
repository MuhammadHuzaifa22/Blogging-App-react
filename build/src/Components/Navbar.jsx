import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { auth } from '../Config/firebaseConfig';

const NavbarFlowbite = () => {
  const navigate = useNavigate();
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  let [loading, setLoading] = useState(true);
  let location = useLocation();
  let [userImage,serUserImage] = useState('');
  console.log(location.pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        console.log(user);
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
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">


{location.pathname === '/' ? null : <li>
                <Link to='/' className="justify-between">                
                  Home
                </Link>
              </li>}


{location.pathname === '/dashboard' ? null : <li>
                <Link to='/dashboard' className="justify-between">                
                  Dashboard
                </Link>
              </li>}
              

{location.pathname === '/profile' ? null : <li>
                <Link to='/profile' className="justify-between">                
                  Profile
                </Link>
              </li>}
              

{location.pathname === '/settings' ? null : <li>
                <Link to='/settings'>
                Settings
                </Link>
                </li> }
              

              <li><p>Logout</p></li>
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
