import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Config/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  let [blogs, setBlogs] = useState([]);
const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          blogs.push({
            ...doc.data(),
          });
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
    navigate(`/singlepersonposts/${uid}`); 
  }

  

  function goTosSingleProfile(uid){
navigate(`/singlepersonprofile/:${uid}`);

  }


  return (
    <>
      <div className="p-5 px-[100px]">
        <h1 className="text-3xl font-bold mb-3 px-[200px]">
          Good Morning Readers!
        </h1>
        <h1 className="text-2xl font-medium mb-3 px-[200px]">All Blogs</h1>
        {blogs.length > 0 ? (
          blogs.map((item, index) => {
            return (
              <div
                className="border-[1px] border-[gainsboro] rounded-md shadow-sm p-6 bg-white max-w-2xl mt-5 mb-5 mx-[200px]"
                key={index}
              >
                <div className="flex items-center space-x-4"  onClick={() => goTosSingleProfile(item.userUid)}>
                  <img
                    src={item.userImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-md border-[1px] border-gray-400"

                  />
                  <div>
                    <h1 className="text-lg font-semibold">{item.title}</h1>
                    <p className="text-gray-500">
                      {item.firstName + " " + item.lastName} - {item.date}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mt-4">{item.blog}</p>
                <Link
                  className="text-blue-500 hover:underline mt-4 block"
                  onClick={() => goToSinglePersonPosts(item.userUid)}
                >
                  See all from this user
                </Link>
              </div>
            );
          })
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </>
  );
};

export default Home;
