import axios from "axios";

async function sendRequest(method, url, body = null) {
  console.log("body", body);
  const baseURL = "https://colors-site-sgv1.vercel.app"; // Ensure this is defined in .env

  if (!baseURL) {
    throw new Error("Base URL is not defined in the environment variables.");
  }

  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
  console.log(`Request URL: ${baseURL + url}`);
  
  try {
    const response = await axios({
      method: method.toLowerCase(),
      url: baseURL + url,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Conditionally add token
      },
      data: body,
      withCredentials: false,
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.data.message || "Request failed");
    }

    return response;
  } catch (error) {
    console.error("Request error:", error);

    if (error.response) {
      console.error("Error response data:", error.response.data);
      throw new Error(error.response.data.message || "Server error");
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("No response received from server");
    } else {
      console.error("Request setup error:", error.message);
      throw new Error(error.message);
    }
  }
}

export default sendRequest;
