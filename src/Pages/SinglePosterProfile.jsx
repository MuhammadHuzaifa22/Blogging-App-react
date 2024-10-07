import React, { useEffect, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { query, where, getDocs, collection } from "firebase/firestore";
import { auth, db } from "../Config/firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const SinglePosterProfile = () => {
  const { uid } = useParams();
  let [userUid, setUserUid] = useState(uid);
  userUid = userUid.slice(1, userUid.length);
  let [posterDetails, setPosterDetails] = useState([]);
  let [userDocId, setUserDocId] = useState("");
  let [userFollowers, setUserFollowers] = useState("");
  let [registeredUserUid, setRegisteredUserUid] = useState("");
  let [userUidMatched, setUserUidMatched] = useState(false);
  let [userFollowed, setUserFollowed] = useState(false);

  const Navigate = useNavigate();

  useEffect(() => {
    getAllRegisteredUsers(userUid);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(userUid);
        setRegisteredUserUid(uid);
        console.log(uid);
        if (registeredUserUid === userUid) {
          setUserUidMatched(true);
        }
        console.log(registeredUserUid);
      } else {
        Navigate("/");
      }
    });

    async function getAllRegisteredUsers(uid) {
      try {
        const q = query(collection(db, "users"), where("userUID", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          console.log(doc.data().profileImage);
          setUserFollowers(doc.data().followers);
          setUserDocId(doc.id);
          posterDetails.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        if (posterDetails[0].followedBy) {
          console.log(posterDetails[0].followedBy);
          const user = auth.currentUser;

          if (user) {
            // User is signed in, you can get the UID
            const userUid = user.uid;
            console.log("User UID:", userUid);
          }
          const filterUserUid = posterDetails[0].followedBy.filter(
            (item) => item.user1 === registeredUserUid
          );
          if (filterUserUid) {
            console.log(filterUserUid);
          }
        }

        setPosterDetails([...posterDetails]);
      } catch (error) {
        console.log(error);
      }
    }
  }, [userUid]);

  async function followBlogger(registeredUserUid) {
    console.log(registeredUserUid);
    console.log(userDocId);
    const washingtonRef = doc(db, "users", userDocId);
    setUserFollowed(true);
    await updateDoc(washingtonRef, {
      date: posterDetails[0].date,
      followers: posterDetails[0].followers + 1,
      firstname: posterDetails[0].firstname,
      lastname: posterDetails[0].lastname,
      password: posterDetails[0].password,
      profileImage: posterDetails[0].profileImage,
      userUID: posterDetails[0].userUID,
      email: posterDetails[0].email,
      followedBy: arrayUnion({
        user1: registeredUserUid,
      }),
    });
    console.log(posterDetails[0].followers);
    setUserFollowers(posterDetails[0].followers);
  }

  function goToAllBlogs() {
    Navigate(`/singlepersonposts/:${userUid}`);
  }

  return (
    <>
      <div className="p-6 bg-gray-100 rounded-lg shadow-md h-screen flex items-center justify-center overflow-auto">
        {posterDetails.length > 0 ? (
          <div className="flex justify-center gap-6">
            {posterDetails.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-lg border border-gray-300 shadow hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between items-center"
              >
                <h1 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.firstname} {item.lastname}
                </h1>
                <div className="flex items-center my-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12H8m0 0V4m0 8v8"
                    />
                  </svg>
                  <span className="text-gray-600">{item.email}</span>
                </div>
                <a
                  href={item.profileImage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={item.profileImage}
                    alt="profile-image"
                    className="border border-gray-300 rounded-md w-full h-48 object-cover mb-4 hover:shadow-lg transition-shadow duration-200"
                  />
                </a>
                {userUidMatched ? null : (
                  <button
                    className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200 mb-2"
                    onClick={goToAllBlogs}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v3m0 0v-3m0 0V9m0 3h3m-3 0H9"
                      />
                    </svg>
                    View His Blogs
                  </button>
                )}

                <div className="flex justify-center gap-1">
                  <div className="flex items-center text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 20h14v-2a7 7 0 00-14 0v2zm7-10a4 4 0 100-8 4 4 0 000 8z"
                      />
                    </svg>
                    <span className="text-lg font-semibold">
                      Followers:{userFollowers}
                    </span>
                  </div>

                  {userUidMatched && userFollowed ? null : (
                    <button
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition duration-200 ease-in-out"
                      onClick={() => followBlogger(registeredUserUid)}
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
                          d="M12 4v16m-8-8h16"
                        />
                      </svg>
                      Follow
                    </button>
                  )}

                  {userUidMatched && userFollowed ? (
                    <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition duration-200 ease-in-out">
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Followed
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h1 className="text-lg text-gray-500">Loading...</h1>
        )}
      </div>
    </>
  );
};

export default SinglePosterProfile;
