// import { useEffect, useState } from "react"
// import axios from "axios";
// import { BACKEND_URL } from "../config";


export interface Blog {
    "content": string;
    "title": string;
    "id": number;
    "authorId": number;
    "author": {
        "name": string
    };
    "publishedAt":Date;
}

// export const useBlog = ({ id }: { id: string }) => {
//     const [loading, setLoading] = useState(true);
//     const [blog, setBlog] = useState<Blog>();

//     useEffect(() => {
//         axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
//             headers: {
//                 Authorization: localStorage.getItem("jwtToken")
//             }
//         })
//             .then(response => {
//                 setBlog(response.data.blog);
//                 setLoading(false);
//             })
//     }, [id])

//     return {
//         loading,
//         blog
//     }

// }

// import jwt_decode from "jwt-decode";
// // import jwt_decode from "jwt-decode";

// export const useBlog = ({ id }: { id: string }) => {
//     const [loading, setLoading] = useState(true);
//     const [blog, setBlog] = useState<Blog>();
//     const [isAuthor, setIsAuthor] = useState(false);

//     useEffect(() => {
//         const token = localStorage.getItem("jwtToken");
//         if (token) {
//             const decodedToken = jwt_decode<{ id: string }>(token);

//             const userId = decodedToken.id;

//             axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
//                 headers: {
//                     Authorization: token
//                 }
//             })
//                 .then(response => {
//                     const blog = response.data.blog;
//                     setBlog(blog);
//                     setIsAuthor(blog.author.id === userId);
//                     setLoading(false);
//                 });
//         } else {
//             setLoading(false);
//         }
//     }, [id]);

//     return {
//         loading,
//         blog,
//         isAuthor
//     }
// }

// export const useBlogs = () => {
//     const [loading, setLoading] = useState(true);
//     const [blogs, setBlogs] = useState<Blog[]>([]);

//     useEffect(() => {
//         axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
//             headers: {
//                 Authorization: localStorage.getItem("jwtToken")
//             }
//         })
//             .then(response => {
//                 setBlogs(response.data.blogs);
//                 setLoading(false);
//             })
//     }, [])

//     return {
//         loading,
//         blogs
//     }
// }
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { KJUR } from 'jsrsasign';



interface DecodedToken {
    id: string;
}

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            try {
                const decodedToken = KJUR.jws.JWS.parse(token).payloadObj as DecodedToken;
                const userId = decodedToken.id;
                axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                    .then(response => {
                        const blogData = response.data.blog;
                        setBlog(blogData);
                        setIsAuthor(blogData.authorId === userId);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error("Error fetching blog:", error);
                        setLoading(false);
                    });
            } catch (error) {
                console.error("Error decoding token:", error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [id]);

    return {
        loading,
        blog,
        isAuthor
    };
};

// export const useBlogs = () => {
//     const [loading, setLoading] = useState(true);
//     const [blogs, setBlogs] = useState<Blog[]>([]);

//     useEffect(() => {
//         axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
//             headers: {
//                 Authorization: localStorage.getItem("jwtToken") || ""
//             }
//         })
//             .then(response => {
//                 setBlogs(response.data.blogs);
//                 setLoading(false);
//             })
//             .catch(error => {
//                 console.error("Error fetching blogs:", error);
//                 setLoading(false);
//             });
//     }, []);

//     return {
//         loading,
//         blogs
//     };
// };



export const useBlogs = (myBlogs: boolean) => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken") || "";
        const fetchBlogs = async () => {
            try {
                const url = myBlogs 
                    ? `${BACKEND_URL}/api/v1/blog/my-blogs`
                    : `${BACKEND_URL}/api/v1/blog/bulk`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                setBlogs(response.data.blogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [myBlogs]);

    return {
        loading,
        blogs
    };
};
