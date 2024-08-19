import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { BACKEND_URL } from "../config";

export const EditBlog = () => {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
   
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                    headers: {
                        Authorization: `${localStorage.getItem("jwtToken")}`
                    }
                });
                console.log("Fetched blog data:", response.data); // Log the response
                const blog = response.data.blog; // Extract blog from response
                setTitle(blog.title);
                setDescription(blog.content);
            } catch (error) {
                console.error("Failed to fetch blog post:", error);
            }
        };
        fetchBlog();
    }, [id]);

    // Update blog data
    const handleUpdate = async () => {
        try {
            await axios.put(`${BACKEND_URL}/api/v1/blog/${id}`, {
                title,
                content: description,
            }, {
                headers: {
                    Authorization: `${localStorage.getItem("jwtToken")}`,
                    'Content-Type': 'application/json'
                }
            });
            navigate(`/blog/${id}`);
        } catch (error) {
            console.error("Failed to update blog post:", error);
        }
    };
    
    
    

    return (
        <div>
            <Appbar />
            <div className="flex justify-center w-full pt-8">
                <div className="max-w-screen-lg w-full">
                    <input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        type="text" 
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        placeholder="Title" 
                    />

                    <TextEditor 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />

                    <button 
                        onClick={handleUpdate} 
                        type="submit" 
                        className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                    >
                        Update post
                    </button>
                </div>
            </div>
        </div>
    );
}

function TextEditor({ value, onChange }: { value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }) {
    return (
        <div className="mt-2">
            <div className="w-full mb-4">
                <div className="flex items-center justify-between border">
                    <div className="my-2 bg-white rounded-b-lg w-full">
                        <label className="sr-only">Edit post</label>
                        <textarea 
                            value={value} 
                            onChange={onChange} 
                            id="editor" 
                            rows={8} 
                            className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2" 
                            placeholder="Edit your article..." 
                            required 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
