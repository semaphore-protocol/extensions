"use client"

import { FaSearch } from "react-icons/fa"

export default function SearchBar({ placeholder, onChange, className }: any) {
    return (
        <div className={`relative mt-2 rounded-md shadow-sm ${className}`}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-gray-600" />
            </div>
            <input
                onChange={(event) => onChange(event.target.value)}
                name="search-bar"
                type="text"
                placeholder={placeholder}
                className="block w-full rounded-md border-0 py-1.5 pl-9 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none text-sm sm:leading-6"
            />
        </div>
    )
}
