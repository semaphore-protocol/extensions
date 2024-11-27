"use client"

import { GroupResponse, SemaphoreSubgraph } from "@semaphore-protocol/data"
import { SupportedNetwork } from "@semaphore-protocol/utils"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import SearchBar from "@/components/SearchBar"

export default function Network() {
    const pathname = usePathname()
    const network = (pathname.split("/")[1] || "sepolia") as SupportedNetwork

    const [allGroups, setAllGroups] = useState<GroupResponse[]>([])
    const [filteredGroups, setFilteredGroups] = useState<GroupResponse[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const subgraph = new SemaphoreSubgraph(network)

            const groups = await subgraph.getGroups({
                members: true,
                validatedProofs: true
            })

            setAllGroups(groups)
            setFilteredGroups(groups.slice())
        }

        fetchData()
    }, [])

    const filterGroups = useCallback((groupId: string) => {
        const groups = allGroups.filter((group) => (!groupId ? true : group.id.includes(groupId)))

        setFilteredGroups(groups)
    }, [])

    return (
        allGroups && (
            <div className="mx-auto max-w-7xl px-4 lg:px-8 pt-20">
                <SearchBar className="mb-6" placeholder="Group ID" onChange={filterGroups} />

                <div className="flex justify-center flex-col pb-10 font-[family-name:var(--font-geist-sans)]">
                    <ul className="divide-y divide-gray-300 min-w-xl">
                        {filteredGroups.map((group) => (
                            <li key={group.id}>
                                <a
                                    href={`/${network}/${group.id}`}
                                    className="flex justify-between gap-x-6 p-5 hover:bg-gray-200"
                                >
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-800">ID: {group.id}</p>
                                        <p className="mt-1 truncate text-sm leading-6 text-gray-600">
                                            Admin: {group.admin}
                                        </p>
                                    </div>
                                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                        <p className="text-sm leading-6 text-gray-600">
                                            {group.members?.length} member
                                            {group.members?.length !== 1 ? "s" : ""}
                                        </p>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                            {group.validatedProofs?.length} proof
                                            {group.validatedProofs?.length !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    )
}
