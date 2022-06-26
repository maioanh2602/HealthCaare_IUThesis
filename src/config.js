require('dotenv').config()

export const CONFIG = {
  PORT: process.env.PORT || 8001,
  ROOT_PATH: process.env.ROOT_PATH || 'C:\\Users\\Doan Son\\Desktop\\ui-health\\',
  HOST: process.env.DB_HOST || '140.83.80.243',
  ENCRYPTION: process.env.ENCRYPTION_STRING || 'DiXaSRhgpo',
  EXPIRE_IN: '1d',
  JWT_ENCRYPTION: 'JWT_ENCRYPTION',
}

