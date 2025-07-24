import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fetch from 'node-fetch'
import { upload } from '@glideapps/plugin-uploader'

export default async function ({ pdfUrl, headerText }) {
  // 1. Download the existing PDF
  const res = await fetch(pdfUrl)
  const existingPdfBytes = await res.arrayBuffer()

  // 2. Load the PDF
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const pages = pdfDoc.getPages()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // 3. Add header to each page
  pages.forEach((page) => {
    const { width, height } = page.getSize()
    page.drawText(headerText, {
      x: 50,
      y: height - 50,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    })
  })

  // 4. Save modified PDF
  const modifiedPdfBytes = await pdfDoc.save()

  // 5. Upload to Glide & return URL
  const uploadedUrl = await upload(modifiedPdfBytes, 'modified.pdf')
  return uploadedUrl
}
