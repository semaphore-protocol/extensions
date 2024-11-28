"use client"

import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { SupportedNetwork, supportedNetworks } from "@semaphore-protocol/utils"
import { usePathname } from "next/navigation"
import { FaEthereum } from "react-icons/fa"

export default function Navbar() {
    const pathname = usePathname()
    const network = (pathname.split("/")[1] || "sepolia") as SupportedNetwork

    return (
        <Disclosure as="nav" className="bg-gray-900 fixed inset-x-0 top-0 left-0 z-10">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <a href="/">
                        <img
                            alt="Your Company"
                            src="https://raw.githubusercontent.com/semaphore-protocol/.github/refs/heads/main/assets/semaphore-icon-light.svg"
                            className="h-8 w-auto"
                        />
                    </a>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="relative flex rounded-full text-sm focus:outline-none">
                                    <FaEthereum className="text-gray-200" size={22} />
                                    <span className="text-gray-200 ml-1 font-bold">
                                        {" "}
                                        {supportedNetworks[network]?.name}{" "}
                                    </span>
                                </MenuButton>
                            </div>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-100 py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                            >
                                {Object.entries(supportedNetworks).map(([k, v]) => (
                                    <MenuItem key={k}>
                                        <a
                                            href={`/${k}`}
                                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                        >
                                            {v.name}
                                        </a>
                                    </MenuItem>
                                ))}
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>
        </Disclosure>
    )
}
