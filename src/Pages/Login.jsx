import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Config/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const Navigate = useNavigate();

  let [loginButtonLoadingCondition, setLoginButtonLoadingCondition] = useState(false);


  let [showPassword, setShowPassword] = useState(true);
  const Form = document.getElementById("form");

  function loginUser(data) {
    console.log(data);
    setLoginButtonLoadingCondition(true);

    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        alert("Login Successfull");
        Navigate(`/`);
        setLoginButtonLoadingCondition(false);
        Form.reset();
      })
      .catch((error) => {
        setLoginButtonLoadingCondition(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }

  function handleShowPassowrd() {
    setShowPassword(!showPassword);
  }

  return (
    <form
    onSubmit={handleSubmit(loginUser)}
    className="flex flex-col justify-center mt-4 sm:mt-8 md:mt-[130px] w-full max-w-sm sm:max-w-md p-4 sm:p-6 md:p-8 mx-auto gap-3 sm:gap-4 bg-white shadow-lg rounded-lg border border-gray-200"
    id="form"
  >
    <h1 className="text-center text-2xl sm:text-3xl mb-4 sm:mb-6 font-bold text-gray-800">Login</h1>
  
    <div className="space-y-3 sm:space-y-4">
      <div>
        <input
          type="email"
          className="w-full text-base sm:text-xl p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        {errors.email && <span className="text-red-500 text-xs sm:text-sm mt-1 block">Email is required.</span>}
      </div>
  
      <div className="relative">
        <input
          type={showPassword ? "password" : "text"}
          className="w-full text-base sm:text-xl p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          {errors.password.type === "required" && "Password is required."}
          {errors.password.type === "minLength" && "Password minimum length should be 6"}
          {errors.password.type === "pattern" && "Password must include a number, e.g., 2uiojih"}
        </div>
      )}
    </div>
  
    <div className="flex justify-center mx-auto mt-4 sm:mt-6">
      {loginButtonLoadingCondition ? (
        <button
          disabled
          type="button"
          className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-4 sm:px-5 py-2 sm:py-2.5 text-center inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-4 h-4 me-3 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
          </svg>
          Logging You In...
        </button>
      ) : (
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 text-sm sm:text-base">
          Login
        </button>
      )}
    </div>
  
    <h1 className="text-center mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
      Not a member? <Link to='/signup' className="text-indigo-600 hover:text-indigo-800">Sign Up</Link>
    </h1>
  </form>
  );
};

export default Login;
