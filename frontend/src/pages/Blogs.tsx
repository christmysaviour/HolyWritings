import { useState } from "react";
import { Appbars } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

export const Blogs = () => {
    const [showMyBlogs, setShowMyBlogs] = useState(false);
    const { loading, blogs } = useBlogs(showMyBlogs);

    const toggleBlogs = () => {
        setShowMyBlogs(!showMyBlogs);
    };

    if (loading) {
        return (
            <div>
                <Appbars onToggle={toggleBlogs} showMyBlogs={showMyBlogs} />
                <div className="flex justify-center">
                    <div>
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Appbars onToggle={toggleBlogs} showMyBlogs={showMyBlogs} />
            <div className="flex justify-center">
                <div>
                    {blogs.map(blog => (
                        <BlogCard
                            key={blog.id}
                            id={blog.id}
                            authorName={blog.author.name || "Anonymous"}
                            title={blog.title}
                            content={blog.content}
                            publishedAt={blog.publishedAt}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
