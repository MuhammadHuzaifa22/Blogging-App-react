import React, { useEffect, useState } from "react";
import { auth, db } from "../Config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { query, where, getDocs, collection } from "firebase/firestore";
import {
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'sweetalert2/dist/sweetalert2.min.css';
import { toast, Toaster } from "react-hot-toast";
import preLoader from '../assets/Images/spiral-css-preloader.gif';

const Profile = () => {
  let [userUid, setUserUID] = useState("");
  let [userImage, setUserImage] = useState("");
  let [userName, setUserName] = useState("");
  let [showCurrentPassword, setShowCurrentPassword] = useState(true);
  let [showNewPassword, setShowNewPassword] = useState(true);
  let [showRetypePassword, setShowRetypePassword] = useState(true);
  let [userPassword, setUserPassword] = useState("");
  let [sameRepeastPassword,setSameRepeatPassword] = useState(false);
  let [passwordUpdateLoading,setPasswordUpdateLoading] = useState(false);
  let Form = document.getElementById('form');
  let [isLoading,setIsLoading] = useState(false);


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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function showHidePassword() {
    setShowCurrentPassword(!showCurrentPassword);
  }


  
  function showHideNewPassword() {
    setShowNewPassword(!showNewPassword);
  }

  function showHideRetypePassword() {
    setShowRetypePassword(!showRetypePassword);
  }
  

function getUpdatePassword(data){
  console.log(data);

  if(data.newUserPassword !== data.repeatPassword){
  setSameRepeatPassword(true);
  }else{
    setSameRepeatPassword(false);
    setPasswordUpdateLoading(true);
    updateUserPassword(userPassword,data.newUserPassword);
  }
}

  function updateUserPassword(currentPassword, newPassword) {
    const user = auth.currentUser;
   
    if (user) {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      reauthenticateWithCredential(user, credential)
        .then(() => {
          return firebaseUpdatePassword(user, newPassword);
        })
        .then(() => {
          console.log("Password updated successfully for user:", user);
          setPasswordUpdateLoading(false);
          setUserPassword(newPassword);
          console.log(userPassword)
          showSuccessToast('Password updated successfully')
          Form.reset();
        })
        .catch((error) => {
          console.error("Error updating password:", error);
          console.log(error.code);
          if(error.code === 'auth/weak-password'){
            alert('Weak Password: Password should be at least *6* characters.');
          }
          setPasswordUpdateLoading(false);
          console.log(userPassword);
        });
      } else {
        console.error("No user is currently logged in.");
        setPasswordUpdateLoading(false);
      }
      setUserPassword(newPassword);
  }


  const MySwal = withReactContent(Swal);

  function showAlert(recievedIcon) {
    MySwal.fire({
      title: '<strong>Stylish Alert</strong>',
      icon: recievedIcon,
      html: `<p class="text-gray-700">This is a <strong class="text-indigo-500">stylish</strong> alert with <strong class="text-red-500">Tailwind CSS</strong>!</p>`,
      showCloseButton: true,
      closeButtonHtml: '&times;',
      buttonsStyling: false,
      customClass: {
        popup: 'bg-white rounded-lg p-6 shadow-lg',
        title: 'text-2xl font-bold text-indigo-600',
        closeButton: 'text-gray-500 hover:text-red-500',
      },
    });
  }
  
  

  const Navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        console.log(user);
        console.log(uid);
        setUserUID(uid);
    setIsLoading(true);
    setTimeout(()=>{
  setIsLoading(false);
    },1500);

        async function getAllRegisteredUsers(uid) {
          console.log(uid);
          const q = query(collection(db, "users"), where("userUID", "==", uid));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            console.log(doc.data().profileImage);
            setUserImage(doc.data().profileImage);
            setUserName(doc.data().firstname + " " + doc.data().lastname);
            setUserPassword(doc.data().password);
          });
        }
        await getAllRegisteredUsers(uid);
      } else {
        Navigate("/");
      }
    });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center pt-5">
        

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
  <h2 className="text-3xl font-bold mb-6 text-center sm:text-left">Profile</h2>

  <div className="flex flex-col sm:flex-row items-center justify-start gap-6">
    {/* <!-- Profile Image or Preloader --> */}
    {isLoading ? (
      <img
        className="w-40 h-40 sm:w-64 sm:h-64 rounded-md border border-gray-300 animate-pulse"
        src={preLoader}
        alt="Loading profile"
      />
    ) : (
      <a href={userImage} target="_blank" rel="noopener noreferrer">
        <img
          className="w-40 h-40 sm:w-64 sm:h-64 rounded-md border border-gray-300 hover:shadow-lg transition-shadow duration-300"
          src={userImage}
          alt="Profile"
        />
      </a>
    )}

    {/* <!-- Profile Info --> */}
    <div className="text-center sm:text-left">
      <p className="text-2xl sm:text-3xl font-bold mb-2">{userName}</p>
      
    </div>
  </div>
