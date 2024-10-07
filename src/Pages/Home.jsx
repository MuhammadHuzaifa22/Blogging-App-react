import React, { useEffect, useState } from "react";
import {  DocumentReference, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../Config/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { Oval } from 'react-loader-spinner'; 
import preLoader from '../assets/Images/spiral-css-preloader.gif';
import { onAuthStateChanged } from "firebase/auth";

import { doc, updateDoc } from "firebase/firestore";
import { id } from "date-fns/locale";



const Home = () => {
  let [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  let [isLoadig,setIsLoading] = useState(false);
  let [picLoading,setPicLoading] = useState(false);
  let [isUserBlog,setIsUserBlog] = useState(false);
  let [userUid,setUseruid] = useState('');
  let [data,setData] = useState([]);


  // const updateMultipleDocuments = async (collectionName, documentsToUpdate) => {
  //   try {
  //     // Use Promise.all for concurrent updates
  //     const updatePromises = documentsToUpdate.map(({ docId, updatedFields }) => {
  //       const docRef = doc(db, collectionName, docId); // Create document reference
  //       return updateDoc(docRef, updatedFields);       // Update document fields
  //     });
  
  //     // Wait for all updates to complete
  //     await Promise.all(updatePromises);
  //     console.log('All documents have been updated successfully');
  //   } catch (error) {
  //     console.error('Error updating documents:', error);
  //   }
  // };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        userUid = uid;
        console.log(uid);
      } else {
        console.log('User is not registered.');
      }
    });



    async function getData() {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
         if(doc.data().userUid === userUid){
          console.log('User uid is matched.')
          blogs.push(
            {
              id:doc.id,
            ...doc.data(),
            isUserBlog:true,
            }
          )
         }else{
          blogs.push({
            id:doc.id,
            ...doc.data(),
          });  
         }
          
          
          
          console.log(doc.data().userUid)
          setUseruid(doc.data().userUid);
          console.log(userUid);
          if(blogs.length > 0){
            setIsLoading(true);
            setTimeout(()=>{
            setIsLoading(false);
            setPicLoading(true);
          },1000);
              setTimeout(()=>{
              setPicLoading(false);
          },3000);
          }
         console.log(userUid);

        //  if(filterUid.length > 0){
        //    updateMultipleDocuments('blogs',filterUid);
        //   }
        //  else{
        //  console.log('User has no blog posted yet.');
        //  }
          setBlogs([...blogs]);
          console.log(blogs[0].blog);
        });
      } catch (error) {
        console.log(error);
      }
    }
    getData();



  }, []);

  function goToSinglePersonPosts(uid) {
    navigate(`/singlepersonposts/:${uid}`); 
  }

  

  function goTosSingleProfile(uid){
navigate(`/singlepersonprofile/:${uid}`);

  }


  return (
    <>
      <div className="p-5 px-[100px]">
      {blogs.length > 0 && (
  <div className="px-4 sm:px-6 md:px-8 lg:px-12">
    <h1 className="text-3xl font-bold mb-3 text-center">
      Good Morning Readers!
    </h1>
    <h1 className="text-2xl font-medium mb-3 text-center">
      All Blogs
    </h1>
  </div>
)}

        
        {blogs.length > 0 ? (
          blogs.map((item, index) =>{
            return (
              <>
       {isLoadig === false ? (
  <div
    className="border-[1px] border-gray-300 rounded-md shadow-sm p-6 bg-white max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl mt-5 mb-5 mx-auto"
    key={index}
  >
    {/* Profile and Title Section */}
    <div className="flex items-center space-x-4" onClick={() => goTosSingleProfile(item.userUid)}>
      {/* Profile Picture with Loading State */}
      {picLoading ? (
        <img
          src={preLoader}
          alt="Profile"
          className="w-12 h-12 rounded-md border-[1px] border-gray-400 animate-bounce"
        />
      ) : (
        <img
          src={item.userImage}
          alt="Profile"
          className="w-12 h-12 rounded-md border-[1px] border-gray-400 hover:shadow-[3px_3px_3px_0px_gray]"
        />
      )}

      {/* User Info */}
      <div>
        <h1 className="text-lg font-semibold">{item.title}</h1>
        <p className="text-gray-500">{item.firstName + " " + item.lastName} - {item.date}</p>
      </div>
    </div>

    {/* Blog Content */}
    <p className="text-gray-700 mt-4">{item.blog}</p>


   {item.isUserBlog === true ?  <button class="flex items-center px-3 mt-[10px] py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-4.036a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 4.732z" />
    </svg>
    Edit
  </button>
:  <Link
      className="text-blue-500 hover:underline mt-4 block"
      onClick={() => goToSinglePersonPosts(item.userUid)}
    >
      See all from this user
    </Link>}
  </div>
) : (
  <div className="border border-gray-300 rounded-md shadow-sm p-6 bg-white max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl mt-5 mb-5 mx-auto animate-pulse" key={index}>
    <div className="flex items-center space-x-4 cursor-pointer">
      <div className="w-12 h-12 bg-gray-300 rounded-md"></div>
      <div className="flex flex-col space-y-2">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </div>
    </div>

    <div className="mt-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>

    <div className="mt-4">
      <div className="h-4 bg-blue-200 rounded w-1/4"></div>
    </div>
  </div>
)}


                </>
              
            );
          })
        ) : (
          <div className="flex items-center justify-center min-h-screen bg-none">
          <div className="flex flex-col items-center">
            <Oval
              height={80} 
              width={80} 
              color="blue" 
              wrapperStyle={{}} 
              wrapperClass="" 
              visible={true} 
              ariaLabel="oval-loading" 
              secondaryColor="white" 
              strokeWidth={2} 
              strokeWidthSecondary={2} 
            />
            <h1 className="mt-4 text-xl font-semibold text-gray-800">Loading...</h1>
          </div>
        </div>
        
        )}
      </div>
    </>
  );
};

export default Home;
