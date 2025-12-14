import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CSpinner,
} from '@coreui/react'
import {
  getPanels,
  createPanel,
  deletePanel,
  updatePanel,
  getPanelQr,
} from 'src/services/api'
import { callToasterAlert } from '../toastUtils'

const PanelMaster = () => {
  const [panels, setPanels] = useState([])
  const [error, setError] = useState(null)

  // Panel create / edit
  const [visible, setVisible] = useState(false)
  const [panelName, setPanelName] = useState('')
  const [editPanelId, setEditPanelId] = useState('')
  const [description, setDescription] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)

  // QR modal
  const [qrVisible, setQrVisible] = useState(false)
  const [qrPanelId, setQrPanelId] = useState(null)
  const [qrBase64, setQrBase64] = useState(null)
  const [qrLoading, setQrLoading] = useState(false)

  useEffect(() => {
    setIsEditMode(false)
    fetchPanels()
  }, [])

  const fetchPanels = async () => {
    try {
      const data = await getPanels()
      setPanels(data)
    } catch (err) {
      setError('Failed to load panels')
      callToasterAlert('Internal Server Error', 2)
    }
  }

  const savePanel = async () => {
    try {
      if (isEditMode) {
        await updatePanel({ panel_name: panelName, description }, editPanelId)
        callToasterAlert('Updated Successfully!', 1)
      } else {
        await createPanel({ panel_name: panelName, description })
        callToasterAlert('Created Successfully!', 1)
      }

      setPanelName('')
      setDescription('')
      setVisible(false)
      setIsEditMode(false)
      fetchPanels()
    } catch (err) {
      callToasterAlert('Internal Server Error', 2)
    }
  }

  const editPanelMaster = (panel_id) => {
    setIsEditMode(true)
    setEditPanelId(panel_id)
    const selectedPanel = panels.find((p) => p.panel_id === panel_id)
    if (selectedPanel) {
      setPanelName(selectedPanel.panel_name)
      setDescription(selectedPanel.description)
      setVisible(true)
    }
  }

  // ---------------- QR LOGIC ----------------

  const openQrModal = async (panelId) => {
    setQrVisible(true)
    setQrPanelId(panelId)
    setQrBase64(null)
    setQrLoading(true)

    try {
      const res = await getPanelQr(panelId)
      setQrBase64(res.qr_code_base64)
    } catch (err) {
      callToasterAlert('Failed to load QR code', 2)
    } finally {
      setQrLoading(false)
    }
  }

  const closeQrModal = () => {
    setQrVisible(false)
    setQrPanelId(null)
    setQrBase64(null)
  }

const downloadQr = (base64Data, panelId) => {
  const link = document.createElement('a')
  link.href = `data:image/png;base64,${base64Data}`
  link.download = `panel-${panelId}-qr.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
  // ------------------------------------------------

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>All Panels</strong>
            </CCardHeader>

            <CCardBody>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Panel Name</CTableHeaderCell>
                    <CTableHeaderCell>No. of Files</CTableHeaderCell>
                    <CTableHeaderCell>QR Code</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {panels.length > 0 ? (
                    panels.map((panel) => (
                      <CTableRow key={panel.panel_id}>
                        <CTableDataCell>{panel.panel_name}</CTableDataCell>
                        <CTableDataCell>{panel.file_count}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="info"
                            onClick={() => openQrModal(panel.panel_id)}
                          >
                            View QR
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={3} className="text-center">
                        No record found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ADD / EDIT PANEL MODAL */}
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{isEditMode ? 'Edit Panel' : 'Add Panel'}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Panel Name</CFormLabel>
              <CFormInput
                value={panelName}
                onChange={(e) => setPanelName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <CFormLabel>Description</CFormLabel>
              <CFormTextarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CForm>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={savePanel}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* QR MODAL */}
      <CModal alignment="center" visible={qrVisible} onClose={closeQrModal}>
        <CModalHeader>
          <CModalTitle>Panel QR Code</CModalTitle>
        </CModalHeader>

        <CModalBody className="text-center">
          {qrLoading && <CSpinner />}

          {!qrLoading && qrBase64 && (
            <>
              <img
                src={`data:image/png;base64,${qrBase64}`}
                alt="Panel QR"
                style={{ width: 250 }}
              />

              <div className="mt-3">
                <CButton
                  color="primary"
                  onClick={() => downloadQr(qrBase64, qrPanelId)}
                >
                  Download QR
                </CButton>
              </div>
            </>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={closeQrModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default PanelMaster
