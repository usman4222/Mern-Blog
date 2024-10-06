import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AdminProtectedRoute = () => {

    const { currentUser } = useSelector((state => state.user))

    return currentUser.user.isAdmin ? <Outlet/> : <Navigate to='/sign-in'/>
}

export default AdminProtectedRoute
