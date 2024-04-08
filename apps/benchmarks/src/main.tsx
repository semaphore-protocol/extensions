import { ChakraProvider, extendTheme, SystemStyleObject } from "@chakra-ui/react"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

const theme = extendTheme({
    styles: {
        global: (): SystemStyleObject => ({
            "body, #root": {
                minHeight: "100vh"
            },
            "#root": {
                display: "flex",
                flexDirection: "column"
            }
        })
    },
    colors: {
        primary: {
            50: "#ebedff",
            100: "#c7cdee",
            200: "#a3acdd",
            300: "#7f8bcd",
            400: "#5b6abd",
            500: "#4250a4",
            600: "#323f80",
            700: "#242d5d",
            800: "#141b3b",
            900: "#04091a"
        }
    }
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </StrictMode>
)
