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
  CRow,CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell,CTableDataCell,
  CModal, CModalBody, CModalContent, CModalDialog, CModalFooter, CModalHeader, CModalTitle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { getAssignedFiles } from '../../services/api' 
import PDFViewer from '../../components/PDFViewer'
import { callToasterAlert } from '../toastUtils';

const FileViewer = () => {
  const [assignedFiles, setAssignedFiles] = useState([])
  const { jwtToken } = useParams()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [fileMetaId, setFileMetaId] = useState(0)
  const [activeFileName, setActiveFileName] = useState('PDF Viewer')
  const [activePanelName, setActivePanelName] = useState('')

    useEffect(() => {
        //console.log("jwtToken",jwtToken)
        fetchAssignedFiles(jwtToken);
    }, [jwtToken])

    const fetchAssignedFiles = async (token) => {
        try {
          const data = await getAssignedFiles(token);  // Call the getPanels API
          setAssignedFiles(data.files);  // Store the response data in state
          setActivePanelName(data.panel_name);
        } catch (err) {
          callToasterAlert("Session Expired! Scan again to continue!", 2)
          setAssignedFiles([]);
        }
      };

    const closeViewer = async() => {
      setFileMetaId(0); 
      setVisible(false);
    };

    const openViewer = async(id, filename) => {
      setActiveFileName(filename);
      setFileMetaId(id);
      setVisible(!visible);
    };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CTable>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                            <CTableHeaderCell scope="col">File Name</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {assignedFiles.map((panel, index) => (
                            <CTableRow key={panel.file_meta_id+'user-file-view'}>
                              <CTableHeaderCell>{panel.file_meta_id}</CTableHeaderCell>
                              <CTableDataCell>{panel.file_name}</CTableDataCell>
                              <CTableDataCell>
                              <CButton color="secondary" size="sm"  onClick={() => openViewer(panel.file_meta_id, panel.file_name)}>
                                View
                              </CButton>
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <CModal fullscreen visible={visible} onClose={() => closeViewer()}>
                  <CModalHeader>
                    <CModalTitle>{activeFileName}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <PDFViewer fileName={activeFileName} panelName={activePanelName} fileId={fileMetaId} />
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => closeViewer()}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
    </div>
  )
}

export default FileViewer
