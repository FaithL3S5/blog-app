import axios from "axios";

const accessToken = `${process.env.NEXT_PUBLIC_API_KEY}`;

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

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

const deleteUser = async (user: FormUser) => {
  try {
    const response = await axios.delete(`${apiUrl}/users/${user.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

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
};
