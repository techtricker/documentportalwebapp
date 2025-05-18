import axios from 'axios';

const API_URL = 'http://localhost:8000';  // Replace with your backend API URL

//const API_URL = 'http://13.203.228.41:8000'; 

// Axios instance with the base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Login function to get the JWT token
export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { portal_user_name: username, password: password });
    const access_token = response.data.access_token;
    // Store the JWT token in localStorage
    localStorage.setItem('token', access_token);

    return response.data;
  } catch (error) {
    console.error('Login Error: ', error);
    throw error;
  }
};

export const getUserDetails = async () => {
    try {
        const response = await api.get('/user-details');  // Assuming the endpoint for panels is '/panels'
        return response.data;
    } catch (error) {
        console.error('Error fetching panels: ', error);
        throw error;
    }
};

export const updatePanel = async (object,panelid) => {
    try {
        const response = await api.put('/panels/'+panelid, object);  
        return response.data;
    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
};

export const updateUser = async (object,userId) => {
    try {
        const response = await api.put('/users/'+userId, object);  
        return response.data;
    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
};

export const getDashboardDetails = async () => {
    try {
        const response = await api.get('/admin-dashboard');  // Assuming the endpoint for panels is '/panels'
        return response.data;
    } catch (error) {
        console.error('Error fetching panels: ', error);
        throw error;
    }
};

export const deletePanel = async (panelid) => {
    try {
        const response = await api.delete('/panels/'+panelid);  // Assuming the endpoint for panels is '/panels'
        return response.data;
    } catch (error) {
        console.error('Error fetching panels: ', error);
        throw error;
    }
};

export const deleteFile = async (file_id) => {
    try {
        const response = await api.delete('/file-meta/'+file_id);  // Assuming the endpoint for panels is '/panels'
        return response.data;
    } catch (error) {
        console.error('Error fetching panels: ', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete('/users/'+userId);  // Assuming the endpoint for panels is '/panels'
        return response.data;
    } catch (error) {
        console.error('Error fetching panels: ', error);
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await api.get('/users');  // Assuming the endpoint for panels is '/panels'
        return response.data;
    } catch (error) {
        console.error('Error fetching panels: ', error);
        throw error;
    }
};

export const createUser = async (object) => {
    try {
        const response = await api.post('/users', object);  
        return response.data;
    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
};

export const userAssignment = async (object) => {
    try {
        const response = await api.post('/user-assignment', object);  
        return response.data;
    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
};

export const getPanels = async () => {
    try {
        const response = await api.get('/panels');  // Assuming the endpoint for panels is '/panels'
        return response.data;
    } catch (error) {
        console.error('Error fetching panels: ', error);
        throw error;
    }
};

export const getPanelFiles = async (panel_id) => {
    try {
        const response = await api.get('/panel-files/'+panel_id);  // Assuming the endpoint for panels is '/panels'
        return response.data;
    } catch (error) {
        console.error('Error fetching panels: ', error);
        throw error;
    }
};

export const createPanel = async (object) => {
    try {
        const response = await api.post('/panels', object);  
        return response.data;
    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
};

export const verifySecretCode = async (secretCode) => {
    try {
        const response = await api.post('/verify-secret/'+secretCode);  // Assuming the endpoint for panels is '/panels'
        return response.data;
    } catch (error) {
        console.error('Error fetching panels: ', error);
        throw error;
    }
};

export const getAssignedFiles = async (object) => {
    try {
        const response = await api.post('/get-assigned-files/',{access_token: object});  // Assuming the endpoint for panels is '/panels'
        return response.data;
    } catch (error) {
        console.error('Error fetching panels: ', error);
        throw error;
    }
};

// Add Authorization header to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to catch 401 errors (unauthorized / token expired)
api.interceptors.response.use(
    (response) => response, // just return the response if it's successful
    (error) => {
        if (error.response && error.response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token'); // Remove the token
        window.location.reload();
        }
        return Promise.reject(error); // Pass the error to calling functions
    }
);

export default api;
