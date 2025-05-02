import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { verifySecretCode } from '../../services/api' 
import { callToasterAlert } from '../toastUtils';

const ValidateSecretCode = () => {
  const [secretCode, setSecretCode] = useState('')
  const { code } = useParams()
  const navigate = useNavigate()

    useEffect(() => {
        
    }, [code])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
        const bytes = Uint8Array.from(atob(code), c => c.charCodeAt(0));
        const decoded = new TextDecoder().decode(bytes);
        if(secretCode == decoded)
        {
            const response = await verifySecretCode(secretCode);
            callToasterAlert("Verified Successfully", 1)
            navigate('/file-viewer/'+response.access_token);
        } 
        else {
            callToasterAlert("Invalid Secret Code or Link expired! Please scan again!", 2)
        }
      
    } catch (err) {
      callToasterAlert("Internal server error", 2)
    }
  }



  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Verify Secret Code</h1>
                    <p className="text-body-secondary">Enter your valide secret code to view files</p>
                    <CInputGroup className="mb-3">
                      <CFormInput
                        placeholder="Secret Code"
                        value={secretCode}
                        onChange={(e) => setSecretCode(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Verify
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

export default ValidateSecretCode
