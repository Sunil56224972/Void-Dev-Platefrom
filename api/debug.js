module.exports = async (req, res) => {
  const akid = process.env.AWS_ACCESS_KEY_ID || "MISSING";
  const sak = process.env.AWS_SECRET_ACCESS_KEY || "MISSING";
  res.json({
    keyLength: akid.length,
    keyFirst4: akid.substring(0,4),
    secretLength: sak.length,
    secretFirst4: sak.substring(0,4),
    hasNewline: sak.includes("\n") || sak.includes("\r"),
    charCodes: [...sak].map(c => c.charCodeAt(0)).join(",")
  });
};