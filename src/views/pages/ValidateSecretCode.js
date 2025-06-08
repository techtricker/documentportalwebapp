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
  CRow, CImage
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { verifySecretCode } from '../../services/api' 
import { callToasterAlert } from '../toastUtils';
import HzLogo5 from 'src/assets/images/hz_logo_5.png'
import 'src/scss/QRCodeCss.scss'

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
        if(secretCode == '' || secretCode == null){
          callToasterAlert("Please enter Secret Code", 2)
        } else if(secretCode == decoded) {
            const response = await verifySecretCode(secretCode);
            callToasterAlert("Verified Successfully", 1)
            navigate('/file-viewer/'+response.access_token);
        } else {
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
              <CCard className="p-4 VSCFileCardBorderColor">
                <CCardBody>
                  <CCard className="text-white VSCFileCardBorderColor" style={{ width: '100%', borderColor:"#fff !important" }}>
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
                    <h1 className="text-center">Verify Secret Code</h1>
                    <p className="text-body-secondary text-center">Enter your valide secret code to view files!</p>
                    <CInputGroup className="mb-3">
                      <CFormInput
                        placeholder="Secret Code"
                        value={secretCode}
                        onChange={(e) => setSecretCode(e.target.value)}
                      />
                      <CButton type="submit" color="success" className="px-4 text-white" style={{float:"right", color:"#fff"}}>
                          Verify
                        </CButton>
                    </CInputGroup>
                    {/* <CRow>
                      <CCol xs={12}>
                        <CButton type="submit" color="success" className="px-4 text-white" style={{float:"right", color:"#fff"}}>
                          Verify
                        </CButton>
                      </CCol>
                    </CRow> */}
                  </CForm>
                </CCardBody>
              </CCard>
              
              {/* <CCard className="text-white bg-primary py-5 d-flex align-items-center justify-content-center" style={{ width: '100%', height: '100%' }}>
                <CCardBody className="text-center d-flex align-items-center justify-content-center p-0" style={{ height: '100%' }}>
                  <CImage
                    src={HzLogo1}
                    alt="Hertz Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </CCardBody>
            </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ValidateSecretCode
