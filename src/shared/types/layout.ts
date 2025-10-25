import type { ComponentType, RefObject } from 'react'

export type IconComponent = ComponentType<{ size?: number; className?: string }>

export type NavItemType = {
    name: string
    icon: IconComponent
    path: string
}

export type NavBarProps = {
    isAuthenticated?: boolean
}

export type ProfileMenuProps = {
    isOpen: boolean
    refProp?: RefObject<HTMLDivElement>
    onToggle: () => void
    onClose: () => void
    onLogout: () => void
    isActive?: boolean
}

export type NavItemProps = {
    name: string
    icon: IconComponent
    path: string
    active?: boolean
    onClick?: () => void
    size?: number
    compact?: boolean
}

export type LogoLinkProps = {
    className?: string
}