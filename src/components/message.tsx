import { ArrowUp } from "lucide-react";
import { useState } from "react";

interface MessageProps {
  text: string
  amountOfReactions: number
  anserwed?: boolean
}


export function Message({ text, amountOfReactions, anserwed = false }: MessageProps) {
  const [hasReacted, setHasReacted] = useState(false)

  function handleReactToMessage() {
    setHasReacted(true)
  }

  return (
    <li data-anserwed={anserwed} className="ml-4 leading-relaxed text-zinc-100 data-[anserwed=true]:opacity-50 data-[anserwed=true]:pointer-events-none" >
      {text}
      {hasReacted ? (
        <button type="button" className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-500">
          <ArrowUp className="size-4" />
          Curtir pergunta ({amountOfReactions})
        </button>
      ) : (
        <button type="button" onClick={handleReactToMessage} className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300">
          <ArrowUp className="size-4" />
          Curtir pergunta ({amountOfReactions})
        </button>
      )
      }


    </li>

  )
}