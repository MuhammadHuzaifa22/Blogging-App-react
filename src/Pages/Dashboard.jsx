import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import {  query, where, getDocs } from "firebase/firestore";
import { format, formatRelative } from 'date-fns';



const Dashboard = ({ user }) => {
  const Navigate = useNavigate();
  let [isBlogPosting, setIsBlogPosting] = useState(false);
  const Form = document.getElementById("form");
  const [isModalOpen, setIsModalOpen] = useState(false);
  let [userUID,setUserUID] = useState('');
  let [userImage,setUserImage] = useState('');
  let [userFirstName,setUserFirstName] = useState('');
  let [userLastName,setUserLastName] = useState('');
  let [allBlogsOfThisUser,setAllBlogsOfThisUser] = useState([]);
  let [isUserPosted,setIsUserPosted] = useState(false);
  let [showAimatingMessage,setShowAnimatingMessage] = useState(false);

  function getFormattedDate(date) {
    return format(date, "MMMM do, yyyy"); 
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  
async function getAllBlogsFromThisUser(uid){
  const q = query(collection(db, "blogs"), where("userUid", "==", uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    allBlogsOfThisUser.push({
    ...doc.data()
  })
    console.log(allBlogsOfThisUser);
  });
  
     }
  
useEffect(()=>{

  
  onAuthStateChanged(
      auth,
    async  (user) => {
        if (user) {
          const uid = user.uid;
          console.log(user);
          console.log(uid);
          setUserUID(uid);

await getAllBlogsFromThisUser(uid);


          async function getAllRegisteredUsers(uid){
          console.log(uid)
          const q = query(collection(db, "users"), where("userUID", "==", uid));
          const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              console.log(doc.id, " => ", doc.data());
              console.log(doc.data().profileImage)
              setUserImage(doc.data().profileImage);
              setUserFirstName(doc.data().firstname);
              setUserLastName(doc.data().lastname);
            });
          }
          await getAllRegisteredUsers(uid);

        } else {
          Navigate("/");
        }
      },
      
    );
    
  },[])  
    


