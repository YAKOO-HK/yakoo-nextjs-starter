import contentDisposition from 'content-disposition';
import { renderPdfToBuffer } from '@/pdf/render';

export const GET = async function () {
  const pdfBuffer = await renderPdfToBuffer({
    content: [
      { text: 'Hello World!', fontSize: 16 },
      {
        table: {
          body: [
            [{ text: 'Column 1' }, { text: 'Column 2' }],
            ['One value goes here', 'Another one here'],
            ['Something else is here', 'Yup, here it is'],
          ],
          headerRows: 1,
        },
      },
    ],
  });
  return new Response(pdfBuffer, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': contentDisposition('sample.pdf', { type: 'inline' }),
    },
  });
};
