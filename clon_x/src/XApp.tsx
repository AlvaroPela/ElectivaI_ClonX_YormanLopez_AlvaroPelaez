import { BaseRouter } from "./routes/BaseRouter"
import { NavBar } from "./ui/components/NavBar"

export const XApp = () => {
    return (
        <div>
            <NavBar />
            <BaseRouter />
        </div>
    )
}
