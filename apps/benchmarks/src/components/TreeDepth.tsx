import {
    Flex,
    NumberInput,
    NumberInputField,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Text,
    Tooltip
} from "@chakra-ui/react"
import { useState } from "react"

export type TreeDepthParameters = {
    onChange: (value: number) => void
    value: number
}

export default function TreeDepth({ onChange, value = 20 }: TreeDepthParameters) {
    const [showTooltip, setShowTooltip] = useState(false)

    return (
        <Flex gap="3" align="center">
            <Text fontWeight="bold" whiteSpace="nowrap">
                Tree depth:
            </Text>

            <NumberInput size={"sm"} maxW="42px" min={16} max={32} value={value} onChange={(_v, v) => onChange(v)}>
                <NumberInputField px={3} />
            </NumberInput>

            <Slider
                aria-label="tree-depth-slider"
                min={16}
                max={32}
                value={value}
                onChange={onChange}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
                <Tooltip hasArrow placement="top" isOpen={showTooltip} label={value}>
                    <SliderThumb />
                </Tooltip>
            </Slider>
        </Flex>
    )
}
