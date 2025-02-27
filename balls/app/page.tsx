import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import EmojiBackground from "@/components/emoji-background"

const emojiList: string[] = [
  "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", 
  "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🫐", "🥑", "🥕", "🌽", 
  "🥒", "🥦", "🧄", "🧅", "🍄", "🥜", "🌰", "🍞", "🥐", "🥖", 
  "🥯", "🧀", "🥚", "🍳", "🥓", "🥩", "🍗", "🍖", "🦞", "🍔", 
  "🍟", "🌭", "🍕", "🥪", "🌮", "🍣", "🍩", "🎂", "🍪", "🍫", 
  "🛒", "🏪", "🏬", "🏦", "🏧", "💳", "💰", "💵", "💴", "💶", 
  "💷", "💸", "🪙", "📦", "🎁", "🔖", "🛍️", "📜", "🏷️", "🛎️", 
  "🪧", "🔐", "🔑", "📊", "📉", "🛠️", "🔨", "🪛", "🔧", "🪚", 
  "🧰", "🔩", "⚙️", "🧱", "🚪", "🪑", "🛏️", "🛋️", "🪞", "🪟", 
  "🏺", "🚽", "🛁", "🚿", "🧼", "🪠", "🧽", "🪣", "🕰️", "⏳"
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative bg-gruvbox-bg">
      <EmojiBackground emojiList={emojiList} />
      <div className="absolute inset-0 bg-gruvbox-bg/90 z-10" />
      <div className="relative z-20 flex-1 flex flex-col">
        <main className="flex-1 container mx-auto flex flex-col items-center justify-center py-12">
          <h1 className="text-8xl font-black mb-12 text-center text-gruvbox-fg neobrutalist-shadow">Balls</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            <Card className="neobrutalist-card">
              <CardHeader>
                <CardTitle className="text-2xl font-black">Login</CardTitle>
                <CardDescription className="text-gruvbox-gray">Access your business dashboard</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center"></CardContent>
              <CardFooter>
                <Link href="/login" className="w-full">
                  <Button className="w-full neobrutalist-button">Login</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="neobrutalist-card">
              <CardHeader>
                <CardTitle className="text-2xl font-black">Register</CardTitle>
                <CardDescription className="text-gruvbox-gray">Create a new business account</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center"></CardContent>
              <CardFooter>
                <Link href="/register" className="w-full">
                  <Button className="w-full neobrutalist-button">Register</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </main>

        <footer className="container mx-auto py-6 text-center text-gruvbox-gray text-sm">
          © {new Date().getFullYear()} Balls. All rights reserved.
        </footer>
      </div>
    </div>
  )
}