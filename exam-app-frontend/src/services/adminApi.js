import axios from "axios";

const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL || "https://exam-app-mj2m.onrender.com/api";

export const createExamConfig = async (configData) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/admin/config`, configData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Save a subject's configuration
export const saveSubjectConfig = async (subjectConfig) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/admin/config/subject`, subjectConfig);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Other functions: createExamConfig, fetchExamConfigById, etc.

  
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/admin/users`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchExamConfigById = async (configId) => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/admin/config/${configId}`);
    return response.data;
  } catch (error) {
    console.error("Detailed error fetching exam config:", error.response?.data || error);
    throw error.response?.data || error;
  }
};



export const fetchQuestions = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/admin/questions`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
