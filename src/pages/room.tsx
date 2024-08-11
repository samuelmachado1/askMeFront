import { useParams } from "react-router-dom"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

import amaLogo from '../assets/ama-logo.svg'
import { Messages } from "../components/messages"
import { Suspense } from "react"
import { CreateMessageForm } from "../components/create-message-form"

export function Room() {
  const { roomId } = useParams()

  function handleShareRoom() {
    const url = window.location.href.toString()

    if (navigator.share !== undefined && navigator.canShare()) {
      navigator.share({ url })
    } else {
      navigator.clipboard.writeText(url)
    }

    toast.info('Link copiado para a área de transferência!')
  }

  return (
    <div className="m-auto items-center flex flex-col gap-6 py-10 px-4 max-w-[640px]">
      <div className="flex items-center gap-6 px-3">
        <img src={amaLogo} alt="Ask Me Anything logo" className="h-5" />

        <span className="text-sm text-zinc-500 truncate">
          Código da sala: <span className="text-zinc-300">{roomId}</span>
        </span>

        <button
          type="submit"
          onClick={handleShareRoom}
          className='ml-auto bg-zinc-800 text-zinc-300 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-zinc-700'
        >
          Compartilhar
          <Share2 className='size-4' />
        </button>
      </div>

      <div className="h-px w-full bg-zinc-900" />

      <div className="flex flex-col gap-6 max-w-[640px] w-full">
        <CreateMessageForm />
        <Suspense fallback={<div>Carregando...</div>}>
          <Messages />
        </Suspense>
      </div>
    </div>
  )
}