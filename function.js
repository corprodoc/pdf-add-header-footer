import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fetch from 'node-fetch'
import { upload } from '@glideapps/plugin-uploader'

export default async function main({ pdfUrl, headerText }) {
  const existingPdfBytes = await fetch(pdfUrl).then(r => r.arrayBuffer())
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const pages = pdfDoc.getPages()

  for (const page of pages) {
    const { width, height } = page.getSize()
    page.drawText(headerText, {
      x: 50,
      y: height - 50,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    })
  }

  const modifiedBytes = await pdfDoc.save()
  const uploadedUrl = await upload(modifiedBytes, 'headered.pdf')
  return { outputPdfUrl: uploadedUrl }
}
