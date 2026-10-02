const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const akid = (process.env.AWS_ACCESS_KEY_ID || "").trim();
    const sak = (process.env.AWS_SECRET_ACCESS_KEY || "").trim();
    if (!akid || !sak) return res.status(500).json({ error: "AWS credentials not configured" });
    const client = new DynamoDBClient({ region: "ap-south-1", credentials: { accessKeyId: akid, secretAccessKey: sak } });
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });
    const existing = await client.send(new GetItemCommand({ TableName: "voiddev_members", Key: { email: { S: email } } }));
    if (existing.Item) return res.status(409).json({ error: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const joinedAt = new Date().toISOString();
    await client.send(new PutItemCommand({ TableName: "voiddev_members", Item: { email: { S: email }, name: { S: name }, password_hash: { S: hash }, photo_url: { S: "" }, joined_at: { S: joinedAt } } }));
    res.json({ success: true, member: { name, email, photo_url: "", joined_at: joinedAt } });
  } catch (err) { console.error(err); res.status(500).json({ error: "Registration failed", detail: err.message }); }
};