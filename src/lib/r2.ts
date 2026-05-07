// Cloudflare R2 — S3-compatible storage for PDFs, GLB models, large files
// Uses @aws-sdk/client-s3 which is compatible with R2

const R2_ACCOUNT_ID  = process.env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY  = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_KEY  = process.env.R2_SECRET_ACCESS_KEY!
const R2_BUCKET      = process.env.R2_BUCKET_NAME || 'folyx-assets'
const R2_PUBLIC_URL  = process.env.R2_PUBLIC_URL  || 'https://assets.folyx.com'

function getR2Client() {
  const { S3Client } = require('@aws-sdk/client-s3')
  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY, secretAccessKey: R2_SECRET_KEY },
  })
}

// ── Upload a file to R2 ──
export async function uploadToR2(
  key: string,           // e.g. "akhinoor/pdfs/book-123.pdf"
  body: Buffer | Blob,
  contentType: string
): Promise<string> {
  const { PutObjectCommand } = require('@aws-sdk/client-s3')
  const client = getR2Client()
  await client.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  }))
  return `${R2_PUBLIC_URL}/${key}`
}

// ── Delete a file from R2 ──
export async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const { DeleteObjectCommand } = require('@aws-sdk/client-s3')
    const client = getR2Client()
    await client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }))
    return true
  } catch { return false }
}

// ── Get public URL for a key ──
export function getR2Url(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`
}

// ── Key builders ──
export const R2Keys = {
  pdf:  (clientId: string, id: string) => `${clientId}/pdfs/${id}.pdf`,
  glb:  (clientId: string, id: string) => `${clientId}/models/${id}.glb`,
  img:  (clientId: string, id: string) => `${clientId}/images/${id}`,
}
