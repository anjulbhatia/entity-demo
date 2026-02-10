import Link from "next/link"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Item } from "./ui/item"

const Login_Component = () => {
  return (
    <Card className="relative w-full max-w-sm overflow-hidden pt-0">
        <div className="relative p-3">
            <h1 className="text-xl text-center w-full">
                Welcome back
            </h1>

            <Button className="w-full p-3 mt-3 bg-accent-foreground text-stone-900 dark:bg-accent-foreground">
                <Link href={"/projects"}> Guest Login </Link>
            </Button>

        </div>
    </Card>
  )
}

export default Login_Component
