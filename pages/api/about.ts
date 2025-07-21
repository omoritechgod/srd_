```typescript
// pages/api/about.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { authMiddleware } from '../../middleware/authMiddleware';
import { handleFileUpload, deleteFile } from '../../utils/upload';
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

// GET About content (Public)
/**
 * @swagger
 * /api/about:
 *   get:
 *     summary: Get About Us page content
 *     tags:
 *       - About
 *     responses:
 *       200:
 *         description: About Us content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/About'
 *       404:
 *         description: About content not found (should be initialized)
 *       500:
 *         description: Internal server error
 */
apiRoute.get(async (req, res) => {
  try {
    const aboutContent = await prisma.about.findFirst();
    if (!aboutContent) {
      // Initialize if not found
      const newAbout = await prisma.about.create({
        data: {
          content: 'Default About Us content. Please update via admin dashboard.',
          image: null,
        },
      });
      return res.status(200).json(newAbout);
    }
    res.status(200).json(aboutContent);
  } catch (error) {
    console.error('Failed to fetch about content:', error);
    res.status(500).json({ message: 'Failed to fetch about content' });
  }
});

// PUT update About content (Admin Protected)
/**
 * @swagger
 * /api/about:
 *   put:
 *     summary: Update About Us page content (admin only)
 *     tags:
 *       - About
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               oldFilePath:
 *                 type: string
 *                 description: Path of the old image file to delete
 *     responses:
 *       200:
 *         description: About Us content updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/About'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
apiRoute.put(authMiddleware(handleFileUpload('image')), async (req: any, res: NextApiResponse) => {
  const { content, oldFilePath } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : oldFilePath;

  try {
    let aboutContent = await prisma.about.findFirst();

    if (!aboutContent) {
      // Create if it doesn't exist
      aboutContent = await prisma.about.create({
        data: {
          content: content || 'Default About Us content.',
          image: imageUrl,
        },
      });
    } else {
      // Update existing content
      aboutContent = await prisma.about.update({
        where: { id: aboutContent.id },
        data: {
          content: content || aboutContent.content,
          image: imageUrl,
        },
      });
    }
    res.status(200).json(aboutContent);
  } catch (error: any) {
    console.error('Failed to update about content:', error);
    if (req.file) await deleteFile(`/uploads/${req.file.filename}`); // Clean up new uploaded file on DB error
    res.status(500).json({ message: 'Failed to update about content', error: error.message });
  }
});

export default apiRoute;
```