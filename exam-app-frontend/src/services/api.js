import axios from "axios";

const API_URL = "https://exam-app-2ep2.onrender.com/api";

// Register normal users
export const registerUser = async (name, email, password, role) => {
  try {
    // For normal users, role is always "user"
    const payload = { name, email, password, role: "user" };
    const response = await axios.post(`${API_URL}/auth/register`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Login normal users
export const loginUser = async (email, password) => {
  try {
    const payload = { email, password, role: "user" };
    const response = await axios.post(`${API_URL}/auth/login`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin Registration
export const adminRegister = async (name, email, password, adminCode) => {
  try {
    const payload = { name, email, password, role: "admin", adminCode };
    const response = await axios.post(`${API_URL}/admin/register`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin Login
export const adminLogin = async (email, password, adminCode) => {
  try {
    const payload = { email, password, role: "admin", adminCode };
    const response = await axios.post(`${API_URL}/admin/login`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Exam Submission API
export const submitExam = async (userId, answers) => {
  try {
    const response = await axios.post(`${API_URL}/exam/submit`, { userId, answers });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Fetch User Data API (for Dashboard)
export const fetchUserData = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
