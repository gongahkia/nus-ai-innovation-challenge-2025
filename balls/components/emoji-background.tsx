"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface EmojiBackgroundProps {
  emojiList: string[]
}

const EmojiBackground: React.FC<EmojiBackgroundProps> = ({ emojiList }) => {
  const [rows, setRows] = useState<string[][]>([])

  useEffect(() => {
    const generateRows = () => {
      const numberOfRows = Math.ceil(window.innerHeight / 50) // Adjust 50 to change the density of emoji rows
      const newRows = []
      for (let i = 0; i < numberOfRows; i++) {
        const row = []
        for (let j = 0; j < 20; j++) {
          // 20 emojis per row, adjust as needed
          row.push(emojiList[Math.floor(Math.random() * emojiList.length)])
        }
        newRows.push(row)
      }
      setRows(newRows)
    }

    generateRows()
    window.addEventListener("resize", generateRows)

    return () => {
      window.removeEventListener("resize", generateRows)
    }
  }, [emojiList])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {rows.map((row, index) => (
        <div
          key={index}
          className={`whitespace-nowrap text-4xl ${index % 2 === 0 ? "animate-scroll-left" : "animate-scroll-right"}`}
          style={{
            animationDuration: `${Math.random() * 20 + 20}s`, // Random duration between 20-40s
          }}
        >
          {row.join(" ")} {row.join(" ")} {/* Duplicate to ensure continuous scrolling */}
        </div>
      ))}
    </div>
  )
}

export default EmojiBackground