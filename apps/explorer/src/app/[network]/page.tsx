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

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const subgraph = new SemaphoreSubgraph(network)

            const groups = await subgraph.getGroups({
                members: true,
                validatedProofs: true
            })

            const sortedGroups = groups.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10))

            setAllGroups(sortedGroups)
            setFilteredGroups(sortedGroups.slice())
            setLoading(false)
        }

        fetchData()
    }, [])

    const filterGroups = useCallback(
        (groupIdOrAdmin: string) => {
            let groups: GroupResponse[]
            if (groupIdOrAdmin.startsWith("0x")) {
                groupIdOrAdmin = groupIdOrAdmin.toLowerCase()
                groups = allGroups.filter((group) => (!groupIdOrAdmin ? true : group.admin?.includes(groupIdOrAdmin)))
            } else {
                groups = allGroups.filter((group) => (!groupIdOrAdmin ? true : group.id.includes(groupIdOrAdmin)))
            }

            setFilteredGroups(groups)
        },
        [allGroups]
    )

    return loading ? (
        <div className="flex justify-center items-center h-screen">
            <div className="loader" />
        </div>
    ) : (
        allGroups && (
            <div className="mx-auto max-w-7xl px-4 lg:px-8 pt-20">
                <SearchBar className="mb-6" placeholder="Group ID, Admin" onChange={filterGroups} />

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
