"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function GoToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 800) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      aria-label="Go to top"
      onClick={scrollToTop}
      className={cn(
        "rounded-full p-3 w-12",
        "bg-muted/50 backdrop-blur-sm",
        "hover:bg-muted transition-all duration-300 cursor-pointer",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
        "md:ml-0"
      )}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-muted-foreground hover:text-foreground"
      >
        <path
          d="M10.5376 22.7916C11.0152 22.7207 22.5795 21.1781 22.0978 10.4211C22.0536 9.43274 21.9303 8.53367 21.7387 7.71865M10.5376 22.7916C16.876 22.3728 20.0969 19.8899 21.5383 16.9142M10.5376 22.7916C9.7707 22.9055 8.97982 22.8964 8.19743 22.7725M21.7387 7.71865C21.4988 6.69828 21.1518 5.80967 20.7188 5.04257M21.7387 7.71865C22.6022 10.1105 23.0542 13.7848 21.5383 16.9142M20.7188 5.04257C17.1684 -1.24629 7.83127 0.632493 4.27577 5.04257C2.88063 6.77451 -0.0433281 11.1668 1.38159 16.6571C2.27481 20.0988 5.17269 22.2936 8.19743 22.7725M20.7188 5.04257C22.0697 6.9404 24.0299 11.3848 22.3541 15.4153M21.5383 16.9142C21.8737 16.4251 22.1428 15.9235 22.3541 15.4153M8.19743 22.7725C12.1971 23.4683 20.6281 22.971 22.3541 15.4153M14 10.945C13.3836 10.289 12.003 8.63215 11.2034 7.04814C11.1703 6.98257 11.0247 6.98456 10.9937 7.05061C10.5221 8.05496 9.07362 9.92941 8 10.945M11.0333 7.44444C10.9392 9.86549 11 15 12 17"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
