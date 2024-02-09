const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { connectDB } = require("./connect");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// MongoDB connection options
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: '1rn21ai031.ayajanand@gmail.com',
    pass: 'sbel uqrc obok cbfm',
  },
});

const sendEmail = (to, subject, text, attachment) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: '1rn21ai031.ayajanand@gmail.com',
      to,
      subject,
      text,
      attachments: [
        {
          filename: attachment.originalname,
          content: attachment.buffer,
        },
      ],
    };

    // console.log(`Sending email to: ${to}`);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email to ${to}:`, error);
        reject(error);
      } else {
        // console.log(`Email sent to ${to}: ${info.response}`);
        resolve(`Email sent to ${to}: ${info.response}`);
      }
    });
  });
};

app.post('/send-emails', upload.single('pdfFile'), async (req, res) => {
  try {
    // Connect to MongoDB
    let mongoDB = await connectDB();
    let collection = mongoDB.collection("newsletter_data");

    // Fetch all documents from the collection
    const users = await collection.find().toArray();

    // Iterate through each user and send an email
    for (const user of users) {
      const greetingMessage = `Hello ${user.name},\n\nGreetings from Ayaj Anand!\n\n`;

      console.log(`Sending email to: ${user.email}`);
      const result = await sendEmail(user.email, 'Subject of your email', greetingMessage, req.file);
      console.log(result);
    }

    res.json({ message: 'Email sending process completed' });
    console.log("Process Completed !")
  } catch (error) {
    console.error('Error triggering email sending:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
