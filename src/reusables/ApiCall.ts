import axios from "axios";

// Fetch API key and URL from environment variables
const accessToken = `${process.env.NEXT_PUBLIC_API_KEY}`;
const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

// Define types for the user data and post content
type FormUser = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
};

type PostContent = {
  user: number;
  title: string;
  body: string;
};

type CommentForm = {
  name: string;
  email: string;
  body: string;
};

// Function to fetch a list of users based on the page
const getUsers = async (page: number) => {
  try {
    const response = await axios.get(
      `${apiUrl}/users?page=${page}&per_page=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

// Function to search for a user by name
const searchUser = async (name: string) => {
  try {
    const response = await axios.get(`${apiUrl}/users?name=${name}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

// Function to create a new user
const postUser = async (user: FormUser) => {
  try {
    const response = await axios.post(`${apiUrl}/users`, user, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

// Function to update an existing user
const putUser = async (user: FormUser) => {
  try {
    const response = await axios.put(`${apiUrl}/users/${user.id}`, user, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

// Function to delete a user
const deleteUser = async (userId: number) => {
  try {
    const response = await axios.delete(`${apiUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

// Function to fetch a list of posts based on the page
const getPosts = async (page: number) => {
  try {
    const response = await axios.get(
      `${apiUrl}/posts?page=${page}&per_page=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

// Function to fetch a specific post by ID
const getSpecificPost = async (postId: number) => {
  try {
    const response = await axios.get(`${apiUrl}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

// Function to fetch comments for a specific post
const getComments = async (postId: number) => {
  try {
    const response = await axios.get(`${apiUrl}/posts/${postId}/comments`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

// Function to create a new post for a specific user
const createPost = async (userId: number, postData: PostContent) => {
  try {
    const response = await axios.post(
      `${apiUrl}/users/${userId}/posts`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

// Function to create a new comment on a specific post
const createComment = async (postId: number, commentData: CommentForm) => {
  try {
    const response = await axios.post(
      `${apiUrl}/posts/${postId}/comments`,
      commentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

// Export all the functions
export {
  createPost,
  deleteUser,
  getComments,
  getPosts,
  getSpecificPost,
  getUsers,
  postUser,
  putUser,
  searchUser,
  createComment,
};
