import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { GetRoomMessagesResponse } from "../http/get-room-messages"

interface UseMessagesWebSocketsParams {
  roomId: string
}

type WebHookMessage = | {
  kind: 'message_created',
  value: {
    id: string
    message: string
  }
} | {
  kind: 'message_answered',
  value: {
    id: string
  }
} | {
  kind: 'reaction_added' | 'reaction_removed',
  value: {
    id: string
    reaction_count: number
  }
}


export function useMessagesWebSockets({
  roomId,
}: UseMessagesWebSocketsParams) {

  const queryClient = useQueryClient()

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`)

    ws.onopen = () => {
      console.log('Connected websocket!')
    }
    ws.onclose = () => {
      console.log('Disconnected from websocket!')
    }
    ws.onmessage = (event) => {
      const data: WebHookMessage = JSON.parse(event.data)

      switch (data.kind) {
        case 'message_created':
          queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], state => {
            return {
              messages: [
                ...(state?.messages ?? []),
                {
                  id: data.value.id,
                  text: data.value.message,
                  amountOfReactions: 0,
                  anserwed: false,
                }
              ]
            }
          }
          )
          break
        case 'message_answered':
          queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], state => {
            if (!state) {
              return undefined
            }

            return {
              messages: state?.messages?.map(message => {
                if (message.id === data.value.id) {
                  return {
                    ...message,
                    anserwed: true
                  }
                }

                return message
              })
            }
          })
          console.log('Message answered:', data.value)
          break
        case 'reaction_added':
        case 'reaction_removed':
          queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], state => {
            if (!state) {
              return undefined
            }
            return {
              messages: state.messages.map(message => {
                if (message.id === data.value.id) {
                  return {
                    ...message,
                    amountOfReactions: data.value.reaction_count
                  }
                }
                return message
              })
            }
          })
          break
      }
    }

    return () => {
      ws.close()
    }

  }, [roomId])
} 