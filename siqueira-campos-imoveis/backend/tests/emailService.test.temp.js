const emailService = require('../services/emailService');
const nodemailer = require('nodemailer');

jest.mock('nodemailer');

describe('Email Service', () => {
  let sendMailMock;

  beforeAll(() => {
    sendMailMock = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
  });

  it('deve enviar email de verificação com sucesso', async () => {
    const email = 'test@example.com';
    const token = 'token123';

    await emailService.sendVerificationEmail(email, token);

    expect(sendMailMock).toHaveBeenCalled();
  });

  it('deve enviar email de boas-vindas com sucesso', async () => {
    const email = 'welcome@example.com';
    const nome = 'Usuário';

    await emailService.sendWelcomeEmail(email, nome);

    expect(sendMailMock).toHaveBeenCalled();
  });

  it('deve enviar email de redefinição de senha com sucesso', async () => {
    const email = 'reset@example.com';
    const token = 'token456';

    await emailService.sendPasswordResetEmail(email, token);

    expect(sendMailMock).toHaveBeenCalled();
  });

  it('deve enviar confirmação de visita com sucesso', async () => {
    const email = 'visita@example.com';
    const visita = { imovel: { titulo: 'Casa' }, data: new Date(), horario: '10:00', corretor: { nome: 'Corretor' } };

    await emailService.sendVisitaConfirmacao(email, visita);

    expect(sendMailMock).toHaveBeenCalled();
  });
});
