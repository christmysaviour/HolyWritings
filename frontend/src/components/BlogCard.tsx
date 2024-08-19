import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
interface BlogCardProps {
    authorName: string;
    title: string;
    content: string;
    publishedAt: Date;
    id: number;
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedAt
}: BlogCardProps) => {
    const publishedDate = publishedAt ? new Date(publishedAt) : null;
    return <Link to={`/blog/${id}`}>
        <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
            <div className="flex">
                <Avatar name={authorName} />
                <div className="font-extralight pl-2 text-sm flex justify-center flex-col">{authorName}</div>
                <div className="flex justify-center flex-col pl-2 flex justify-center flex-col">
                    <Circle />
                </div>
                <div className="pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col">
                {publishedDate ? publishedDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }) : 'Not Published'}
                </div>
            </div>
            <div className="text-xl font-semibold pt-2">
                {title}
            </div>
            <div className="text-md font-thin">
                {content.slice(0, 100) + "..."}
            </div>
            <div className="text-slate-500 text-sm font-thin pt-4">
                {`${Math.ceil(content.length / 100)} minute(s) read`}
            </div>
        </div>
    </Link>
}

export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500">

    </div>
}

// export function Avatar({ name, size = "small" }: { name: string, size?: "small" | "big" }) {
//     return <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${size === "small" ? "w-6 h-6" : "w-10 h-10"}`}>
//     <span className={`${size === "small" ? "text-xs" : "text-md"} font-extralight text-gray-600 dark:text-gray-300`}>
//         {name[0]}
//     </span>
// </div>
// }


interface AvatarProps {
    name: string;
    size?: 'small' | 'big';
}

export function Avatar({ name, size = 'small' }: AvatarProps) {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log(token)
            await axios.post(`${BACKEND_URL}/api/v1/user/signout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.removeItem('token');
            navigate('/signup');
        } catch (error) {
            alert('Error while signing out');
        }
    };

    return (
        <div
            className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${size === 'small' ? 'w-6 h-6' : 'w-10 h-10'}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span className={`${size === 'small' ? 'text-xs' : 'text-md'} font-extralight text-gray-600 dark:text-gray-300`}>
                {name[0]}
            </span>
            {hovered && (
                <button
                    onClick={handleSignOut}
                    className="absolute top-12 left-1/2 transform -translate-x-1/2 text-white bg-black focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5"
                >
                    Sign Out
                </button>
            )}
        </div>
    );
}