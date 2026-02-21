---
name: handling-file-uploads
description: Use when building file upload functionality with Next.js App Router, validating files client and server-side, storing in Supabase Storage, and providing progress feedback.
---

# Handling File Uploads

## Client-Side File Input with Validation

✅ **Correct**
```typescript
'use client';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  const f = e.target.files?.[0];
  if (!f || f.size > MAX_FILE_SIZE || !ALLOWED_TYPES.includes(f.type)) {
    setError('Invalid file');
    return;
  }
  setFile(f);
}
```

❌ **Wrong** - No validation: `setFile(e.target.files?.[0]);`
## API Route Handler with Server Validation

✅ **Correct**
```typescript
// app/api/upload/route.ts
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  // MUST validate server-side
  if (!file || file.size > 10485760) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  }
  if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(`${Date.now()}-${file.name}`, buffer);

  return error
    ? NextResponse.json({ error: error.message }, { status: 500 })
    : NextResponse.json({ url: data.path });
}
```

❌ **Wrong** - Trusts client: `await supabase.storage.from('uploads').upload(file.name, buffer);`
## Supabase Storage Setup

✅ **Bucket & Upload**
```typescript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// One-time
await supabase.storage.createBucket('uploads', { public: true, fileSizeLimit: 10485760 });

// Get public URL
const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(path);
```

## Upload Progress Indicator

✅ **XMLHttpRequest Pattern**
```typescript
const xhr = new XMLHttpRequest();
xhr.upload.addEventListener('progress', (e) => {
  setProgress((e.loaded / e.total) * 100);
});
const fd = new FormData();
fd.append('file', file);
xhr.open('POST', '/api/upload');
xhr.send(fd);
```

## Image Optimization (Client-Side)

✅ **Resize Before Upload**
```typescript
async function resizeImage(file: File, maxWidth = 1920) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(img.width, maxWidth);
    canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      uploadFile(new File([blob], file.name, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.8);
  };
}
```

## Security Best Practices

✅ **Always** - Server-side MIME validation, size limits on both client/server, secure filenames (timestamps), malware scanning (ClamAV, VirusTotal), private bucket

❌ **Never** - Client-side only validation, store in DB, trust extensions, user paths, all file types

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No server validation | Always re-validate on API route |
| Missing size limits | Set limits client AND server |
| Storing in DB | Use Supabase Storage / S3 |
| No progress feedback | XMLHttpRequest progress events |
| Accepting all types | Allowlist MIME types only |