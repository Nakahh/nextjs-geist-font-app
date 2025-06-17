const Queue = require('bull');
const pdfQueueModule = require('../services/pdfQueue');
const pdfService = require('../services/pdfService');

jest.mock('../services/pdfService');

describe('PDF Queue Service', () => {
  beforeAll(() => {
    // Mock da função interna de geração de PDF
    pdfService._generateFichaTecnicaPDF.mockImplementation(async (imovel) => {
      return `/fake/path/ficha_tecnica_${imovel.id}.pdf`;
    });
  });

  afterAll(async () => {
    await pdfQueueModule.pdfQueue.close();
  });

  it('deve adicionar job na fila e processar gerando PDF', async () => {
    const imovel = { id: 123, titulo: 'Teste Imovel' };
    const job = await pdfQueueModule.addPdfToQueue(imovel);
    const result = await job.finished();

    expect(result).toBe(`/fake/path/ficha_tecnica_${imovel.id}.pdf`);
  });

  it('deve usar cache para evitar geração duplicada', async () => {
    const imovel = { id: 123, titulo: 'Teste Imovel' };
    // Adiciona job pela segunda vez
    const job = await pdfQueueModule.addPdfToQueue(imovel);
    const result = await job.finished();

    expect(result).toBe(`/fake/path/ficha_tecnica_${imovel.id}.pdf`);
    expect(pdfService._generateFichaTecnicaPDF).toHaveBeenCalledTimes(1);
  });
});