</div>

        <form onSubmit={handleSubmit(getUpdatePassword)} id='form' className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
  <div className="mt-4">
    <Toaster position="top-right" reverseOrder={false} />
  </div>

  {/* <!-- Password Field --> */}
  <div className="mb-6">
    <label className="block text-gray-700 font-semibold mb-2">Current Password</label>
    <div className="flex items-center border border-gray-300 rounded-lg">
      <input
        type={showCurrentPassword ? "password" : "text"}
        value={userPassword}
        className="w-full px-3 py-2 text-lg border-none rounded-lg focus:outline-none focus:ring-0 "
        placeholder="Enter current password"
      />
      <button
        type="button"
        onClick={showHidePassword}
        className={`flex items-center justify-center px-4 py-2 ${
          showCurrentPassword ? 'bg-indigo-500' : 'bg-red-500'
        } text-white rounded-r-lg hover:bg-opacity-90 transition`}
      >
        {showCurrentPassword ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M1 12s3.5-9 11-9 11 9 11 9-3.5 9-11 9-11-9-11-9z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Show
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M17.94 16.06A10.01 10.01 0 0 0 21 12c-2.19-4.41-6.2-7-10.5-7S.67 7.59 1.5 12c.58 1.86 1.57 3.59 2.73 5.06M15 12c0 1.66-1.34 3-3 3s-3-1.34-3-3M1 1l22 22" />
            </svg>
            Hide
          </>
        )}
      </button>
    </div>
  </div>

  {/* <!-- New Password Field --> */}
  <div className="mb-6">
    <label className="block text-gray-700 font-semibold mb-2">New Password</label>
    <div className="flex items-center border border-gray-300 rounded-lg">
      <input
        type={showNewPassword ? "password" : "text"}
        className="w-full px-3 py-2 text-lg border-none rounded-lg focus:outline-none focus:ring-0"
        placeholder="Enter new password"
        {...register('newUserPassword', { required: true })}
      />
      <button
        type="button"
        onClick={showHideNewPassword}
        className={`flex items-center justify-center px-4 py-2 ${
          showNewPassword ? 'bg-indigo-500' : 'bg-red-500'
        } text-white rounded-r-lg hover:bg-opacity-90 transition`}
      >
        {showNewPassword ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M1 12s3.5-9 11-9 11 9 11 9-3.5 9-11 9-11-9-11-9z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Show
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M17.94 16.06A10.01 10.01 0 0 0 21 12c-2.19-4.41-6.2-7-10.5-7S.67 7.59 1.5 12c.58 1.86 1.57 3.59 2.73 5.06M15 12c0 1.66-1.34 3-3 3s-3-1.34-3-3M1 1l22 22" />
            </svg>
            Hide
          </>
        )}
      </button>
    </div>
    {errors.newUserPassword && <span className="text-red-500">New password is required.</span>}
  </div>

  {/* <!-- Repeat Password Field --> */}
  <div className="mb-6">
    <label className="block text-gray-700 font-semibold mb-2">Repeat Password</label>
    <div className="flex items-center border border-gray-300 rounded-lg">
      <input
        type={showRetypePassword ? "password" : "text"}
        className="w-full px-3 py-2 text-lg border-none rounded-lg focus:outline-none focus:ring-0 "
        placeholder="Repeat new password"
        {...register('repeatPassword', { required: true })}
      />
      <button
        type="button"
        onClick={showHideRetypePassword}
        className={`flex items-center justify-center px-4 py-2 ${
          showRetypePassword ? 'bg-indigo-500' : 'bg-red-500'
        } text-white rounded-r-lg hover:bg-opacity-90 transition`}
      >
        {showRetypePassword ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M1 12s3.5-9 11-9 11 9 11 9-3.5 9-11 9-11-9-11-9z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Show
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M17.94 16.06A10.01 10.01 0 0 0 21 12c-2.19-4.41-6.2-7-10.5-7S.67 7.59 1.5 12c.58 1.86 1.57 3.59 2.73 5.06M15 12c0 1.66-1.34 3-3 3s-3-1.34-3-3M1 1l22 22" />
            </svg>
            Hide
          </>
        )}
      </button>
    </div>
    {errors.repeatPassword && <span className="text-red-500">Repeat password is required.</span>}
    {sameRepeastPassword && <span className="text-red-500">Passwords do not match.</span>}
  </div>

  {/* <!-- Update Button --> */}
  {passwordUpdateLoading ? (
    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg flex items-center justify-center animate-pulse" disabled>
      Updating Password...
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 animate-spin ml-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v2m0 12v2m8-10h-2m-12 0H4m15.364-6.364l-1.414 1.414M6.05 18.364l-1.414-1.414M18.364 17.95l-1.414 1.414M7.05 5.636L5.636 7.05"
        />
      </svg>
    </button>
  ) : (
    <button
      type="submit"
      className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
    >
      Update Password
    </button>
  )}
</form>

      </div>
    </div>
  );
};

export default Profile;
