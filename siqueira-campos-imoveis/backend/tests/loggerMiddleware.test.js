const express = require('express');
const request = require('supertest');
const { loggerMiddleware } = require('../middlewares/loggerMiddleware');

describe('Logger Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(loggerMiddleware);

    app.get('/test', (req, res) => {
      res.status(200).json({ message: 'ok' });
    });

    app.get('/error', (req, res) => {
      res.status(500).json({ message: 'error' });
    });
  });

  it('deve registrar logs para requisição e resposta com status 200', async () => {
    const res = await request(app).get('/test');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'ok' });
  });

  it('deve registrar logs para resposta com status 500', async () => {
    const res = await request(app).get('/error');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: 'error' });
  });
});
