const emailQueueModule = require('../services/emailQueue');
const emailService = require('../services/emailService');

jest.mock('../services/emailService');

describe('Email Queue Service', () => {
  beforeAll(() => {
    emailService.sendEmail.mockImplementation(async (emailData) => {
      return { success: true, messageId: 'fake-message-id' };
    });
  });

  afterAll(async () => {
    await emailQueueModule.emailQueue.close();
  });

  it('deve adicionar job na fila e processar envio de email', async () => {
    const emailData = {
      to: 'test@example.com',
      subject: 'Teste',
      text: 'Conteúdo do email'
    };
    const job = await emailQueueModule.addEmailToQueue(emailData);
    const result = await job.finished();

    expect(result).toEqual({ success: true, messageId: 'fake-message-id' });
  });

  it('deve tentar reenviar email em caso de falha', async () => {
    let attempt = 0;
    emailService.sendEmail.mockImplementationOnce(async () => {
      attempt++;
      if (attempt === 1) throw new Error('Falha no envio');
      return { success: true, messageId: 'retry-message-id' };
    });

    const emailData = {
      to: 'retry@example.com',
      subject: 'Teste Retry',
      text: 'Conteúdo do email'
    };
    const job = await emailQueueModule.addEmailToQueue(emailData);
    const result = await job.finished();

    expect(result).toEqual({ success: true, messageId: 'retry-message-id' });
  });
});
