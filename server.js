const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like index.html)
app.use(express.static(__dirname));

// Google Sheets Setup
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SHEET_ID = '1g8pQdorETyaG8LAAwTYfzI0DFLa1Gef3rSYPjT3C6Es'; // 🟡 Replace with your actual sheet ID

app.post('/submit-form', async (req, res) => {
  const { name, email, mobile, socialMedia, projectType, message } = req.body;

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A:G',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          name,
          email,
          mobile,
          socialMedia,
          projectType,
          message,
          new Date().toLocaleString()
        ]],
      },
    });

    res.status(200).json({ message: 'Form submitted successfully to Google Sheet!' });
  } catch (err) {
    console.error('Error writing to sheet:', err);
    res.status(500).json({ message: 'Failed to submit form.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
