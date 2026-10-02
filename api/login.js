const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const bcrypt = require("bcryptjs");
const client = new DynamoDBClient({ region: "ap-south-1", credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY } });
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { email, password } = req.body;
    const result = await client.send(new GetItemCommand({ TableName: "voiddev_members", Key: { email: { S: email } } }));
    if (!result.Item) return res.status(401).json({ error: "Invalid email or password" });
    const valid = await bcrypt.compare(password, result.Item.password_hash.S);
    if (!valid) return res.status(401).json({ error: "Invalid email or password" });
    const member = { name: result.Item.name.S, email: result.Item.email.S, photo_url: result.Item.photo_url ? result.Item.photo_url.S : "", joined_at: result.Item.joined_at.S };
    res.json({ success: true, member });
  } catch (err) { console.error(err); res.status(500).json({ error: "Login failed" }); }
};