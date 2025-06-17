const emailService = require('../services/emailService');
const nodemailer = require('nodemailer');

jest.mock('nodemailer');

describe('Email Service', () => {
  let sendMailMock;

  beforeAll(() => {
    sendMailMock = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
  });

  it('deve enviar email com sucesso', async () => {
    const emailData = {
      to: 'test@example.com',
      subject: 'Teste',
      text: 'Conteúdo do email'
    };

    const result = await emailService.sendEmail(emailData);

    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining(emailData));
    expect(result).toEqual(expect.objectContaining({ messageId: 'test-message-id' }));
  });

  it('deve lançar erro se envio falhar', async () => {
    sendMailMock.mockRejectedValueOnce(new Error('Falha no envio'));

    const emailData = {
      to: 'fail@example.com',
      subject: 'Teste Fail',
      text: 'Conteúdo do email'
    };

    await expect(emailService.sendEmail(emailData)).rejects.toThrow('Falha no envio');
  });
});
