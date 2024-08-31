import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import { signupInput, signinInput } from "@christoursaviour/medium-commo";
import { jwt } from 'hono/jwt';

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();


userRouter.post('/signup', async (c) => {
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: "Inputs not correct" });
  }

  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name
      }
    });


    const existingSession = await prisma.session.findFirst({
      where: { userId: user.id },
    });

    if (existingSession) {
      await prisma.session.delete({
        where: { id: existingSession.id },
      });
    }

    const sessionToken = await sign({ id: user.id }, c.env.JWT_SECRET);

    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: user.id
      }
    });

    const jwtToken = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      sessionToken,
      jwtToken
    });
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.text('Invalid');
  }
});


userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: "Inputs not correct" });
  }

  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findFirst({
      where: { email: body.email, password: body.password }
    });
    if (!user) {
      c.status(403);
      return c.json({ message: "Incorrect credentials" });
    }

   
    const existingSession = await prisma.session.findFirst({
      where: { userId: user.id },
    });

    if (existingSession) {
      await prisma.session.delete({
        where: { id: existingSession.id },
      });
    }

    const sessionToken = await sign({ id: user.id }, c.env.JWT_SECRET);

    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: user.id
      }
    });

    const jwtToken = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      sessionToken,
      jwtToken,
      userId: user.id 
    });
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.text('Invalid');
  }
});

// Signout
userRouter.post('/signout', async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    console.log('Received token:', token);

    if (!token) {
      console.error('No token provided');
      return c.json({ error: 'No token provided' }, 400);
    }

    const session = await prisma.session.findUnique({ where: { token } });
    if (!session) {
      console.error('Session not found');
      return c.json({ error: 'Session not found' }, 404);
    }

    await prisma.session.delete({ where: { token } });
    return c.json({ message: 'Signed out successfully' }, 200);
  } catch (error) {
    console.error('Error signing out:', error);
    return c.json({ error: 'Failed to sign out' }, 500);
  }
});
