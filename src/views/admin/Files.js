import React, { useState, useEffect }from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CBreadcrumb,
  CBreadcrumbItem,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CLink,CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell,CTableDataCell,
  CButton, 
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPopover,
  CTooltip,
  CForm, CFormLabel, CFormInput, CFormText, CFormTextarea
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { getPanelFiles, deleteFile } from '../../services/api'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons';
import { callToasterAlert } from '../toastUtils';

const Files = () => {
  const [panelFiles, setPanelFiles] = useState([]);
  const { id } = useParams()
  const [visible, setVisible] = useState(false)
  const [file, setFile] = useState(null)
  const [panelId, setPanelId] = useState('')

  useEffect(() => {
    console.log('URL parameter ID:', id)
    setPanelId(id)
    fetchPanelFiles(id)
  }, [id])

  const deleteFileMeta = async (fileid) => {
      const res = await deleteFile(fileid);
      console.log(res);
      fetchPanelFiles(id)
      callToasterAlert("File deleted successfully", 1)
    };

  const handleUpload = async () => {
    if (!file || !panelId) {
      callToasterAlert("Please select a file and provide panel ID", 2)
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('panel_id', panelId)

    try {
      const response = await fetch('http://13.203.228.41:8000/upload-file/', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        callToasterAlert("File uploaded successfully", 1)
        setVisible(false)
      } else {
        const error = await response.json()
        console.log('Upload failed: ' + error.detail)
        callToasterAlert("Upload failed", 2)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Upload error')
      callToasterAlert("Internal server error", 2)
    }
    fetchPanelFiles(id)
  }

  const fetchPanelFiles = async (id) => {
      try {
        const data = await getPanelFiles(id);  // Call the getPanels API
        setPanelFiles(data);  // Store the response data in state
        console.log(data);
      } catch (err) {
        setError('Failed to load panels');
        callToasterAlert("Internal server error", 2)
      }
    };

  return (
    <>
      <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Files</strong>
                <CButton color="primary" size="sm" className="float-end" onClick={() => setVisible(!visible)}>
                  Add Files
                </CButton>
              </CCardHeader>
              <CCardBody>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">File Id</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Panel Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">File Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {panelFiles.map((panel, index) => (
                    <CTableRow key={panel.file_meta_id + ' ' + panel.panel_id}>
                      <CTableHeaderCell>{panel.file_meta_id}</CTableHeaderCell>
                      <CTableDataCell>{panel.panel_id}</CTableDataCell>
                      <CTableDataCell>{panel.file_name}</CTableDataCell>
                      <CTableDataCell>
                        <CButton size="sm"  onClick={() => deleteFileMeta(panel.file_meta_id)}>
                          <CIcon icon={cilTrash} size="sm" />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>Add Panel</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
            <CFormLabel className="mt-3">Select File</CFormLabel>
            <CFormInput
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" size="sm" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" size="sm" onClick={handleUpload}>
              Save changes
            </CButton>
          </CModalFooter>
        </CModal>
    </>
  )
}

export default Files
