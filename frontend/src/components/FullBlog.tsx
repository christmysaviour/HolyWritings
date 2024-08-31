
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";
import { useNavigate } from "react-router-dom";

export const FullBlog = ({ blog, isAuthor }: { blog: Blog, isAuthor: boolean }) => {
    const navigate = useNavigate();
    const handleEdit = () => {
        navigate(`/edit/${blog.id}`);
    };


    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (confirmDelete) {
            await axios.delete(`${BACKEND_URL}/api/v1/blog/${blog.id}`, {
                headers: {
                    Authorization: localStorage.getItem("jwtToken")
                }
            });
            navigate("/blogs");
        }
    };
    const publishedDate = blog.publishedAt ? new Date(blog.publishedAt) : null;
    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div className="grid grid-cols-12 gap-6 px-4 sm:px-10 w-full pt-12 max-w-screen-xl">
                    <div className="col-span-12 md:col-span-8">
                        <div className="text-3xl sm:text-5xl font-extrabold">
                            {blog.title}
                        </div>
                        <div className="text-slate-500 pt-2 text-sm sm:text-base">
                        {publishedDate ? publishedDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }) : 'Not Published'}
                        </div>
                        <div className="pt-4 text-base sm:text-lg">
                {blog.content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
                 ))}
                </div>
                        {isAuthor && (
                            <div className="pt-4">
                            <button 
                                onClick={handleEdit} 
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={handleDelete} 
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300 ml-2"
                            >
                                Delete
                            </button>
                        </div>
                        
                        )}
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        <div className="text-slate-600 text-lg">
                            Author
                        </div>
                        <div className="flex w-full pt-4 md:pt-0">
                            <div className="pr-4 flex flex-col justify-center">
                                <Avatar size="big" name={blog.author.name || "Anonymous"} />
                            </div>
                            <div>
                                <div className="text-lg sm:text-xl font-bold">
                                    {blog.author.name || "Anonymous"}
                                </div>
                                <div className="pt-2 text-slate-500 text-sm sm:text-base">
                                    Random catch phrase about the author's ability to grab the user's attention
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

