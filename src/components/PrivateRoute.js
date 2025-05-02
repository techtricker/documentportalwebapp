import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

// Check JWT in localStorage
const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  return !!token
}

const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
