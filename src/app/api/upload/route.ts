import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary if credentials exist
if (process.env.CLOUDINARY_URL || (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    let fileBuffer: Buffer | null = null;
    let fileName = '';
    let folder = 'uploads';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      folder = (formData.get('folder') as string) || 'uploads';

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      fileBuffer = Buffer.from(bytes);
      const ext = path.extname(file.name) || '.jpg';
      const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      fileName = `${Date.now()}_${baseName}${ext}`;
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      const { dataUrl, filename, folder: f } = body;
      if (f) folder = f;

      if (!dataUrl) {
        return NextResponse.json({ error: 'No dataUrl provided' }, { status: 400 });
      }

      const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json({ error: 'Invalid data URL format' }, { status: 400 });
      }

      fileBuffer = Buffer.from(matches[2], 'base64');
      const ext = filename ? path.extname(filename) : '.jpg';
      fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    } else {
      return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 400 });
    }

    if (!fileBuffer) {
      return NextResponse.json({ error: 'Failed to process file' }, { status: 400 });
    }

    // 1. If Cloudinary is configured, upload to Cloudinary (ideal for Vercel persistent storage)
    const hasCloudinary = !!(process.env.CLOUDINARY_URL || (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET));

    if (hasCloudinary) {
      try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: `venner_photo_studio/${folder}`, resource_type: 'auto' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(fileBuffer);
        });

        return NextResponse.json({
          url: uploadResult.secure_url,
          filename: fileName,
          storage: 'cloudinary',
        });
      } catch (cloudErr: any) {
        console.error('Cloudinary upload error, falling back to local file storage:', cloudErr);
      }
    }

    // 2. Local File System upload (ideal for local development)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, fileBuffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      url: publicUrl,
      filename: fileName,
      storage: 'local',
    });
  } catch (err: any) {
    console.error('Upload handler failed:', err);
    return NextResponse.json({ error: err.message || 'Server error during upload' }, { status: 500 });
  }
}
