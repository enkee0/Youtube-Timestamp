"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Callback() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get("code")
      if (!code) return
      const res = await fetch(`http://localhost:4000/auth/callback?code=${code}`)
      const tokens = await res.json()
      if (tokens?.access_token) {
        localStorage.setItem("yt_access_token", tokens.access_token)
        if (tokens.refresh_token) localStorage.setItem("yt_refresh_token", tokens.refresh_token)
      }
      router.push("/")
    }
    run()
  }, [router])

  return <div>Connecting account...</div>
}
