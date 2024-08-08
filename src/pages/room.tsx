import { useParams } from "react-router-dom"
import { ArrowRight, ArrowUp, Share2 } from "lucide-react"
import { toast } from "sonner"

import amaLogo from '../assets/ama-logo.svg'

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
        <form className='flex gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800 ring-orange-400 ring-offset-2 ring-offset-zinc-950 focus-within:ring-1'>
          <input
            type="text"
            name='theme'
            placeholder="Qual a sua pergunta?"
            autoComplete='off'
            className='flex-1 text-sm bg-transparent mx-2 outline-none text-zinc-100 placeholder:text-zinc-500'
          />
          <button
            type="submit"
            className='bg-orange-400 text-orange-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-orange-500'
          >
            Criar pergunta
            <ArrowRight className='size-4' />
          </button>
        </form>

        <ol className="list-decimal list-outside px-3 space-y-8">
          <li className="ml-4 leading-relaxed text-zinc-100">
            Uma pergunta teste e quais desdobramentos ela pode ter. o ideal é que tivesse mais de uma linha para que possamos ver como o texto se comporta.
            dessa maneira, podemos ter uma ideia de como o texto se comporta em mais de uma linha.

            <button type="button" className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-500">
              <ArrowUp className="size-4" />
              Curtir pergunta ({12})
            </button>
          </li>
          <li className="ml-4 leading-relaxed text-zinc-100">
            Uma pergunta teste e quais desdobramentos ela pode ter. o ideal é que tivesse mais de uma linha para que possamos ver como o texto se comporta.
            dessa maneira, podemos ter uma ideia de como o texto se comporta em mais de uma linha.
            <button type="button" className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300">
              <ArrowUp className="size-4" />
              Curtir pergunta ({0})
            </button>
          </li>
        </ol>
      </div>
    </div>
  )
}