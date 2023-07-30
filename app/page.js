"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function Home() {
  const API_URL = "api/snap";
  const [snapUrl, setSnapUrl] = useState("");
  const [url, setUrl] = useState("");
  const [takingScreenshot, setTakingScreenshot] = useState(false);

  const takeScreenshotAsync = async (url) => {
    console.info("called");
    setTakingScreenshot(true);
    setSnapUrl("");
    try {
      const data = {
        url: url,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(API_URL, data, config);

      console.log("Response:", response.data);
      setSnapUrl(response.data.url);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setTakingScreenshot(false);
    }
  };

  const dataChange = (e) => {
    var expression =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    if (e.target.value.match(expression)) {
      setUrl(e.target.value);
    }
    console.log(e.target.value);
  };

  const submitLink = (e) => {
    e.preventDefault();
    if (url === "") {
      console.log("Empty");
    } else {
      takeScreenshotAsync(url);
    }
  };

  return (
    <main className="flex min-h-screen h-screen flex-col items-center justify-between px-24 py-4">
      <div className=" z-10 w-full max-w-5xl items-center flex-col gap-2 h-full  text-sm flex">
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 my-4">
            <Input
              type="text"
              placeholder="URL (example : https://example.com/)"
              onChange={dataChange}
            />
          </div>

          {takingScreenshot ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button onClick={submitLink} type="submit">
              Take Screenshot
            </Button>
          )}
        </div>

        <Card className="w-full overflow-hidden flex flex-grow items-center justify-center ">
          {snapUrl ? (
            <img src={snapUrl} width="100%"></img>
          ) : takingScreenshot ? (
            <Skeleton className=" w-full h-full" />
          ) : (
            <p>Take a Quick snapshot of the websites</p>
          )}
        </Card>
      </div>
    </main>
  );
}
