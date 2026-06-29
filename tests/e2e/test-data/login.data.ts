export const validUser = {
  username: process.env.E2E_USERNAME ?? '',
  password: process.env.E2E_PASSWORD ?? '',
};

export const invalidUser = {
  username: 'invalid_user',
  password: 'WrongPassword123!',
};
