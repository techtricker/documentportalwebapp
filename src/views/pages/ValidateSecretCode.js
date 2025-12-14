import React, { useEffect, useState } from 'react'
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
  CRow,
  CImage,
  CSpinner,
} from '@coreui/react'
import { callToasterAlert } from '../toastUtils'
import HzLogo5 from 'src/assets/images/hz_logo_5.png'
import 'src/scss/QRCodeCss.scss'

import {
  panelAccessInitiate,
  panelAccessVerifyOtp,
} from '../../services/api'

const OTP_TTL_SECONDS = 180

const ValidateSecretCode = () => {
  const { code: panelToken } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)

  // Step control
  const [step, setStep] = useState('CAPTURE') // CAPTURE | OTP

  // Visitor details
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // OTP flow
  const [sessionId, setSessionId] = useState('')
  const [maskedDest, setMaskedDest] = useState('')
  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(OTP_TTL_SECONDS)

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    if (!panelToken) {
      callToasterAlert('Invalid QR Code', 2)
      setLoading(false)
      return
    }
    // If token exists, we allow capture page
    setLoading(false)
  }, [panelToken])

  /* ---------------- OTP TIMER ---------------- */

  useEffect(() => {
    if (step !== 'OTP' || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((v) => Math.max(0, v - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [step, timeLeft])

  /* ---------------- CAPTURE → INITIATE OTP ---------------- */

  const handleCaptureSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !phone) {
      callToasterAlert('Please fill all details', 2)
      return
    }

    try {
      setLoading(true)

      const resp = await panelAccessInitiate({
        panel_token: panelToken,
        name,
        email,
        phone,
      })

      setSessionId(resp.session_id)
      setMaskedDest(resp.masked_destination)
      setTimeLeft(OTP_TTL_SECONDS)
      setStep('OTP')

      callToasterAlert(`OTP sent to ${resp.masked_destination}`, 1)
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Unable to initiate OTP'
      callToasterAlert(msg, 2)
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- VERIFY OTP ---------------- */

  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    if (!otp || otp.length < 4) {
      callToasterAlert('Enter the OTP sent to your email', 2)
      return
    }

    try {
      const resp = await panelAccessVerifyOtp({
        session_id: sessionId,
        otp,
      })

      callToasterAlert('Verified successfully', 1)
      localStorage.setItem('access_token', resp.access_token)
      //navigate('/file-viewer')
      navigate(`/file-viewer/${resp.access_token}`)
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Invalid or expired OTP'
      callToasterAlert(msg, 2)
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4 VSCFileCardBorderColor">
                <CCardBody>
                  <CCard className="text-white VSCFileCardBorderColor">
                    <CCardBody className="text-center">
                      <CImage src={HzLogo5} style={{ width: '100%' }} alt="Hertz Logo" />
                    </CCardBody>
                  </CCard>

                  {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 180 }}>
                      <CSpinner />
                    </div>
                  ) : step === 'CAPTURE' ? (
                    <CForm onSubmit={handleCaptureSubmit}>
                      <h1 className="text-center">Enter Your Details</h1>

                      <CFormInput
                        className="mb-3"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />

                      <CFormInput
                        className="mb-3"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      <CFormInput
                        className="mb-3"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      />

                      <CButton type="submit" color="primary" className="w-100">
                        Continue
                      </CButton>
                    </CForm>
                  ) : (
                    <CForm onSubmit={handleVerifyOtp}>
                      <h1 className="text-center">Verify OTP</h1>
                      <p className="text-body-secondary text-center">
                        Enter the OTP sent to <b>{maskedDest}</b>
                      </p>

                      <CInputGroup className="mb-3">
                        <CFormInput
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                          }
                          maxLength={6}
                        />
                        <CButton type="submit" color="success" className="px-4 text-white">
                          Verify
                        </CButton>
                      </CInputGroup>

                      <small className="text-muted">
                        Expires in {Math.floor(timeLeft / 60)}:
                        {String(timeLeft % 60).padStart(2, '0')}
                      </small>
                    </CForm>
                  )}
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
