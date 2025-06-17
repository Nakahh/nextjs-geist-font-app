const Queue = require('bull');
const emailService = require('./emailService');

const emailQueue = new Queue('emailQueue', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  }
});

// Processar jobs da fila
emailQueue.process(async (job) => {
  const { type, data } = job.data;
  try {
    switch (type) {
      case 'verification':
        await emailService.sendVerificationEmail(data.email, data.token);
        break;
      case 'welcome':
        await emailService.sendWelcomeEmail(data.email, data.nome);
        break;
      case 'passwordReset':
        await emailService.sendPasswordResetEmail(data.email, data.token);
        break;
      case 'visitaConfirmada':
        await emailService.sendVisitaConfirmacao(data.email, data.visita);
        break;
      default:
        throw new Error('Tipo de email desconhecido');
    }
  } catch (error) {
    throw error;
  }
});

// Função para adicionar email à fila com retry
const addEmailToQueue = async (type, data) => {
  await emailQueue.add({ type, data }, {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 60000 // 1 minuto
    },
    removeOnComplete: true,
    removeOnFail: false
  });
};

module.exports = {
  addEmailToQueue,
  emailQueue
};
