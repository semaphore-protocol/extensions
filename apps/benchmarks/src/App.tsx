import { Box, Button, Flex, List, ListIcon, ListItem, Text } from "@chakra-ui/react"
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, verifyProof } from "@semaphore-protocol/proof"
import { useCallback, useState } from "react"
import { MdCheckCircle } from "react-icons/md"
import GroupMembers from "./components/GroupMembers"
import Navbar from "./components/Navbar"
import TreeDepth from "./components/TreeDepth"

const functions = ["new Identity", "new Group", "generateProof", "verifyProof", "addMember", "updateMember"]

function App() {
    const [treeDepth, setTreeDepth] = useState<number>(20)
    const [groupMembers, setGroupMembers] = useState<number>(100)
    const [times, setTimes] = useState<number[]>([])

    const runFunctions = useCallback(
        async function () {
            const times = []

            const [identity, time0] = await run(() => {
                return new Identity()
            })

            times.push(time0)

            setTimes(times)

            let members = Array.from(Array(groupMembers - 1).keys())
            members = [...members, identity.commitment]

            const [group, time1] = await run(() => {
                return new Group(1, treeDepth, members)
            })

            times.push(time1)

            setTimes(times.slice())

            const [proof, time2] = await run(async () => {
                return await generateProof(identity, group, 1, 1)
            })

            times.push(time2)

            setTimes(times.slice())

            const [, time3] = await run(async () => {
                return await verifyProof(proof, treeDepth)
            })

            times.push(time3)

            setTimes(times.slice())

            const [, time4] = await run(() => {
                group.addMember(1)
            })

            times.push(time4)

            setTimes(times.slice())

            const [, time5] = await run(() => {
                group.updateMember(0, 1)
            })

            times.push(time5)

            setTimes(times.slice())
        },
        [treeDepth, groupMembers]
    )

    async function run(callback: () => any): Promise<[any, number]> {
        const t0 = performance.now()

        const result = await callback()

        const t1 = performance.now()

        return [result, t1 - t0]
    }

    return (
        <Flex flexDir="column" flex="1">
            <Navbar />
            <Flex flex="1" align="center" justify="center">
                <Flex flexDir="column" gap={4} width="400px">
                    <TreeDepth value={treeDepth} onChange={setTreeDepth} />
                    <GroupMembers value={groupMembers} onChange={setGroupMembers} max={2 ** treeDepth} />

                    <Button onClick={() => runFunctions()} size="sm" my="3">
                        Run functions
                    </Button>

                    <List spacing={3}>
                        {functions.map((f, i) => (
                            <ListItem key={i}>
                                <Flex justify={"space-between"}>
                                    <Box>
                                        {times[i] && <ListIcon as={MdCheckCircle} color="green.500" />}
                                        <b>{f}</b>
                                    </Box>
                                    <Text>{times[i] ? times[i] : 0} ms</Text>
                                </Flex>
                            </ListItem>
                        ))}
                    </List>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default App
