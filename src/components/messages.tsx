import { useParams } from "react-router-dom";
import { Message } from "./message";
import { getRoomMessages, GetRoomMessagesResponse } from "../http/get-room-messages";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";


export function Messages() {
  const queryClient = useQueryClient()
  const { roomId } = useParams()

  if (!roomId) {
    throw new Error('Messages component must be used within room page')
  }

  const { data } = useSuspenseQuery({
    queryKey: ['messages', roomId],
    queryFn: () => getRoomMessages({ roomId })
  })


  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`)

    ws.onopen = () => {
      console.log('Connected websocket!')
    }
    ws.onclose = () => {
      console.log('Disconnected from websocket!')
    }
    ws.onmessage = (event) => {
      const data: {
        kind: 'message_created' | 'message_answered' | 'reaction_added' | 'reaction_removed',
        value: any
      } = JSON.parse(event.data)

      switch (data.kind) {
        case 'message_created':
          queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], state => {
            return {
              messages: [
                ...(state?.messages ?? []),
                {
                  id: data.value.id,
                  text: data.value.message,
                  amountOfReactions: data.value.amountOfReactions,
                  anserwed: data.value.anserwed,
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

  return (
    <ol className="list-decimal list-outside px-3 space-y-8">
      {data.messages?.map(message => {
        return (
          <Message
            key={message.id}
            id={message.id}
            text={message.text}
            amountOfReactions={message.amountOfReactions}
            anserwed={message.anserwed}
          />
        )
      })}
    </ol>
  )
}