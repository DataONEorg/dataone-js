import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Serve examples directory
app.use('/examples', express.static(path.join(process.cwd(), 'examples')));

// Serve src directory
app.use('/src', express.static(path.join(process.cwd(), 'src')));

// Serve dist directory
app.use('/dist', express.static(path.join(process.cwd(), 'dist')));

// Redirect root to the examples index.html
app.get('/', (req, res) => {
  res.redirect('/examples/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
