'use client'

import { User } from '@/lib/models/UserModel'
import { formatId } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

export default function Users() {
    const { data: users, error } = useSWR(`/api/admin/users`)
    const router = useRouter()

    const { trigger: deleteUser } = useSWRMutation(
        `/api/admin/users`,
        async (url, { arg }: { arg: { userId: string } }) => {
            const toastId = toast.loading('삭제중입니다..')
            const res = await fetch(`${url}/${arg.userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await res.json()
            res.ok
                ? toast.success('고객정보를 삭제하였습니다.', {
                      id: toastId,
                  })
                : toast.error(data.message, {
                      id: toastId,
                  })
        }
    )
    if (error) return 'An error has occurred.'
    if (!users) return 'Loading...'

    return (
        <div>
            <h1 className="py-4 text-2xl">고객관리</h1>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>고객ID</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>관리자</th>
                            <th>정보</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: User) => (
                            <tr key={user._id}>
                                <td>{formatId(user._id)}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'YES' : 'NO'}</td>

                                <td>
                                    <Link
                                        href={`/admin/users/${user._id}`}
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                    >
                                        수정
                                    </Link>
                                    &nbsp;
                                    <button
                                        onClick={() =>
                                            deleteUser({ userId: user._id })
                                        }
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
