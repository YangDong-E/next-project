'use client'
import { cartStore } from '@/lib/hooks/useCartStore'
import useLayoutService from '@/lib/hooks/useLayout'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { SWRConfig } from 'swr'

export default function ClientProviders({
    children,
}: {
    children: React.ReactNode
}) {
    const updateStore = () => {
        cartStore.persist.rehydrate()
    }

    useEffect(() => {
        document.addEventListener('visibilitychange', updateStore)
        window.addEventListener('focus', updateStore)
        return () => {
            document.removeEventListener('visibilitychange', updateStore)
            window.removeEventListener('focus', updateStore)
        }
    }, [])

    // darkMode
    const { theme } = useLayoutService()
    const [selectedTheme, setSelectedTheme] = useState('system')
    useEffect(() => {
        setSelectedTheme(theme)
    }, [theme])

    return (
        <SWRConfig
            value={{
                onError: (error, key) => {
                    toast.error(error.message)
                },
                fetcher: async (resource, init) => {
                    const res = await fetch(resource, init)
                    if (!res.ok) {
                        throw new Error(
                            '데이터를 가져오는 동안 오류가 발생했습니다.'
                        )
                    }
                    return res.json()
                },
            }}
        >
            <Toaster toastOptions={{ className: 'toaster-con' }} />
            <div data-theme={selectedTheme}> {children}</div>
        </SWRConfig>
    )
}
