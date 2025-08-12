import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`

const PDFViewer = ({ fileName, panelName, fileId }) => {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [progress, setProgress] = useState(0)  // For download progress

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        //const response = await fetch(`http://103.16.202.161:8899/view-file/${panelName}/${fileName}`)
        const response = await fetch(`http://59.90.12.58:8080/view-file/${panelName}/${fileName}`)
        if (!response.ok) throw new Error('Network response was not ok')

        const contentLength = response.headers.get('content-length')
        if (!contentLength) {
          // If content-length header is missing, just load normally
          const blob = await response.blob()
          setPdfUrl(URL.createObjectURL(blob))
          setProgress(100)
          return
        }

        const total = parseInt(contentLength, 10)
        let loaded = 0
        const reader = response.body.getReader()
        const chunks = []

        while(true) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
          loaded += value.length
          setProgress(Math.round((loaded / total) * 100))
        }

        // Combine chunks into a blob
        const blob = new Blob(chunks, { type: 'application/pdf' })
        setPdfUrl(URL.createObjectURL(blob))
      } catch (err) {
        console.error('Error fetching PDF:', err)
      }
    }

    if (fileId !== 0) {
      setProgress(0)
      setPdfUrl(null)
      fetchPDF()
    }
  }, [fileId, panelName, fileName])

  return (
    <div>
      {!pdfUrl ? (
        <div>
          <p style={{color:"#222"}}>Downloading PDF... {progress}%</p>
          <progress value={progress} max="100" style={{ width: '100%' }} />
        </div>
      ) : (
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      )}
    </div>
  )
}

export default PDFViewer
