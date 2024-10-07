import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {  query, where, getDocs,collection } from "firebase/firestore";
import { db } from './Config/firebaseConfig';
import preLoader from '../src/assets/Images/spiral-css-preloader.gif';

const SinglePersonPosts =  () => {
    const { uid } = useParams();
     console.log('Component mounted:', uid); 
     let [userUid,setUserUid] = useState(uid);
     userUid =  userUid.slice(1,userUid.length);
     let [allBlogsOfThisUser,setAllBlogsOfThisUser] = useState([]);
     console.log(userUid);
     let [isLoadig,setIsLoading] = useState(false);

const navigate = useNavigate();

function goToProfile(){
  navigate(`/singlepersonprofile/:${userUid}`);
}

useEffect(()=>{
       getAllBlogsFromThisUser(userUid);
       
  async function getAllBlogsFromThisUser(uid){
      const q = query(collection(db, "blogs"), where("userUid", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        allBlogsOfThisUser.push({
          ...doc.data()
        })
        if(allBlogsOfThisUser.length > 0){
          setIsLoading(true);
          setTimeout(()=>{
               setIsLoading(false);
          },1500);
        }
        setAllBlogsOfThisUser([...allBlogsOfThisUser]);
      });
    }
    
  },[userUid])
    

function backToHome(){
  navigate('/');
}


    return (
      <>
      <div className='flex justify-center gap-2 px-[150px]'>
        <div>
        <div className="flex flex-col sm:flex-row justify-between gap-2 p-4">
  <button
    onClick={backToHome}
    className="flex items-center px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md transition duration-200 ease-in-out mt-5 sm:mt-0"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2" 
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5l-7 7 7 7M4 12h16"
      />
    </svg>
    Back to All Blogs
  </button>

  <button
    onClick={goToProfile}
    className="flex items-center px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md transition duration-200 ease-in-out mt-5 sm:mt-0"
  >
    Go to Profile
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 ml-2" 
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5l7 7-7 7M20 12H4"
      />
    </svg>
  </button>
</div>

<div>
  {allBlogsOfThisUser.length > 0 ? (
    allBlogsOfThisUser.map((item, index) => {
      return (
        <div
          className="border border-gainsboro rounded-md shadow-sm p-6 bg-white max-w-2xl mt-5 mb-5 mx-auto"
          key={index}
        >
          <div className="flex items-center space-x-4">
            {isLoadig ? (
              <img
                src={preLoader}
                alt="Profile"
                className="w-12 h-12 rounded-md border border-gray-400 animate-bounce"
              />
            ) : (
              <img
                src={item.userImage}
                alt="Profile"
                className="w-12 h-12 rounded-md border border-gray-400"
              />
            )}

            <div>
              <h1 className="text-lg font-semibold">{item.title}</h1>
              <p className="text-gray-500">
                {item.firstName + " " + item.lastName} - {item.date}
              </p>
            </div>
          </div>
          <p className="text-gray-700 mt-4">{item.blog}</p>
        </div>
      );
    })
  ) : (
    <div className="flex mt-[-100px] justify-center h-screen items-center">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <h1 className="text-xl font-semibold text-indigo-500 ml-4">Loading...</h1>
    </div>
  )}
</div>


          </div>
          {allBlogsOfThisUser.length > 0 ? (
  <div className="mt-12 flex flex-col items-center mx-4 sm:mx-6 md:mx-8 lg:mx-12">
    <h1 className="text-3xl font-bold text-indigo-600 mb-5 text-center">
      {allBlogsOfThisUser[0].firstName + " " + allBlogsOfThisUser[0].lastName}
    </h1>
    <a
      href={allBlogsOfThisUser[0].userImage}
      target="_blank"
      rel="noopener noreferrer"
    >
      {isLoadig ? (
        <img
          src={preLoader}
          alt="Loading"
          className="w-72 h-72 border-gray-500 border rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
        />
      ) : (
        <img
          src={allBlogsOfThisUser[0].userImage}
          alt="User"
          className="w-72 h-72 border-gray-500 border rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
        />
      )}
    </a>
  </div>
) : (
  <div className="flex mt-[-50px] justify-center items-center">
    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    <h1 className="text-xl font-semibold text-indigo-500 ml-4">Loading...</h1>
  </div>
)}

        
      </div>
      </>
    );
  };
  
export default SinglePersonPosts

