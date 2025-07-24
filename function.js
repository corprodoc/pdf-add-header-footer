import fetch from 'node-fetch'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { upload } from '@glideapps/plugin-uploader'

export default async function ({ pdfUrl, headerText }) {
  const response = await fetch(pdfUrl)
  const pdfBytes = await response.arrayBuffer()
  const pdfDoc = await PDFDocument.load(pdfBytes)

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  for (const page of pdfDoc.getPages()) {
    const { height } = page.getSize()
    page.drawText(headerText, {
      x: 50,
      y: height - 40,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    })
  }

  const modifiedPdfBytes = await pdfDoc.save()
  const url = await upload(modifiedPdfBytes, 'header-added.pdf')
  return url
}
