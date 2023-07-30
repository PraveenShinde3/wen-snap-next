import { NextResponse } from "next/server";

const puppeteer = require("puppeteer");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function GET() {
  return NextResponse.json({
    success: true,
  });
}

export async function POST(request) {
  const { url } = await request.json();

  if (!url) {
    return new Response(JSON.stringify({ message: "Missing required data" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  console.log(url);
  const res = await takeScreenshot(url)
    .then((screenshot) => uploadScreenshot(screenshot))
    .then((result) => {
      return result;
    });

  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function takeScreenshot(url) {
  // Create a browser instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Set viewport width and height
  await page.setViewport({ width: 1920, height: 1080 });

  const website_url = url;

  console.log(url);

  // Open URL in current page
  await page.goto(website_url, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  // Capture screenshot
  const screenshot = await page.screenshot({
    omitBackground: false,
    encoding: "binary",
  });

  // Close the browser instance
  await browser.close();

  return screenshot;
}

function uploadScreenshot(screenshot) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {};
    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(screenshot);
  });
}
