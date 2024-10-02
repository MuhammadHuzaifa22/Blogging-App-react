import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {  query, where, getDocs,collection } from "firebase/firestore";
import { db } from './Config/firebaseConfig';

const SinglePersonPosts =  () => {
    const { uid } = useParams();
     console.log('Component mounted:', uid); 
     let [allBlogsOfThisUser,setAllBlogsOfThisUser] = useState([]);
const navigate = useNavigate();

     useEffect(()=>{

       getAllBlogsFromThisUser(uid);
       
  async function getAllBlogsFromThisUser(uid){
      const q = query(collection(db, "blogs"), where("userUid", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        allBlogsOfThisUser.push({
          ...doc.data()
        })
        setAllBlogsOfThisUser([...allBlogsOfThisUser])
        
      });
    }
    
  },[uid])
    

function backToHome(){
  navigate('/');
}

    return (
      <>
      <div className='flex justify-center gap-2 px-[150px]'>
        <div>
      <button
      onClick={backToHome}
      className="flex items-center px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md transition duration-200 ease-in-out mt-5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2" // Adjust size and margin as needed
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
              
            </div>
             }): <h1>Loading..</h1>}
          </div>

          </div>
            {allBlogsOfThisUser.length > 0 ?  <div className='mt-[150px] flex flex-col ml-3'>
             <h1 className='text-end text-3xl font-bold text-indigo-600 mb-5'>{allBlogsOfThisUser[0].firstName + " " + allBlogsOfThisUser[0].lastName}</h1>
        <img src={allBlogsOfThisUser[0].userImage} alt="" className='w-[300px] h-[300px] border-[indigo] border-[1px] rounded-md ml-2'/>
        </div>
  : <h1>Loading....</h1>}
        
      </div>
      </>
    );
  };
  
export default SinglePersonPosts

