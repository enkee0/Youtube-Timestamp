"use client"

export default function Home() {
  const login = () => {
    window.location.href = "http://localhost:4000/auth/login"
  }

  return (
    <div>
      <button onClick={login}>Login with Google</button>
    </div>
  )
}