function closeModal(){
  if(isModalOpen){
    setIsModalOpen(false);
    showAimatingMessage(true);
    setTimeout(()=>{
      showAimatingMessage(false);
    },3000);
    setIsUserPosted(true);
  }
}

  async function postBlog(data) {
    setIsBlogPosting(true);
    try {
      const date = new Date();
      console.log(userImage)
      const docRef = await addDoc(collection(db, "blogs"), {
        title: data.title,
        blog: data.blog,
        date:getFormattedDate(date),
          userImage: userImage,
          userUid: userUID,
          firstName:userFirstName,
          lastName:userLastName,
      });
      setIsModalOpen(true);
      setTimeout(()=>{
          setIsModalOpen(false);
          setShowAnimatingMessage(true);
    setTimeout(()=>{
      setShowAnimatingMessage(false);
    },3000);
          setIsUserPosted(true);
      },3000);

      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.log(error);
      setIsBlogPosting(false);
      setIsUserPosted(false);
    }
    setIsBlogPosting(false);
    Form.reset();
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
    {isModalOpen ?  <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box relative">
              <button className="btn btn-sm btn-circle absolute right-2 top-2"  onClick={closeModal}>
                ✕
              </button>
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 text-green-500 mb-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.293-10.293a1 1 0 00-1.414 0L10 12.586 8.121 10.707a1 1 0 00-1.414 1.414l2.5 2.5a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2 className="mt-4 text-xl font-bold">Successfully Posted Your Blog</h2>
                <p className="mt-2 text-gray-600">Your blog has been posted and is now live!</p>
              </div>
              <div className="modal-action">
                <button className="btn" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
          <div className="modal-overlay" ></div>
        </div> : null }
      
      <div className="flex flex-wrap justify-center gap-5 mt-5 flex-col">
        <div>
          <form
            className="flex flex-col space-y-4 p-6 bg-white shadow-lg rounded-md max-w-2xl mx-auto mt-5"
            onSubmit={handleSubmit(postBlog)}
            id="form"
          >
            {/* Professional Heading with Icon */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 7V3h16v4M4 7h16m-1 0v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7h16z"
                />
              </svg>
              <h1 className="text-2xl font-semibold text-indigo-700">
                Post Your Blog Here
              </h1>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter title"
                className="text-xl pl-12 pr-4 py-2 w-full border-2 border-indigo-400 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <span className="text-red-500">Title is required.</span>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-3 w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5h18M9 3v2m6-2v2M4 7v13a2 2 0 002 2h12a2 2 0 002-2V7H4z"
                />
              </svg>
            </div>

            <div className="relative">
              <textarea
                placeholder="What is in your mind"
                rows="4"
                className="text-xl pl-12 pr-4 py-2 w-full border-2 border-indigo-400 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                {...register("blog", { required: true })}
              ></textarea>
              {errors.blog && (
                <span className="text-red-500">Blog is required.</span>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-3 w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 9V7a4 4 0 00-8 0v2H5v11a1 1 0 001 1h12a1 1 0 001-1V9h-2zm-7-2a2 2 0 114 0v2H10V7z"
                />
              </svg>
            </div>
            {isBlogPosting ? (
              <button
                disabled
                type="button"
                className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 animate-pulse"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-1 animate-spin"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3H6a1 1 0 000 2h3v3a1 1 0 102 0v-3h3a1 1 0 000-2h-3V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Publishing Your Blog...
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3H6a1 1 0 000 2h3v3a1 1 0 102 0v-3h3a1 1 0 000-2h-3V7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Publish Blog</span>
              </button>
            )}
          </form>
        </div>
        <div className="m-3 mt-5  p-2 shadow-md rounded-md">
          <div className="flex justify-between px-[200px] items-center">

          <h1 className="flex items-center space-x-2 text-2xl font-semibold  mb-6 justify-center max-w-xl ml-[100px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m-3-3h-6m6-4h6m-6 0a9 9 0 11-9 9 9 9 0 019-9zm0 0V3m0 6h-6"
              />
            </svg>
            <span>My Blogs</span>

          </h1>


      {isUserPosted ?  <button 
      onClick={handleReload} 
      className="flex items-center space-x-2 p-2 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 mr-[100px]"
      aria-label="Reload"
    >
      {/* Reload Icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582c1.438-3.924 5.792-6.626 10.418-5.835 4.228.707 7.332 4.52 7.332 8.835a9 9 0 01-9 9 9 9 0 01-8.946-7.999M20 4v5h-5"/>
      </svg>

      {showAimatingMessage ? <span className="animate-bounce">Click to reload and view your new blog.</span> : null}
      {/* Reload Text */}
      {showAimatingMessage ? <span className="text-gray-700 text-sm font-bold ">Reload</span> : <span className="text-gray-700 text-xs font-medium">Reload</span>}
    </button> : null }
         
            </div>


          {/* User all blogs */}
          <div>
             {allBlogsOfThisUser.length > 0 ? allBlogsOfThisUser.map((item,index)=>{
               return  <div className="border-[1px] border-[gainsboro] rounded-md shadow-sm p-6 bg-white max-w-2xl mt-5 mb-5 mx-auto" key={index}>
              <div className="flex items-center space-x-4">
                <img
                  src={item.userImage}
                  alt="Profile"
                  className="w-12 h-12 rounded-md border-[1px] border-gray-400"
                />
                <div>
                  <h1 className="text-lg font-semibold">{item.title}</h1>
                  <p className="text-gray-500">{item.firstName + " " + item.lastName} - {item.date}</p>
                </div>
              </div>
              <p className="text-gray-700 mt-4">
                {item.blog}
              </p>
              <div className="flex space-x-2 mt-5">

      {/* Edit Button */}
      
      <button className="flex items-center px-2 py-1 bg-indigo-500 text-white text-xs rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400">
        {/* Edit Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5m-7-7l8 8m-2-6l-6-6" />
        </svg>
        Edit
      </button>

      {/* Delete Button */}
      <button className="flex items-center px-2 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
        {/* Delete Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m2 0a9 9 0 10-4 4M9 4v1m6-1v1m-7 8v5a2 2 0 002 2h4a2 2 0 002-2v-5m-6 0V6" />
        </svg>
        Delete
      </button>
    </div>
            </div>
             }):null}
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
