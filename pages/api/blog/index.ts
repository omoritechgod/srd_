```typescript
// pages/api/blog/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { handleFileUpload, deleteFile } from '../../../utils/upload';
import nextConnect from 'next-connect';

// Disable Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error('API Route Error:', error);
    res.status(501).json({ message: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: `Method '${req.method}' Not Allowed` });
  },
});

// GET all blog posts (Public)
/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Get all blog posts
 *     tags:
 *       - Blog
 *     responses:
 *       200:
 *         description: A list of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BlogPost'
 *       500:
 *         description: Internal server error
 */
apiRoute.get(async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    res.status(500).json({ message: 'Failed to fetch blog posts' });
  }
});

// POST create new blog post (Admin Protected)
/**
 * @swagger
 * /api/blog:
 *   post:
 *     summary: Create a new blog post
 *     tags:
 *       - Blog
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
apiRoute.post(authMiddleware(handleFileUpload('image')), async (req: any, res: NextApiResponse) => {
  const { title, content, tags } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !content) {
    if (imageUrl) await deleteFile(imageUrl); // Clean up uploaded file if validation fails
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  const tagArray = tags ? tags.split(',').map((tag: string) => tag.trim()) : [];

  try {
    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        image: imageUrl,
        tags: tagArray,
      },
    });
    res.status(201).json(newPost);
  } catch (error: any) {
    console.error('Failed to create blog post:', error);
    if (imageUrl) await deleteFile(imageUrl); // Clean up uploaded file on DB error
    res.status(500).json({ message: 'Failed to create blog post', error: error.message });
  }
});

export default apiRoute;
```