import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../Config/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from "firebase/firestore";


const SignUp = () => {
  let [retypePasswordCondition, setRetypePasswordCondition] = useState(false);
  let [showPassword, setShowPassword] = useState(true);
  let [showRetypePassword, setShowRetypePassword] = useState(true);
  let [signUpButtonLoadingCondition, setSignUpButtonLoadingCondition] =
    useState(false);
  let [userProfileImage, setUserProfileImage] = useState("");
  let [email, setEmail] = useState("");
  let [userImgaeFunction, setUserImageFunction] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null); 
  const Form = document.getElementById("form");
  const Navigate = useNavigate();
  let [userImageCondition,setUserImageCondition] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  function handleShowPassowrd() {
    setShowPassword(!showPassword);
  }

  function handleShowRetypePassowrd() {
    setShowRetypePassword(!showRetypePassword);
  }

  const userImage = watch('userImage');
  if(userImage){
    console.log(userImage[0]);
  }

  async function registerUser(data) {    
    console.log(data)
    if (data.retypePassword !== data.password) {
      setRetypePasswordCondition(true);
      return;
    } else {
      setRetypePasswordCondition(false);
      console.log(data);
    }

    if(userImage){
      data.userImage = userImage[0];
          const MAX_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
          const file = userImage[0];
          if (file.size > MAX_SIZE) {
              alert('File size exceeds the maximum limit of 5 MB.');
              return;
          }
        }
        console.log(data.email)
        console.log(data.userImage);
        setEmail(data.email);
        console.log(email);
        if(userImage !== '' || userImage !== null){
      setSignUpButtonLoadingCondition(true);
      const storageRef = ref(storage, email);
      try {
        const uploadImg = await uploadBytes(storageRef, data.userImage);
        const url = await getDownloadURL(storageRef);
        console.log(url);
        if(url){
          data.imageURL = url    
        }
      } catch (error) {
        console.log(error);
        alert('Image Upload Error: Please try clicking the "Sign Up" button again.');
        setSignUpButtonLoadingCondition(false);
       return

      }
    }
    

if(data.imageURL){
  console.log(data.imageURL);
}
    
    setUserImageFunction(true);
    console.log(data.userImage);



      createUserWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
      const user = userCredential.user;
        console.log(data);
        data.date = new Date().toLocaleDateString() +  " " + "Time: " +  new Date().toLocaleTimeString();
        console.log(data.date);
        console.log(user);
        if(user.displayName === null || user.displayName === "") {
          user.displayName = data.firstname + " " + data.lastname;  
          console.log("User display name added");
          console.log(user.displayName);
        }
        
        if(user.photoURL !== null || user.photoURL !== ''){
          user.photoURL = data.imageURL;
          sendRegisterUserData(user);
        }
        


async function sendRegisterUserData(user){
  console.log(user);
  await setDoc(doc(db, 'users', user.uid), {
    email:user.email,
    password:data.password,
    profileImage: data.imageURL,
    date:data.date,
    firstname:data.firstname,
    lastname:data.lastname,
    userUID:user.uid,
    followers:0,
});
}


        console.log(user);
      
        setSignUpButtonLoadingCondition(false);
        setTimeout(() => {
          alert("You are registered");
          Navigate(`/login`);
        }, 500);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setSignUpButtonLoadingCondition(false);
        alert(errorMessage);
      });
  }

 

  


  
  return (
    <form
  onSubmit={handleSubmit(registerUser)}
  className="flex flex-col justify-center mt-4 sm:mt-8 md:mt-[130px] w-full max-w-sm sm:max-w-md p-4 sm:p-6 md:p-8 mx-auto gap-3 sm:gap-4 bg-white shadow-lg rounded-lg border border-gray-300"
  id="form"
>
  <h1 className="text-center text-2xl sm:text-3xl mb-4 sm:mb-6 font-bold text-gray-800">Sign Up</h1>

  <input
    type="text"
    className="text-base sm:text-xl p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="Firstname"
    {...register("firstname", {
      required: true,
      minLength: 3,
      pattern: {
        value: /^[A-Z][a-zA-Z]*$/,
      },
    })}
  />
  {errors.firstname && (
    <div className="text-red-500 text-xs sm:text-sm mt-1">
      {errors.firstname.type == "required" && "First Name is required."}
      {errors.firstname.type === "minLength" && "First Name minimum length should be 3"}
      {errors.firstname.type === "pattern" && "First Name must start with a capital letter."}
    </div>
  )}

  <input
    type="text"
    className="text-base sm:text-xl p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="Lastname"
    {...register("lastname", {
      required: true,
      minLength: 3,
      pattern: {
        value: /^[A-Z][a-zA-Z]*$/,
      },
    })}
  />
  {errors.lastname && (
    <div className="text-red-500 text-xs sm:text-sm mt-1">
      {errors.lastname.type == "required" && "Last Name is required."}
      {errors.lastname.type === "minLength" && "Last Name minimum length should be 3"}
      {errors.lastname.type === "pattern" && "Last Name must start with a capital letter."}
    </div>
  )}

  <input
    type="email"
    className="text-base sm:text-xl p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="Email"
    {...register("email", { required: true })}
  />
  {errors.email && <span className="text-red-500 text-xs sm:text-sm mt-1">Email is required.</span>}

  <div className="relative">
    <input
      type={showPassword ? "password" : "text"}
      className="text-base sm:text-xl p-2 sm:p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      placeholder="Password"
      {...register("password", {
        required: true,
        minLength: 6,
        pattern: {
          value: /^(?=.*[0-9]).+$/,
        },
      })}
    />
    <button
      type="button"
      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2"
      onClick={handleShowPassowrd}
    >
      {showPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.854c.257-.458.855-1.213 1.735-1.994C7.756 5.344 10.358 4.5 12 4.5c1.642 0 4.244.844 6.285 2.36.88.781 1.478 1.536 1.735 1.994a.75.75 0 010 .636c-.257.458-.855 1.213-1.735 1.994C16.244 14.656 13.642 15.5 12 15.5c-1.642 0-4.244-.844-6.285-2.36-.88-.781-1.478-1.536-1.735-1.994a.75.75 0 010-.636z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.854c.257-.458.855-1.213 1.735-1.994C7.756 5.344 10.358 4.5 12 4.5c1.642 0 4.244.844 6.285 2.36.88.781 1.478 1.536 1.735 1.994a.75.75 0 010 .636c-.257.458-.855 1.213-1.735 1.994C16.244 14.656 13.642 15.5 12 15.5c-1.642 0-4.244-.844-6.285-2.36-.88-.781-1.478-1.536-1.735-1.994a.75.75 0 010-.636z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.529 19.471l15-15" />
        </svg>
      )}
    </button>
  </div>
  {errors.password && (
    <div className="text-red-500 text-xs sm:text-sm mt-1">
      {errors.password.type == "required" && "Password is required."}
      {errors.password.type === "minLength" && "Password minimum length should be 6"}
      {errors.password.type === "pattern" && "Password must include a number, e.g., 2uiojih"}
    </div>
  )}

  <div className="relative">
    <input
      type={showRetypePassword ? "password" : "text"}
      className="text-base sm:text-xl p-2 sm:p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      placeholder="Retype Password"
      {...register("retypePassword", {
        required: true,
        minLength: 6,
        pattern: {
          value: /^(?=.*[0-9]).+$/,
        },
      })}
    />
    <button
      type="button"
      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2"
      onClick={handleShowRetypePassowrd}
    >
      {showRetypePassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.854c.257-.458.855-1.213 1.735-1.994C7.756 5.344 10.358 4.5 12 4.5c1.642 0 4.244.844 6.285 2.36.88.781 1.478 1.536 1.735 1.994a.75.75 0 010 .636c-.257.458-.855 1.213-1.735 1.994C16.244 14.656 13.642 15.5 12 15.5c-1.642 0-4.244-.844-6.285-2.36-.88-.781-1.478-1.536-1.735-1.994a.75.75 0 010-.636z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.854c.257-.458.855-1.213 1.735-1.994C7.756 5.344 10.358 4.5 12 4.5c1.642 0 4.244.844 6.285 2.36.88.781 1.478 1.536 1.735 1.994a.75.75 0 010 .636c-.257.458-.855 1.213-1.735 1.994C16.244 14.656 13.642 15.5 12 15.5c-1.642 0-4.244-.844-6.285-2.36-.88-.781-1.478-1.536-1.735-1.994a.75.75 0 010-.636z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.529 19.471l15-15" />
        </svg>
      )}
    </button>
  </div>
  {errors.retypePassword && (
    <div className="text-red-500 text-xs sm:text-sm mt-1">
      {errors.retypePassword.type == "required" && "Password confirmation is required"}
      {errors.retypePassword.type === "minLength" && "Password confirmation length should be 6"}
      {errors.retypePassword.type === "pattern" && "Password must include a number, e.g., 2uiojih"}
    </div>
  )}
  {retypePasswordCondition && (
    <span className="text-red-500 text-xs sm:text-sm mt-1">
      Confirmation Password is not equal to the password.
    </span>
  )}

  <div className="flex items-center border border-dashed border-gray-300 rounded-md p-4 sm:p-6 justify-center">
    <div className="text-center">
      <label htmlFor="userImage" className="block mb-2 text-xs sm:text-sm font-medium text-gray-900">Upload Image:</label>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        {...register('userImage', { required: true })}
        className="block w-full text-xs sm:text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
      />
      {errors.userImage && <p className="text-red-500 text-xs sm:text-sm mt-1">Image is required</p>}
    </div>
  </div>

  <div className="flex justify-center mx-auto mt-4">
    {signUpButtonLoadingCondition ? (
      <button
        disabled
        type="button"
        className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 text-center inline-flex items-center"
      >
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-4 h-4 me-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Signing You Up...
      </button>
    ) : (
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 text-xs sm:text-sm">
        Sign Up
      </button>
    )}
  </div>

  <h1 className="text-center mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
    Already a member? <Link to="/login" className="text-indigo-600 hover:text-indigo-800">Login</Link>
    </h1>
  </form>
  );
};

export default SignUp;
