// pages/api/blog/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { handleFileUpload, deleteFile } from '../../../utils/upload';
import nextConnect from 'next-connect';

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

// GET single blog post by slug (Public)
/**
 * @swagger
 * /api/blog/{slug}:
 *   get:
 *     summary: Get a single blog post by slug
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug of the blog post to retrieve
 *     responses:
 *       200:
 *         description: A single blog post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
apiRoute.get(async (req, res) => {
  const { id } = req.query; // Using 'id' from query for consistency, but it's actually the slug
  const slug = id as string; // Cast to string

  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    res.status(500).json({ message: 'Failed to fetch blog post' });
  }
});

// PUT update blog post by ID (Admin Protected)
/**
 * @swagger
 * /api/blog/{id}:
 *   put:
 *     summary: Update a blog post by ID
 *     tags:
 *       - Blog
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog post to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               oldFilePath:
 *                 type: string
 *                 description: Path of the old image file to delete
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
apiRoute.put(authMiddleware(handleFileUpload('image')), async (req: any, res: NextApiResponse) => {
  const { id } = req.query;
  const { title, content, tags, oldFilePath } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : oldFilePath; // Keep old path if no new file

  if (!title || !content) {
    if (req.file) await deleteFile(`/uploads/${req.file.filename}`); // Clean up new uploaded file if validation fails
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  const tagArray = tags ? tags.split(',').map((tag: string) => tag.trim()) : [];

  try {
    const updatedPost = await prisma.blogPost.update({
      where: { id: String(id) },
      data: {
        title,
        slug,
        content,
        image: imageUrl,
        tags: tagArray,
      },
    });
    res.status(200).json(updatedPost);
  } catch (error: any) {
    console.error('Failed to update blog post:', error);
    if (req.file) await deleteFile(`/uploads/${req.file.filename}`); // Clean up new uploaded file on DB error
    res.status(500).json({ message: 'Failed to update blog post', error: error.message });
  }
});

// DELETE blog post by ID (Admin Protected)
/**
 * @swagger
 * /api/blog/{id}:
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags:
 *       - Blog
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog post to delete
 *     responses:
 *       204:
 *         description: Blog post deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
apiRoute.delete(authMiddleware((req: NextApiRequest, res: NextApiResponse) => async () => {
  const { id } = req.query;

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: String(id) },
    });

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await prisma.blogPost.delete({
      where: { id: String(id) },
    });

    if (post.image) {
      await deleteFile(post.image);
    }

    res.status(204).end();
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    res.status(500).json({ message: 'Failed to delete blog post' });
  }
}));

export default apiRoute;