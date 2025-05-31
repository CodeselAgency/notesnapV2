import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function PDFProcessor({ file }) {
  const [text, setText] = useState("");

  const onLoadSuccess = async (pdf) => {
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    setText(fullText);
  };

  return (
    <div>
      <Document file={file} onLoadSuccess={onLoadSuccess}>
        <Page pageNumber={1} />
      </Document>
      <div>
        <h3>Extracted Text:</h3>
        <pre>{text}</pre>
      </div>
    </div>
  );
}
