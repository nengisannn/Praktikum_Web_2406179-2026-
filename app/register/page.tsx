"use client"

import { useActionState } from "react"
import { registerAction } from "@/actions/auth"
import link from "next/link"

const RegisterPage = () => {
    const [state, fromAction, isPending] = useActionState(registerAction, undefined)

    return(
        <main className="min-h-screen flex items-center justify-center bg-blue-300 p-4">
            <div className= "w-full max-w-md bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h1 className="text-s2xl font-bold text-slate-800" m
    )
}