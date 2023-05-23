'use client'

import { MessagesContext } from './../context/messages'

import { cn } from '../utils/cn'
import { Message } from './../lib/validators/message'
import { useMutation } from '@tanstack/react-query'
import { CornerDownLeft, Loader2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import { FC, HTMLAttributes, useContext, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'
import React from 'react'
import { apiType } from './../app/dashboard/page'



interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [input, setInput] = useState<string>('')
  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    setIsMessageUpdating,
  } = useContext(MessagesContext)

  const { mutate: sendMessage, isLoading } = useMutation({
    mutationKey: ['sendMessage'],
    // include message to later use it in onMutate
    mutationFn: async (_message: Message) => {
      const response = await fetch(`/api/${apiType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      })

      // alert user if message did not send
      if (!response.ok) {
        // create new div for error
        var message = document.createElement('div');
        message.innerHTML = 'Message failed to send, please try again.'; // text
        message.classList.add('animate-bounce', 'bg-red-500', 'text-white', 'font-bold', 'rounded-t', 'px-4', 'py-2', 'rounded', 'text-center' ); // tailwinds
        document.body.appendChild(message); // adds the error text to the body
        setTimeout(function() {
          document.body.removeChild(message); 
        }, 3000); // timeout 3 seconds
      }

      return response.body
    },
    onMutate(message) {
      addMessage(message)
    },
    onSuccess: async (stream) => {
      if (!stream) throw new Error('No stream')

      // construct new message to add
      const id = nanoid()
      const responseMessage: Message = {
        id,
        isUserMessage: false,
        text: '',
      }

      // add new message to state
      addMessage(responseMessage)

      setIsMessageUpdating(true)

      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        updateMessage(id, (prev) => prev + chunkValue)
      }

      // clean up
      setIsMessageUpdating(false)
      setInput('')

      setTimeout(() => {
        textareaRef.current?.focus()
      }, 10)
    },

    // Error handling
    onError: (_, message) => {
      toast.error('Something went wrong. Please try again.')
      removeMessage(message.id) // optomistic update
      textareaRef.current?.focus()
    },
  })


  return (
    <div {...props} className={cn('border-t border-zinc-300', className)}>
      <div className='relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none'>
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()

              const message: Message = {
                id: nanoid(),
                isUserMessage: true,
                text: input,
              }

              sendMessage(message)
            }
          }}
          rows={2}
          maxRows={4}
          value={input}
          autoFocus
          disabled={isLoading} // disable input when loading indicator is shown
          onChange={(e) => setInput(e.target.value)}
          placeholder='Write a message...'
          className='peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6'
        />
        {/* Loading indicator */}
        <div className='absolute inset-y-0 right-0 flex py-1.5 pr-1.5'>
          {/* kbd class -  This element creates a text input box that can receive keyboard input from the user. */}
          <kbd className='inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-xs text-gray-400'>
            {isLoading ? (
              <Loader2 className='w-3 h-3 animate-spin' />
            ) : (
              <CornerDownLeft className='w-3 h-3' />
            )}
          </kbd>
        </div>

         {/* Input highlight when focused - For visual styling */}
        <div
          className='absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600'
          aria-hidden='true'
        />
      </div>
    </div>
  )
}

export default ChatInput