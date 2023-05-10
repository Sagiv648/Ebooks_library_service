import React,{useEffect, useState} from 'react'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import {} from 'react-bootstrap'
import SignInRoute from './Entry/SignInRoute'
import Home from './Home/Home'

const entryRoute = createBrowserRouter([
    {
        path: '/',
        element: <SignInRoute/>
    }
])

const homeRoute = createBrowserRouter([{
    path: '/',
    element: <Home/>
}])

const Root = () => {

    const [connection,setConnection] = useState(null)
useEffect(() => {


},[])


  return (
    
    <RouterProvider router={connection ? homeRoute : entryRoute}/>
  )
}

export default Root