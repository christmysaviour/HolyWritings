
import { createBlogInput, updateBlogInput } from "@christoursaviour/medium-commo";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    },
    Variables: {
      userId: string;
    }
  }>();
  
  // Middleware for JWT authentication
  blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("Authorization") || "";
    // const authHeader = c.req.header('Token')?.split(' ')[1]||"";
    try {
      const user = await verify(authHeader, c.env.JWT_SECRET);
      if (user) {
        c.set("userId", user.id as string);
        await next();
      } else {
        c.status(403);
        return c.json({ message: "You are not logged in" });
      }
    } catch (e) {
      c.status(403);
      return c.json({ message: "You are not logged in" });
    }
  });
  
  // Blog operations
  blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    console.log(body)
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({ message: "Inputs not correct" });
    }
  
    const authorId = c.get("userId");
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(authorId),
        publishedAt: new Date()
      }
    });
    
    return c.json({ id: blog.id });
  });
  
 
  blogRouter.put('/:id', async (c) => {
    const  id = c.req.param("id");
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({ message: "Inputs not correct" });
    }

    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

    try {
        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: {
                title: body.title,
                content: body.content,
                publishedAt: new Date(), 
            },
        });
        return c.json({updatedBlog});
    } catch (error) {
        c.status(500);
        return c.json({ message: "Failed to update blog post" });
    }
});

blogRouter.get('/my-blogs', async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  if (!userId) {
    c.status(401);
    return c.json({ message: "User not authenticated" });
  }

  try {
      const blogs = await prisma.blog.findMany({
          where: { authorId: Number(userId) },
          select: {
              content: true,
              title: true,
              id: true,
              author: { select: { name: true } },
              publishedAt: true
          }
      });
      return c.json({ blogs });
  } catch (e) {
      console.error('Error fetching blogs:', e);
      c.status(411);
      return c.json({ message: "Error while fetching blogs" });
  }
});

  
  // Get all blogs
  blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
    const blogs = await prisma.blog.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        author: { select: { name: true } },
        publishedAt:true
      }
    });
// async function deleteAllData() {
//   await prisma.blog.deleteMany({});
//   await prisma.user.deleteMany({});
//   // Repeat for other tables if necessary
// }

// await deleteAllData()
//   .then(() => {
//     console.log('All data deleted successfully.');
//   })
//   .catch((e) => {
//     console.error('Error deleting data:', e);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
    return c.json({ blogs });
  });
  
  // Get a specific blog
  blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  
    try {
      const blog = await prisma.blog.findFirst({
        where: { id: String(id) },
        select: {
          id: true,
          title: true,
          content: true,
          author: { select: { name: true } },
          authorId:true,
          publishedAt:true
        }
      });
      console.log(blog?.authorId)
      return c.json({ blog });
    } catch (e) {
      c.status(411);
      return c.json({ message: "Error while fetching blog post" });
    }
});


blogRouter.delete('/:id', async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    await prisma.blog.delete({
      where: { id: String(id) }
    });

    return c.json({ message: "Blog deleted successfully" });
  } catch (e) {
    c.status(411);
    return c.json({ message: "Error while deleting blog post" });
  }
});

