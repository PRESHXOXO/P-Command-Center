module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const payload = {};
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const apiKey = process.env.API_KEY || process.env.SUPABASE_ANON_KEY || '';
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS || '';

  if (supabaseUrl.trim()) payload.SUPABASE_URL = supabaseUrl.trim();
  if (apiKey.trim()) payload.API_KEY = apiKey.trim();
  if (adminEmail.trim()) payload.ADMIN_EMAIL = adminEmail.trim();

  res.status(200).json(payload);
};
