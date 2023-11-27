import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

export function renderPdf(docDefinitions: TDocumentDefinitions) {
  return pdfMake.createPdf(docDefinitions, undefined, undefined, pdfFonts.pdfMake.vfs); // TODO: setup default fonts/vfs etc
}

export async function renderPdfToBuffer(docDefinitions: TDocumentDefinitions) {
  return new Promise<Buffer>((resolve, reject) => {
    try {
      renderPdf(docDefinitions).getBuffer((buffer) => {
        resolve(buffer);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export async function renderPdfToBase64(docDefinitions: TDocumentDefinitions) {
  return new Promise<string>((resolve, reject) => {
    try {
      renderPdf(docDefinitions).getBase64((base64) => {
        resolve(base64);
      });
    } catch (e) {
      reject(e);
    }
  });
}
