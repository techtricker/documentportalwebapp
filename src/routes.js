import React from 'react'

const Dashboard = React.lazy(() => import('./views/admin/Dashboard'))

// admin
const Breadcrumbs = React.lazy(() => import('./views/admin/Breadcrumbs'))
const AssignUsers = React.lazy(() => import('./views/admin/Users'))
const PanelMaster = React.lazy(() => import('./views/admin/PanelMaster'))
const ManageAssignments = React.lazy(() => import('./views/admin/ManageAssignments'))
const Files = React.lazy(() => import('./views/admin/Files'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/users', name: 'Users', element: AssignUsers },
  { path: '/panel-master', name: 'Panel Master', element: PanelMaster },
  { path: '/manage-assignments', name: 'Breadcrumbs', element: ManageAssignments },
  { path: '/files/:id', name: 'Files', element: Files },
]

export default routes
