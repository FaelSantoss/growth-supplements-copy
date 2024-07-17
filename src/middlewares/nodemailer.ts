import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fael00992@gmail.com',
    pass: '', // password
  },
})
