import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import {  query, where, getDocs } from "firebase/firestore";
import { format, formatRelative } from 'date-fns';
import { doc, updateDoc,deleteDoc  } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'sweetalert2/dist/sweetalert2.min.css';





const Dashboard = () => {
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
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  let modal = document.getElementById('my_modal_2');
  let [blogIndex,setBlogIndex] = useState('');
  const editForm = document.getElementById('editForm');
  let [editBlogDefualtTitle,setEditBlogDefaultTitle] = useState('');
  let [editBlogDefualtBlog,setEditBlogDefaultBlog] = useState('');
  let [editDocId,setEditDocId] = useState('');
  let [deleteDocId,setDeleteDocId] = useState('');
  let [deleteButtonLoadingCondition,setDeleteButtonLoadingConditon] = useState(false);
  let [editButtonLoadingCondition,setEditButtonLoadingConditon] = useState(false);

  const toggleMenu = (index) => {
    setActiveCardIndex(index === activeCardIndex ? null : index);
  };


// Function to show success toast
const showSuccessToast = (message) => {
  toast.success(message, {
    style: {
      borderRadius: '10px',
      background: '#4ade80',
      color: '#fff',
      marginTop:'50px'
    },
  });
};



  // Show edit modal
  function showEditModal(index,docId){
    setBlogIndex(index);
    setEditBlogDefaultTitle(allBlogsOfThisUser[index].title);
    setEditBlogDefaultBlog(allBlogsOfThisUser[index].blog);
    editBlog(index);
    setEditDocId(docId);
    document.getElementById('my_modal_3').showModal();
    setActiveCardIndex(index !== activeCardIndex);
  }
  
// Show delete modal
function showDeleteModal(item,index){
setEditBlogDefaultTitle(allBlogsOfThisUser[index].title);
setEditBlogDefaultBlog(allBlogsOfThisUser[index].blog);
setBlogIndex(index);
setDeleteDocId(item.id);
document.getElementById('my_modal_4').showModal();
setActiveCardIndex(index !== activeCardIndex);
}

  function getFormattedDate(date) {
    return format(date, "MMMM do, yyyy"); 
  }
  const {
    register: register,
    handleSubmit: handleSubmit,
    formState: { errors: errors },
  } = useForm();

  // Form for editing a blog
  const {
    register: edit,
    handleSubmit: manageSubmit,
    formState: { errors: edittingErrors},
  } = useForm();
  
async function getAllBlogsFromThisUser(uid){
  const q = query(collection(db, "blogs"), where("userUid", "==", uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    allBlogsOfThisUser.push({
      id:doc.id,
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
    

async  function editBlog(data){
  if((data.editTitle === '' || data.editTitle == null) && (data.editDescription === '' || data.editDescription == null)){
    console.log('input values are undefined.')
    return
  }
    
setEditButtonLoadingConditon(true);
console.log(data.editTitle);
console.log(data.editDescription);
console.log(blogIndex);
console.log(editDocId);

const washingtonRef = doc(db, "blogs", editDocId);

await updateDoc(washingtonRef, {
  title: data.editTitle,
  blog:data.editDescription
});

allBlogsOfThisUser[blogIndex].title = data.editTitle;
allBlogsOfThisUser[blogIndex].blog = data.editDescription;


setEditButtonLoadingConditon(false);
editForm.reset();
document.getElementById('my_modal_3').close();
showSuccessToast('Blog edited successfully.');
  }


  const MySwal = withReactContent(Swal);

  function showAlert(recievedIcon) {
    MySwal.fire({
      title: '<strong>Blog Posted!</strong>',
      icon: recievedIcon,
      html: `<p class="text-gray-700">Your <strong class="text-indigo-500">Blog</strong> has <strong class="text-green-500">posted successfully</strong>!</p>`,
      showCloseButton: true, 
      closeButtonHtml: '&times;', 
      buttonsStyling: false,
      customClass: {
        popup: 'bg-white rounded-lg p-6 shadow-lg',
        title: 'text-2xl font-bold text-indigo-600',
        closeButton: 'text-gray-500 hover:text-red-500', // Customize the close button style with Tailwind CSS
      },
    });
  }



async function deleteblog(){
  setDeleteButtonLoadingConditon(true);
await deleteDoc(doc(db, "blogs", deleteDocId));
allBlogsOfThisUser.splice(blogIndex,1);
console.log(blogIndex);
setAllBlogsOfThisUser([...allBlogsOfThisUser])
document.getElementById('my_modal_4').close();
showSuccessToast('Blog deleted successfully.');
setDeleteButtonLoadingConditon(false);
}

function closeModal(){
  if(isModalOpen){
    setIsModalOpen(false);
    window.location.reload();
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
      showAlert('success');
      setTimeout(()=>{
      window.location.reload();
      },800);
  
        
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.log(error);
        setIsBlogPosting(false);
        setIsUserPosted(false);
        
    }
    setIsBlogPosting(false);
    Form.reset();
  }




  return (
    <>
<Toaster position="top-right" reverseOrder={false} />
   {/* Edit Blog Modal */}
   <dialog id="my_modal_3" className="modal">
  <div className="modal-box">
    <h2 className="text-lg font-bold">Edit Blog</h2>
    <button
      className="btn btn-sm btn-circle absolute right-2 top-2"
      onClick={() => document.getElementById('my_modal_3').close()}
    >
      ✕
    </button>

    <form
      className="mt-4"
      onSubmit={manageSubmit(editBlog)}
      id='editForm'
    >
      <div className="form-control mb-4">
        <label className="label" htmlFor="title">
          <span className="label-text">Blog Title</span>
        </label>
        <input
          type="text"
          id="title"
          className="input input-bordered"
          {...edit('editTitle', { required: true })}
        />
        {editBlogDefualtTitle !== '' ? <span>Old Title: <b>{editBlogDefualtTitle}</b></span>: null}
        {edittingErrors.editTitle && <span className="text-red-500">This field is required.</span>}
      </div>

      <div className="form-control mb-4">
        <label className="label" htmlFor="description">
          <span className="label-text">Blog Description</span>
        </label>
        <textarea
          id="description"
          className="textarea textarea-bordered"
          rows="4"
          {...edit('editDescription', { required: true })}
        ></textarea>
        {editBlogDefualtBlog !== '' ? <span>Old Description: <b>{editBlogDefualtBlog}</b></span>: null}
        {edittingErrors.editDescription && <span className="text-red-500">This field is required.</span>}
      </div>
{editButtonLoadingCondition ? <button type="submit" className="bg-indigo-600 w-full animate-pulse rounded-md text-white text-xl p-1" disabled>
        Editing...
      </button>: <button type="submit" className="bg-indigo-600 w-full rounded-md text-white text-xl p-1">
        Edit
      </button>}
      
    </form>
  </div>
  
</dialog>

{/* Delete blog modal */}
<dialog id="my_modal_4" className="modal">
  <div className="modal-box relative p-6 bg-white rounded-lg shadow-lg">
    {/* Close button */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-red-500">Delete Blog</h2>
      <button
        className="btn btn-sm btn-circle bg-gray-200 hover:bg-gray-300 p-2"
        onClick={() => document.getElementById('my_modal_4').close()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Title section with icon */}
    <div className="flex items-center mb-3">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l4-4-4-4m-4 4h8m4 5v-1a2 2 0 00-2-2h-8a2 2 0 00-2 2v1M7 7h.01" />
      </svg>
      <h1 className="text-lg font-bold text-gray-700 uppercase tracking-wide transform transition-transform duration-300 hover:scale-105">
        Title: <span className="text-gray-900">{editBlogDefualtTitle}</span>
      </h1>
    </div>

    {/* Description section with icon */}
    <div className="flex items-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M4 6h16M4 10h16M4 16h16M4 20h16" />
      </svg>
      <h1 className="text-lg font-bold text-gray-700 capitalize tracking-wide transform transition-transform duration-300 hover:scale-105">
        Description: <span className="text-gray-900">{editBlogDefualtBlog}</span>
      </h1>
    </div>

    {/* Delete confirmation */}
    <div className="mb-6">
      <h1 className="text-red-600 font-semibold">Are you sure you want to delete this blog?</h1>
    </div>

    {/* Action buttons */}
    <div className="flex justify-end space-x-2">
      <button
        className=" bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md"
        onClick={() => document.getElementById('my_modal_4').close()}
      >
        Cancel
      </button>
      {deleteButtonLoadingCondition ? <button
        className=" bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md flex items-center animate-pulse"
        disabled
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m2 9H7a2 2 0 01-2-2V7h14v13a2 2 0 01-2 2zM10 7V5a2 2 0 012-2h0a2 2 0 012 2v2" />
        </svg>
        Deleting...
      </button>: <button
        className=" bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md flex items-center"
        onClick={deleteblog}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m2 9H7a2 2 0 01-2-2V7h14v13a2 2 0 01-2 2zM10 7V5a2 2 0 012-2h0a2 2 0 012 2v2" />
        </svg>
        Delete
      </button>}
      
    </div>
  </div>
</dialog>



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

{allBlogsOfThisUser.length > 0 ?   <h1 className="flex items-center space-x-2 text-2xl font-semibold  mb-6 justify-center max-w-xl ml-[100px]">
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
          </h1> : null }
        


      
            </div>
          {/* User all blogs */}
          <div>
             {allBlogsOfThisUser.length > 0 ? allBlogsOfThisUser.map((item,index)=>{
               return  <div className="border-[1px] border-[gainsboro] rounded-md shadow-sm p-6 bg-white max-w-2xl mt-5 mb-5 mx-auto" key={index}>
                <div className="flex justify-end">
                     <div key={index} className="relative inline-block ">
          <button
            className="btn btn-circle btn-sm swap swap-rotate cursor-pointer"
            onClick={() => toggleMenu(index)}
          >
            {/* Three dots icon */}
            <svg
              className={`swap-off fill-current block'}`}
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="6" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="18" r="2" />
            </svg>

            {/* Close icon */}
            <svg
              className={`swap-on fill-current block'}`}
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 512 512"
            >
              <polygon
                points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49   
 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
              />
            </svg>
          </button>

          {/* Dropdown List */}
          {index === activeCardIndex && (
            <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg  border-[1px] ">
            <li className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer " onClick={() => showEditModal(index,item.id)}>
              <svg
                className="w-4 h-4 mr-2 fill-current text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"  
              >
                <path d="M14.1 2.8l-1.2-1.2c-1.2-1.2-3.1-1.2-4.2 0L6 3.4l-.1.1L1.7 8.1c-.2.2-.3.5-.3.7V20c0 .6.4 1 1 1h10c.2 0 .5-.1.7-.3l5.7-5.7.1-.1 1.2-1.2c1.2-1.2 1.2-3.1 0-4.2l-1.2-1.2c-1.2-1.2-3.1-1.2-4.2 0zm-4.2 9.4l-2.3-2.3c-.4-.4-.4-1 0-1.4l2.3-2.3c.4-.4 1-.4 1.4 0l2.3 2.3c.4.4.4 1 0 1.4l-2.3 2.3c-.4.4-1 .4-1.4 0zm7.4-6.5c.4.4.4 1 0 1.4l-2.3 2.3c-.4.4-1 .4-1.4 0l-2.3-2.3c-.4-.4-.4-1 0-1.4l2.3-2.3c.4-.4 1-.4 1.4 0l2.3 2.3z" />
              </svg>
              Edit
            </li>
            
            <li className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => showDeleteModal(item,index)}>
              <svg
                className="w-4 h-4 mr-2 fill-current text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21,3A2.978,2.978,0,0,0,18.707,2.293l-1.414,1.414L18,4l1.414-1.414A4.016,4.016,0,0,1,22,4a4.004,4.004,0,0,1-1.293,2.828L20,8l-1.293-1.293L18,8l1.293,1.293L21,8a4.004,4.004,0,0,1-1.293-2.828A2.978,2.978,0,0,0,21,3Zm-6.627,3L10,12.627V20h7.373l3.999-3.999L18.373,6Zm2.828,6.706L17.706,14.5l1.414,1.414-3.999,3.999H12v-5.706Z" />
              </svg>
              Delete
            </li>
          </ul>
          
          )}
        </div>
        </div>
   
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
