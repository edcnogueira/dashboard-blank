'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Icons } from '@/utils/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'

import { useToast } from "@/components/ui/use-toast"
import { signIn } from 'next-auth/react'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z.string().min(1, { message: 'Email required' }).email(),
})

type TFormSchema = z.infer<typeof formSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const {toast} = useToast()

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: TFormSchema) {
    setIsLoading(true)
    try{
      await signIn('email', {email: data.email, redirect: false})
      toast({
        title: "Magic Link Sent",
        description: "Check your email for the magic link to login",
      })
    }catch{
      toast({
        variant: "destructive",
        title: "Magic Link Error",
        description: "There was a problem with your request.",
      })
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <div className={cn('grid gap-6', className)} {...props}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </form>
      </div>
    </Form>
  )
}
