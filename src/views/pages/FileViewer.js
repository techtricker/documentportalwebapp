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
  CModal, CModalBody, CModalContent, CModalDialog, CModalFooter, CModalHeader, CModalTitle, CImage,
  CCardHeader
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilArrowTop } from '@coreui/icons'
import { getAssignedFiles } from '../../services/api' 
import PDFViewer from '../../components/PDFViewer'
import { callToasterAlert } from '../toastUtils';
import HzLogo5 from 'src/assets/images/hz_logo_5.png'
import 'src/scss/QRCodeCss.scss'
import { getPanelFilesForViewer } from '../../services/api'

const FileViewer = () => {
  const [assignedFiles, setAssignedFiles] = useState([])
  const { jwtToken } = useParams()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [fileMetaId, setFileMetaId] = useState(0)
  const [activeFileName, setActiveFileName] = useState('PDF Viewer')
  const [activePanelName, setActivePanelName] = useState('')
  const [activeRowId, setActiveRowId] = useState(null);
  const [visibleScrollTop, setVisibleScrollTop] = useState(false)

    useEffect(() => {
        //console.log("jwtToken",jwtToken)
        localStorage.setItem('token', jwtToken);
        fetchAssignedFiles(jwtToken);
    }, [jwtToken])

  

    useEffect(() => {
      //fetchAssignedFiles()
      const toggleVisibility = () => {
        setVisibleScrollTop(window.pageYOffset > 300)
      }

      window.addEventListener('scroll', toggleVisibility)
      return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

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

    // const fetchAssignedFiles = async () => {
    //   try {
    //     const data = await getPanelFilesForViewer()
    //     setAssignedFiles(data.files)
    //     setActivePanelName(data.panel_name)
    //   } catch (err) {
    //     callToasterAlert("Session Expired! Scan again to continue!", 2)
    //     setAssignedFiles([])
    //   }
    // }

    const closeViewer = async() => {
      setFileMetaId(0); 
      setVisible(false);
      setActiveRowId(null);
    };

    const openViewer = async(id, filename) => {
      setActiveRowId(id+ 'user-file-view');
      setActiveFileName(filename);
      setFileMetaId(id);
      setVisible(true);
    };

  return (
    <div className="bg-body-tertiary d-flex flex-row align-items-center" style={{marginTop:"21px"}}>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
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
                  <CTable size="sm" className='table-sm'>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                            <CTableHeaderCell scope="col">File Name</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {assignedFiles.map((panel, index) => (
                            <CTableRow key={panel.file_meta_id+'user-file-view'} className={panel.file_meta_id+'user-file-view' === activeRowId ? 'table-active' : ''}>
                              <CTableHeaderCell>{panel.file_meta_id}</CTableHeaderCell>
                              <CTableDataCell>{panel.file_name}</CTableDataCell>
                              <CTableDataCell>
                              <CButton color="primary" size="sm"  onClick={() => openViewer(panel.file_meta_id, panel.file_name)}>
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
        {visible && (
        <CRow style={{marginTop:"14px"}} className="justify-content-center">
          <CCol md={12}>
            <CCardGroup>
              <CCard className="text-white VSCFileCardBorderColor" style={{ width: '100%', borderColor:"#fff !important" }}>
                  <CCardHeader>
                    <strong style={{color:"#111"}}>{activeFileName}</strong>
                    <CButton color="secondary" size="sm" className="float-end" onClick={() => closeViewer()}>
                      Close
                    </CButton>
                  </CCardHeader>
                  <CCardBody className="text-center">
                    <PDFViewer fileName={activeFileName} panelName={activePanelName} fileId={fileMetaId} />
                    {/* Or replace above line with an image or another viewer */}
                  </CCardBody>
                </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      )}
      </CContainer>
      {/* <CModal fullscreen visible={visible} onClose={() => closeViewer()}>
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
                </CModal> */}
                {
                  visibleScrollTop && (
                    <CButton
                      color="warning"
                      style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        borderRadius: '50%',
                        padding: '10px 12px',
                        zIndex: 1050,
                      }}
                      onClick={scrollToTop}
                    >
                      <CIcon icon={cilArrowTop} />
                    </CButton>
                )
                }
    </div>
  )
}

export default FileViewer
