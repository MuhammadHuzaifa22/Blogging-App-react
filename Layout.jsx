
import React from 'react'
import { Outlet } from 'react-router-dom'
import NavbarFlowbite from './src/Components/Navbar'

const Layout = () => {
  return (
    <>
<NavbarFlowbite/>
    <Outlet/>
    </>
  )
}

export default Layout