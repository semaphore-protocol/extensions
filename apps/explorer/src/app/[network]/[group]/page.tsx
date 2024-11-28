"use client"

import { GroupResponse, SemaphoreSubgraph } from "@semaphore-protocol/data"
import { SupportedNetwork } from "@semaphore-protocol/utils"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import SearchBar from "@/components/SearchBar"

export default function Group() {
    const pathname = usePathname()
    const network = pathname.split("/")[1] as SupportedNetwork
    const groupId = pathname.split("/")[2] as SupportedNetwork

    const [group, setGroup] = useState<GroupResponse>()
    const [filteredCommitments, setFilteredCommitments] = useState<string[]>([])
    const [filteredProofs, setFilteredProofs] = useState<any[]>([])

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const subgraph = new SemaphoreSubgraph(network)

            const groupInfo = await subgraph.getGroup(groupId, {
                members: true,
                validatedProofs: true
            })

            setGroup(groupInfo)

            setFilteredCommitments(groupInfo.members || [])
            setFilteredProofs(groupInfo.validatedProofs || [])
            setLoading(false)
        }

        fetchData()
    }, [])

    const filterCommitments = useCallback(
        (identityCommitment: string) => {
            if (group && group.members) {
                const identityCommitments = group.members.filter((member) =>
                    !identityCommitment ? true : member.includes(identityCommitment)
                )

                setFilteredCommitments(identityCommitments)
            }
        },
        [group]
    )

    const filterProofs = useCallback(
        (proofMessage: string) => {
            if (group && group.validatedProofs) {
                const proofs = group.validatedProofs.filter((proof) =>
                    !proofMessage ? true : proof.message.includes(proofMessage)
                )

                setFilteredProofs(proofs)
            }
        },
        [group]
    )

    return loading ? (
        <div className="flex justify-center items-center h-screen">
            <div className="loader" />
        </div>
    ) : (
        group && (
            <div className="mx-auto max-w-7xl px-4 lg:px-8 pt-20">
                <div className="flex justify-center flex-col pb-10 font-[family-name:var(--font-geist-sans)]">
                    <div className="flex justify-between gap-x-6 py-5">
                        <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-800">ID: {group.id}</p>
                            <p className="mt-1 truncate text-sm leading-6 text-gray-600">Admin: {group.admin}</p>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-600">{group.members?.length} members</p>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                {group.validatedProofs?.length} proofs
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 flex-col md:flex-row">
                        <div className="min-w-0 flex-auto">
                            <SearchBar
                                className="mb-6"
                                placeholder="Identity commitment"
                                onChange={filterCommitments}
                            />

                            <ul className="divide-y divide-gray-300">
                                {filteredCommitments.map((commitment) => (
                                    <li className="flex justify-between gap-x-6 py-2 px-5" key={commitment}>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{commitment}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="min-w-0 flex-auto">
                            <SearchBar className="mb-6" placeholder="Proof message" onChange={filterProofs} />

                            <ul className="divide-y divide-gray-300">
                                {filteredProofs.map((proof) => (
                                    <li className="flex justify-between gap-x-6 py-2 px-5" key={proof.nullifier}>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{proof.message}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}
