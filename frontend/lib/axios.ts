


import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SERVER_ENDPOINT);


// Retrieve token dynamically when making requests
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
};


const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});

const instanceUpload = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_ENDPOINT,
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "multipart/form-data",
  },
});

// Axios configuration
instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to update Authorization header with the latest token before each request
instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    config.headers.Authorization = `Bearer ${getToken()}`;
  }
  return config;
});

// Interceptor to update Authorization header with the latest token before each request
instanceUpload.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    config.headers.Authorization = `Bearer ${getToken()}`;
  }
  return config;
});

const submitPaymentAndShipping = async (paymentData: any) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/users/register-bidder`, paymentData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting payment and shipping:', error);
    throw error;
  }
};

const verifyUserStatus = async (token: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/users/activate`, {
      params: { token },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying user status:', error);
    throw error;
  }
};

export { instance, instanceUpload, submitPaymentAndShipping, verifyUserStatus, socket  };
