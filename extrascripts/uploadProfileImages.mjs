// uploadProfiles.jsx
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

const IMGBB_API_KEY = "91d28585f8ee3b15c470598f26509b6a"; // 🔑 put your API key here
const LINKS_FILE = "./uploaded_links.txt";

// Fetch 100 random user images from randomuser.me
async function fetchRandomUsers(count = 100) {
  console.log("📡 Fetching random user images...");
  const res = await fetch(`https://randomuser.me/api/?results=${count}`);
  const data = await res.json();
  return data.results.map((u) => ({
    name: `${u.name.first} ${u.name.last}`,
    imageUrl: u.picture.large,
  }));
}

// Upload one image to imgbb
async function uploadToImgbb(imageUrl) {
  try {
    // Fetch image and convert to base64
    const imageBuffer = await fetch(imageUrl).then((res) => res.arrayBuffer());
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    // Prepare form data
    const formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", base64Image);

    // Upload using POST (as per imgbb docs)
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const json = await response.json();
    if (json.success) {
      return json.data.url;
    } else {
      console.error("❌ Upload failed:", json.error?.message || json);
      return null;
    }
  } catch (err) {
    console.error("⚠️ Error uploading:", err.message);
    return null;
  }
}

async function main() {
  const users = await fetchRandomUsers();
  const results = [];

  console.log(`🚀 Uploading ${users.length} images to imgbb...`);
  for (let i = 0; i < users.length; i++) {
    const { name, imageUrl } = users[i];
    console.log(`➡️ Uploading ${i + 1}/${users.length}: ${name}`);
    const imgbbUrl = await uploadToImgbb(imageUrl);
    if (imgbbUrl) {
      results.push({ name, imgbbUrl });
    }
    // optional small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Save all links to a file
  const textData = results.map((r) => `${r.name}: ${r.imgbbUrl}`).join("\n");

  fs.writeFileSync(LINKS_FILE, textData);
  console.log(
    `✅ Done! Saved ${results.length} uploaded image links to ${LINKS_FILE}`
  );
}

main();
