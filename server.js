const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like index.html)
app.use(express.static(__dirname));

// Excel file path
const filePath = path.join(__dirname, 'user_data.xlsx');

// Handle form submission
app.post('/submit-form', (req, res) => {
  const { name, email, mobile, socialMedia, projectType, message } = req.body;

  let workbook, worksheet;

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const existingData = XLSX.utils.sheet_to_json(worksheet);
    existingData.push({ Name: name, Email: email, Mobile: mobile, SocialMedia: socialMedia, ProjectType: projectType, Message: message });
    worksheet = XLSX.utils.json_to_sheet(existingData);
    workbook.Sheets[workbook.SheetNames[0]] = worksheet;
  } else {
    const newData = [{ Name: name, Email: email, Mobile: mobile, SocialMedia: socialMedia, ProjectType: projectType, Message: message }];
    worksheet = XLSX.utils.json_to_sheet(newData);
    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Data');
  }

  XLSX.writeFile(workbook, filePath);
  res.json({ message: 'Form submitted successfully!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
