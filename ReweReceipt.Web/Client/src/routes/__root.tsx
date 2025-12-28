import {Link, Outlet, createRootRoute, useMatchRoute} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu.tsx";
import {cn} from "@/lib/utils.ts";

export const Route = createRootRoute({
    component: RootComponent,
})

const navItems = [
    { to: '/', label: 'Fetch' },
    { to: '/receipts/', label: 'Receipts', exact: false },
    { to: '/articles/', label: 'Articles', exact: false },
]

function RootComponent() {
    const matchRoute = useMatchRoute();
    
    return (
        <>
            <NavigationMenu className="p-2 flex gap-2 text-lg">
                <NavigationMenuList>
                    {navItems.map((item) => {
                        const isActive = matchRoute({ to: item.to, fuzzy: !item.exact })

                        return (
                            <NavigationMenuItem key={item.to}>
                                <Link
                                    to={item.to}
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        isActive && 'bg-accent text-accent-foreground font-medium',
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </NavigationMenuItem>
                        )
                    })}
                </NavigationMenuList>
            </NavigationMenu>
            <Outlet/>
            <TanStackRouterDevtools position="bottom-right"/>
        </>
    )
}