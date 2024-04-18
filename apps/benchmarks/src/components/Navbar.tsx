import { HStack, Icon, Image, IconButton, Link } from "@chakra-ui/react"
import { FaGithub } from "react-icons/fa"

export default function Navbar() {
    return (
        <HStack width="100%" justify="space-between" p="6">
            <Link href="https://semaphore.pse.dev/" isExternal>
                <Image src="semaphore-logo.svg" htmlWidth={150} />
            </Link>
            <Link href="https://github.com/semaphore-protocol/benchmarks" isExternal>
                <IconButton
                    variant="unstyled"
                    aria-label="Github repository"
                    icon={<Icon boxSize={6} as={FaGithub} />}
                />
            </Link>
        </HStack>
    )
}
