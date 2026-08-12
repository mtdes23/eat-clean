const bcrypt = require('bcryptjs');
const { prisma } = require('./prisma');

const users = new Map();

const fakeSession = {
  user: null,
};

async function register(email, password, name) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email da duoc su dung');

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name: name || email.split('@')[0] },
  });
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Sai email hoac mat khau');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Sai email hoac mat khau');

  fakeSession.user = { id: user.id, email: user.email, name: user.name, role: user.role };
  return fakeSession.user;
}

function getSession() {
  return fakeSession;
}

function clearSession() {
  fakeSession.user = null;
}

module.exports = { register, login, getSession, clearSession };
