import React, { useState, useEffect }from 'react'
import { useNavigate } from 'react-router-dom'
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
import { getPanels, createPanel, deletePanel,updatePanel } from 'src/services/api';
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons';
import { toast } from 'react-toastify'
import { callToasterAlert } from '../toastUtils';

const PanelMaster = () => {
  const [panels, setPanels] = useState([]);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false)
  const [panelName, setPanelName] = useState('');
  const [editPanelId, setEditPanelId] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate()
  const [isEditMode, setIsEditMode] = useState(false)


  useEffect(() => {
    setIsEditMode(false);
    fetchPanels();  // Call the fetchPanels function when the component mounts
  }, []);

  const fetchPanels = async () => {
    try {
      const data = await getPanels();  // Call the getPanels API
      setPanels(data);  // Store the response data in state
    } catch (err) {
      setError('Failed to load panels');
      callToasterAlert('Internal Server Error',2)
    }
  };
  
  const savePanel = async () => {
    try {
      if(isEditMode){
        await updatePanel({ panel_name: panelName, description: description }, editPanelId);
        setEditPanelId('');
        callToasterAlert('Updated Successfully!',1)
      } else{
        await createPanel({ panel_name: panelName, description: description });
        callToasterAlert('Created Successfully!',1)
      }
      setPanelName('');
      setDescription('');
      setVisible(false);
      const updatedPanels = await getPanels();
      setPanels(updatedPanels); // Refresh list
      setIsEditMode(false);
      
    } catch (err) {
      console.error('Failed to save panel:', err);
      setError('Failed to save panel');
      callToasterAlert('Internal Server Error',2)
    }
  };

  const editPanelMaster = async (panel_id) => {
    setIsEditMode(true);
    setEditPanelId(panel_id);
    const selectedPanel = panels.find((panel) => panel.panel_id === panel_id);
    if (selectedPanel) {
      setPanelName(selectedPanel.panel_name) ;
      setDescription(selectedPanel.description) ;
      setVisible(true);
    }
  };

  const deletePanelMaster = async (panel_id) => {
    const res = await deletePanel(panel_id);
    console.log(res);
    
  };

  

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
                      <CTableHeaderCell scope="col">Panel Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">No. of Files</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {/* {panels.map((panel, index) => (
                      <CTableRow key={panel.panel_id}>
                        <CTableDataCell>{panel.panel_name}</CTableDataCell>
                        <CTableDataCell>{panel.file_count}</CTableDataCell>
                      </CTableRow>
                    ))} */}
                    {panels.length > 0 ? (
                      panels.map((panel, index) => (
                        <CTableRow key={panel.panel_id}>
                          <CTableDataCell>{panel.panel_name}</CTableDataCell>
                          <CTableDataCell>{panel.file_count}</CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={2} className="text-center">
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

          <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader>
              <CModalTitle>Add Panel</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel htmlFor="panelName">Panel Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="panelName"
                    value={panelName}
                    onChange={(e) => setPanelName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="description">Description</CFormLabel>
                  <CFormTextarea
                    id="description"
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
                Save changes
              </CButton>
            </CModalFooter>
          </CModal>
    </>
  )
}

export default PanelMaster
