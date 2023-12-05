'use client'

import { Icons } from '@/components/Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  TAuthCredentialsValidator,
  AuthCredentialsValidator,
} from '@/lib/validators/account-credentials-validator'
import { trpc } from '@/trpc/client'
import { toast } from 'sonner'
import { ZodError } from 'zod'
import { useRouter } from 'next/navigation'

const Page = () => {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  })

  const router = useRouter()

  const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
    onError: (err) => {
      if (err.data?.code === 'CONFLICT') {
        toast.error('This email is already registered. Sign in instead?')
      }

      if (err instanceof ZodError) {
        toast.error(err.issues[0].message)
      }

      toast.error('Something went wrong. Please try again.')
    },
    onSuccess: () => {
      toast.success('Successfully signed up!')
      router.push('/sign-in')
    },
  })

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    // send data to the server
    mutate({ email, password })
  }

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex  w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2xl font-bold">Create an account</h1>

            <Link
              href={'/sign-in'}
              className={buttonVariants({
                variant: 'link',
                className: 'text-muted-foreground gap-1.5',
              })}
            >
              Already have an account? Sign-in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email" className="mb-1">
                    Email
                  </Label>
                  <Input
                    {...register('email')}
                    className={cn({
                      'focus-visible:ring-red-500': errors.email,
                    })}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="password" className="mb-1">
                    Password
                  </Label>
                  <Input
                    type="password"
                    {...register('password')}
                    className={cn({
                      'focus-visible:ring-red-500': errors.password,
                    })}
                    placeholder="Password"
                  />
                </div>
                <Button>Sign Up</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
