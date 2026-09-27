const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'assets', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer config for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'member-' + Date.now() + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only images allowed'), false);
}});

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_Rvaw3npbDGZ9@ep-broad-dew-azggruaw-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

// Add photo_url column if missing
(async () => {
  try {
    await pool.query(`ALTER TABLE voiddev_members ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT ''`);
    console.log('DB schema ready');
  } catch (e) { console.log('Schema note:', e.message); }
})();

// Register endpoint with photo upload
app.post('/api/register', upload.single('photo'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    // Check if email exists
    const existing = await pool.query('SELECT id FROM voiddev_members WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    const photoUrl = req.file ? '/assets/uploads/' + req.file.filename : '';
    const result = await pool.query(
      'INSERT INTO voiddev_members (name, email, password_hash, photo_url) VALUES ($1, $2, $3, $4) RETURNING id, name, email, photo_url, joined_at',
      [name, email, hash, photoUrl]
    );
    res.json({ success: true, member: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get all registered members (for Tier 2 display)
app.get('/api/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, photo_url, joined_at FROM voiddev_members ORDER BY joined_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM voiddev_members WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const valid = await bcrypt.compare(password, result.rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const { password_hash, ...member } = result.rows[0];
    res.json({ success: true, member });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.listen(3001, () => {
  console.log('VoidDev API running on http://localhost:3001');
});
