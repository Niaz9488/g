export default function handler(req, res) {
  // 1. Get the key sent by the extension
  const { key } = req.body;

  // 2. Your list of "Valid Keys" (In a real app, these would be in a database)
  const validKeys = ["FREE-KEY-2026", "GIFT-99-ABC", "PRO-USER-XYZ"];

  // 3. Check if the key exists
  if (validKeys.includes(key)) {
    return res.status(200).json({ 
      status: "authorized", 
      message: "License is valid!" 
    });
  } else {
    return res.status(403).json({ 
      status: "denied", 
      message: "Invalid Activation Key" 
    });
  }
}
