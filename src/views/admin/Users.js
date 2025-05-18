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
  CForm, CFormLabel, CFormInput, CFormText, CFormTextarea,CFormSelect,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { deleteUser, updateUser, getUsers, getPanels, createUser, getUserDetails, userAssignment } from 'src/services/api';
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons';
import { callToasterAlert } from '../toastUtils';
import { MultiSelect } from "react-multi-select-component";


const Users = () => {

  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false)
  const [userName, setUserName] = useState('');
  const [emailId, setEmailid] = useState('');
  const [panelId, setPanelId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate()
  const [panels, setPanels] = useState([]);
  const [editUserId, setEditUserId] = useState('')
  const [isEditMode, setIsEditMode] = useState(false);
  const [selected, setSelected] = useState([]);

  //const options = [];
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setIsEditMode(false)
    fetchUserDetails();
    fetchPanels();
    fetchUsers();  // Call the fetchPanels function when the component mounts
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();  // Call the getPanels API
      setUsers(data);  // Store the response data in state
    } catch (err) {
      setError('Failed to load panels');
      callToasterAlert("Internal server error", 2)
    }
  };

  const fetchUserDetails = async () => {
    try {
      const data = await getUserDetails();  // Call the getPanels API
      //const data = await getUsers(); 
      setUserDetails(data);  // Store the response data in state
      console.log(data);
    } catch (err) {
      setError('Failed to load panels');
      callToasterAlert("Internal server error", 2)
    }
  };

  const fetchPanels = async () => {
    try {
      const data = await getPanels();  // Call the getPanels API
      setPanels(data);  // Store the response data in state
      const panelOptions = data.map(panel => ({
        panel_name: panel.panel_name,  // or whatever field should be the label
        panel_id: panel.panel_id ,    // or whatever field should be the value
        label: panel.panel_name,  // or whatever field should be the label
        value: panel.panel_id  
      }));
      setOptions(panelOptions);
    } catch (err) {
      setError('Failed to load panels');
      callToasterAlert("Internal server error", 2)
    }
  };

  const delete_User = async (userId) => {
    try {
      const data = await deleteUser(userId);  // Call the getPanels API
      callToasterAlert("Deleted successfully", 1)
      fetchUsers();
      fetchUserDetails();
    } catch (err) {
      setError('Failed to load panels');
      callToasterAlert("Internal server error", 2)
    }
  };

  const editUser = async (userId) => {
    setIsEditMode(true);
    setEditUserId(userId);
    const selectedPanel = users.find((panel) => panel.user_id === userId);
    if (selectedPanel) {
      setUserName(selectedPanel.name);
      setEmailid(selectedPanel.email_id);
      setPhoneNumber(selectedPanel.phone_number);
      setVisible(true);
    }
  };

  const saveUser = async () => {
    try {
      if(isEditMode) {
        const response = await updateUser({ name: userName, email_id: emailId, phone_number: phoneNumber }, editUserId);
        callToasterAlert("User updated successfully", 1)
      }
      else {
        const savePanel = selected.map(panel => ({
          panel_name: panel.panel_name
        }));
        const response = await createUser({ name: userName, email_id: emailId, phone_number: phoneNumber, panels:savePanel });
        //const response1 = await userAssignment({user_id: response.user_id, panel_id: panelId});
        callToasterAlert("User added successfully", 1)
      }
      setEditUserId('');
      setUserName('');
      setEmailid('');
      setPhoneNumber('');
      setVisible(false);
      const updatedUsers = await getUsers();
      setUsers(updatedUsers); // Refresh list
      fetchUserDetails();
      setIsEditMode(false)
    } catch (err) {
      console.error('Failed to save panel:', err);
      setError('Failed to save panel');
      callToasterAlert("Internal server error", 2)
    }
  };

  const closeUserModel = async() => {
    setEditUserId('');
    setIsEditMode(false)
    setUserName('');
      setEmailid('');
      setPhoneNumber('');
    setVisible(false)
  }

  return (
    <>
      <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Users</strong>
                  <CButton color="primary" size="sm" className="float-end" onClick={() => setVisible(!visible)}>
                    Add User
                  </CButton>
                </CCardHeader>
                <CCardBody>
                <CAccordion activeItemKey={2}>
                <CAccordionItem itemKey={1}>
                  <CAccordionHeader>Accordion Item #1</CAccordionHeader>
                  <CAccordionBody>
                    <strong>This is the first item&#39;s accordion body.</strong> It is hidden by
                    default, until the collapse plugin adds the appropriate classes that we use to
                    style each element. These classes control the overall appearance, as well as the
                    showing and hiding via CSS transitions. You can modify any of this with custom
                    CSS or overriding our default variables. It&#39;s also worth noting that just
                    about any HTML can go within the <code>.accordion-body</code>, though the
                    transition does limit overflow.
                  </CAccordionBody>
                </CAccordionItem>
                </CAccordion>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">User Id</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Panel Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Secret Code</CTableHeaderCell>
                      <CTableHeaderCell scope="col">QR Code</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {userDetails.map((panel, index) => (
                      <CTableRow key={panel.user_id+'_user'}>
                        <CTableHeaderCell>{panel.user_id}</CTableHeaderCell>
                        <CTableDataCell>{panel.user_name}</CTableDataCell>
                        <CTableDataCell>{panel.panel_name || '-'}</CTableDataCell>
                        <CTableDataCell>{panel.secret_code || '-'}</CTableDataCell>
                        <CTableDataCell>
                        <a
                          href={`data:image/png;base64,${panel.qr_code_base64}`}
                          download={`${panel.panel_name}_${panel.user_name}.png`}
                        >
                          Download
                        </a>
                        </CTableDataCell>
                        <CTableDataCell>
                            <CButton size="sm"  onClick={() => editUser(panel.user_id)}>
                              <CIcon icon={cilPencil} size="sm" />
                            </CButton>
                            <CButton size="sm"  onClick={() => delete_User(panel.user_id)}>
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

          <CModal size="lg" visible={visible} onClose={() => closeUserModel()}>
            <CModalHeader>
              <CModalTitle>Add User</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm>
              <CRow className="g-3">
                <CCol xs>
                    <CFormLabel htmlFor="username">Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </CCol>
                </CRow>
                <CRow className="g-3">
                  <CCol xs>
                    <CFormLabel htmlFor="email_id">Email Id</CFormLabel>
                    <CFormInput
                      type="text"
                      id="email_id"
                      value={emailId}
                      onChange={(e) => setEmailid(e.target.value)}
                    />
                  </CCol>
                  <CCol xs>
                    <CFormLabel htmlFor="phone_number">Phone Number</CFormLabel>
                    <CFormInput
                      type="text"
                      id="phone_number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs>
                    <CFormLabel htmlFor="panel_select">Panel</CFormLabel>
                    <MultiSelect
                        options={options}
                        value={selected}
                        onChange={setSelected}
                        labelledBy="Select"
                      />
                    {/* <CFormSelect
                      id="panel_select"
                      size="sm"
                      aria-label="Default select example"
                      onChange={(e) => setPanelId(e.target.value)}
                    >
                      <option value="0">Select one</option>
                      {panels.map((panel, index) => (
                        <option key={panel.panel_id} value={panel.panel_id}>
                          {panel.panel_name}
                        </option>
                      ))}
                    </CFormSelect> */}
                  </CCol>
                </CRow>
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => closeUserModel()}>
                Close
              </CButton>
              <CButton color="primary" onClick={saveUser}>
                Save changes
              </CButton>
            </CModalFooter>
          </CModal>
    </>
  )
}

export default Users
