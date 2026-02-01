"use client"

import { useState } from "react"

export default function Home() {
  const [videoId, setVideoId] = useState("")
  const [chapters, setChapters] = useState<string | null>(null)

  const postTimestamp = async () => {
    const accessToken = typeof window !== "undefined" ? localStorage.getItem("yt_access_token") : null
    if (!accessToken) {
      window.location.href = "http://localhost:4000/auth/login"
      return
    }
    const res = await fetch("http://localhost:4000/timestamp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, accessToken }),
    })
    const data = await res.json()
    setChapters(data.chapters ?? null)
  }

  return (
    <div>
      <input
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        placeholder="YouTube video ID"
      />
      <button onClick={postTimestamp}>Get chapters</button>
      {chapters && <pre>{chapters}</pre>}
    </div>
  )
}

