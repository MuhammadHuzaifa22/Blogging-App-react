import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'flowbite';
import 'flowbite-react';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from '../Layout.jsx';



const router = createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    children:[

    ]
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>

  </RouterProvider>
    
  
)
