const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "ap-south-1", credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY } });
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const result = await client.send(new ScanCommand({ TableName: "voiddev_members" }));
    const members = (result.Items || []).map(item => ({ name: item.name.S, email: item.email.S, photo_url: item.photo_url ? item.photo_url.S : "", joined_at: item.joined_at.S })).sort((a, b) => new Date(b.joined_at) - new Date(a.joined_at));
    res.json(members);
  } catch (err) { console.error(err); res.status(500).json({ error: "Failed to fetch members" }); }
};