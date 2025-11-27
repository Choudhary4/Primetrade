import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
    IconHome,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function AppSidebar({ children }) {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();

    if (!user) {
        return <>{children}</>;
    }

    const links = [
        {
            label: "Home",
            href: "/",
            icon: (
                <IconHome className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Profile",
            href: "/profile",
            icon: (
                <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        // {
        //   label: "Settings",
        //   href: "#",
        //   icon: (
        //     <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
        //   ),
        // },
    ];

    return (
        <div
            className={cn(
                "flex flex-col md:flex-row bg-transparent w-full flex-1 mx-auto overflow-hidden",
                "h-screen"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                            {user && (
                                <div onClick={logout} className="cursor-pointer">
                                    <SidebarLink
                                        link={{
                                            label: "Logout",
                                            href: "#",
                                            icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        {user && (
                            <SidebarLink
                                link={{
                                    label: user.name || "User",
                                    href: "/profile",
                                    icon: (
                                        <img
                                            src={user.profilePicture || "https://assets.aceternity.com/manu.png"}
                                            className="h-7 w-7 shrink-0 rounded-full"
                                            width={50}
                                            height={50}
                                            alt="Avatar"
                                        />
                                    ),
                                }}
                            />
                        )}
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex flex-1 overflow-y-auto overflow-x-hidden">
                <div className="p-2 md:p-10 flex flex-col gap-2 flex-1 w-full h-full bg-transparent">
                    {children}
                </div>
            </div>
        </div>
    );
}

export const Logo = () => {
    return (
        <a
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                MyApp
            </motion.span>
        </a>
    );
};

export const LogoIcon = () => {
    return (
        <a
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </a>
    );
};
