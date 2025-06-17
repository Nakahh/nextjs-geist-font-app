const request = require('supertest');
const express = require('express');
const { autoBlockIP, loginLimiter } = require('../middlewares/securityMiddleware');

const app = express();
app.use(express.json());

// Rota de teste protegida pelo autoBlockIP e loginLimiter
app.post('/login', autoBlockIP(3, 1000 * 60), loginLimiter, (req, res) => {
  const { username, password } = req.body;
  // Simula falha de login
  if (username !== 'user' || password !== 'pass') {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
  res.status(200).json({ message: 'Login bem-sucedido' });
});

describe('Middleware de segurança - autoBlockIP', () => {
  jest.setTimeout(10000);

  it('deve permitir até 3 tentativas falhas e bloquear na 4ª', async () => {
    for (let i = 0; i < 3; i++) {
      const res = await request(app)
        .post('/login')
        .send({ username: 'wrong', password: 'wrong' });
      expect(res.statusCode).toBe(401);
    }

    const blockedRes = await request(app)
      .post('/login')
      .send({ username: 'wrong', password: 'wrong' });
    expect(blockedRes.statusCode).toBe(429);
    expect(blockedRes.body.message).toMatch(/IP bloqueado temporariamente/);
  });

  it('deve resetar contador após login bem-sucedido', async () => {
    // Primeiro, bloqueia o IP
    for (let i = 0; i < 3; i++) {
      await request(app).post('/login').send({ username: 'wrong', password: 'wrong' });
    }
    await request(app).post('/login').send({ username: 'user', password: 'pass' });

    // Agora deve permitir tentativas novamente
    const res = await request(app)
      .post('/login')
      .send({ username: 'wrong', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });
});
