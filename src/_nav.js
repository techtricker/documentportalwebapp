import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilApplications,
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCog,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilHome,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Panel Master',
    to: '/panel-master',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilApplications} customClassName="nav-icon" />
  }
]

export default _nav
