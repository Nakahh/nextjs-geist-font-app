const Queue = require('bull');
const pdfService = require('./pdfService');
const fs = require('fs');
const path = require('path');

const pdfQueue = new Queue('pdfQueue', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  }
});

// Cache simples em memória (pode ser substituído por Redis ou outro cache)
const pdfCache = new Map();

// Processar jobs da fila
pdfQueue.process(async (job) => {
  const { imovel } = job.data;
  const cacheKey = `ficha_tecnica_${imovel.id}`;

  if (pdfCache.has(cacheKey)) {
    return pdfCache.get(cacheKey);
  }

  const filePath = await pdfService._generateFichaTecnicaPDF(imovel);
  pdfCache.set(cacheKey, filePath);

  return filePath;
});

// Função para adicionar geração de PDF à fila
const addPdfToQueue = async (imovel) => {
  return pdfQueue.add({ imovel }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 30000 // 30 segundos
    },
    removeOnComplete: true,
    removeOnFail: false
  });
};

module.exports = {
  addPdfToQueue,
  pdfQueue,
  pdfCache
};
