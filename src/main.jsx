import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'flowbite';
import 'flowbite-react';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from '../Layout.jsx';
import SignUp from './Pages/SignUp.jsx';
import Login from './Pages/Login.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Home from './Pages/Home.jsx';
import Settings from './Pages/Settings.jsx';
import Profile from './Pages/Profile.jsx';
import SinglePersonPosts from './SinglePersonPosts.jsx';
import SinglePosterProfile from './Pages/SinglePosterProfile.jsx';







const router = createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    children:[
      {
        path:'/signup',
        element:<SignUp/>
      }
      ,{
        path:'/login',
        element:<Login/>
      }
      ,{
        path:'/dashboard',
        element:<Dashboard/>
      }
      ,{
        path:'/',
        element:<Home/>
      },{
        path:'/settings',
        element:<Settings/>
      },{
        path:'/profile',
        element:<Profile/>
      },{
        path:'/singlepersonposts/:uid',
        element:<SinglePersonPosts/>
      },{
        path:'/singlepersonprofile/:uid',
        element:<SinglePosterProfile/>,
      }
    ]
  }
])



createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>
  </RouterProvider>
)
