// src/components/PDFViewer.js
import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
//import workerSrc from 'pdfjs-dist/build/pdf.worker.entry'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`

const PDFViewer = ({ fileId }) => {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [numPages, setNumPages] = useState(null)

  useEffect(() => {
    
    const fetchPDF = async () => {
      try {
        const response = await fetch(`http://13.203.228.41:8000/view-file/${fileId}`)
        const blob = await response.blob()
        setPdfUrl(URL.createObjectURL(blob))
      } catch (err) {
        console.error('Error fetching PDF:', err)
      }
    }
    if(fileId != 0){
        fetchPDF()
    }

  }, [fileId])

  return (
    <div>
      {pdfUrl ? (
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  )
}

export default PDFViewer
