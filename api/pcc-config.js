module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  res.status(200).json({
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    API_KEY: process.env.API_KEY || process.env.SUPABASE_ANON_KEY || '',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS || ''
  });
};
