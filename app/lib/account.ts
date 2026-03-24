import { v4 as uuidv4 } from 'uuid';

const users = [
  {
    id: uuidv4(),
    name: 'User',
    email: process.env.ADMIN_EMAIL || 'admin@test.co.id',
    password: process.env.ADMIN_PASSWORD || 'testingDoang',
  },
];

export { users };
