const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require("cors")
const app = express();

// Middleware to handle JSON responses
app.use(express.json());
app.use(cors());

// Endpoint to return the list of files in the current directory
app.get('/api/files', (req, res) => {
	const directoryPath = __dirname; // Path to the directory where server.js is located

	fs.readdir(directoryPath, (err, files) => {
		if (err) {
			console.error('Error reading directory:', err);
			return res.status(500).json({ error: 'Unable to read directory' });
		}

		// Map files to include id and name
		const fileList = files
			.filter(file => {
				const stat = fs.statSync(file);
				return !stat.isDirectory();
			})
			.map((file, index) => ({
			id: index + 1,
			name: file,
		}));
		res.json(fileList);
	});
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});


// Endpoint to load file content
app.get('/api/load', (req, res) => {
	const { file } = req.query;

	if (!file) {
		return res.status(400).json({ error: 'No file specified' });
	}

	console.log(file)
	const filePath = path.join(__dirname, file);

	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			console.error(`Error reading file: ${file}`, err);
			return res.status(500).json({ error: 'Unable to load file content' });
		}

		res.send(data);
	});
});
