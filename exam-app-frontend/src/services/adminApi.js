import axios from "axios";

const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL || "https://exam-app-5gw3.onrender.com/api";

// Create exam configuration (for admin)
export const createExamConfig = async (configData) => {
  try {
    console.log("Sending exam config data:", configData);
    const response = await axios.post(`${ADMIN_API_URL}/admin/config`, configData);
    return response.data;
  } catch (error) {
    console.error("createExamConfig error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Save a subject's configuration (if used separately)
export const saveSubjectConfig = async (subjectConfig) => {
  try {
    console.log("Saving subject config:", subjectConfig);
    const response = await axios.post(`${ADMIN_API_URL}/admin/config/subject`, subjectConfig);
    return response.data;
  } catch (error) {
    console.error("saveSubjectConfig error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Fetch users (admin-related)
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/admin/users`);
    return response.data;
  } catch (error) {
    console.error("fetchUsers error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Fetch exam configuration by examId
export const fetchExamConfigById = async (configId) => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/admin/config/${configId}`);
    return response.data;
  } catch (error) {
    console.error("Detailed error fetching exam config:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Fetch questions (if needed)
export const fetchQuestions = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/admin/questions`);
    return response.data;
  } catch (error) {
    console.error("fetchQuestions error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};
