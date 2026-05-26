export function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.includes('res.cloudinary.com')) {
    // Inject optimization parameters: w=width, quality, format=auto
    const parts = src.split('/upload/');
    if (parts.length === 2) {
      const transformations = `w_${width},c_limit,q_${quality || 'auto'},f_auto`;
      return `${parts[0]}/upload/${transformations}/${parts[1]}`;
    }
  }
  return src;
}

export function getCloudinaryVideoUrl(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'mock_cloud_name';
  return `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto/${publicId}`;
}
