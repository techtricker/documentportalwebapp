import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow, CImage
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { login } from '../../../services/api' 
import HzLogo5 from 'src/assets/images/hz_logo_5.png'
import 'src/scss/QRCodeCss.scss'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await login(username, password)
      navigate('/')
    } catch (err) {
      alert('Login failed: ' + err.message)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4 LoginPageCardBorder">
                <CCardBody>
                  <CCard className="text-white py-5 LoginPageCardBorder" style={{ width: '100%', borderColor:"#fff !important" }}>
                    <CCardBody className="text-center">
                      <div>
                        <CImage
                          rounded
                          src={HzLogo5}
                          style={{width:"100%"}}
                          alt="Hertz Logo"
                        />
                      </div>
                    </CCardBody>
                  </CCard>
                  <CForm onSubmit={handleLogin}>
                    <h1 style={{textAlign: "center"}}>Login</h1>
                    <p style={{textAlign: "center"}} className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={8}>
                      </CCol>
                      <CCol xs={4}>
                        <CButton style={{float:"right", color:"#fff"}} type="submit" color="success" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
