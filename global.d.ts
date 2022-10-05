export interface User {
    id: string
    email: string
    password: string
    username: string
    tag: number
    token: string
    guilds: string[]
}

export interface Member {
    id: string
    nickname: string
}

export interface Guild {
    id: string
    name: string
    owner: string
    members: string[]
    invites: string[]
    channels: string[]
}

export interface Channel {
    guild: string
    name: string
    description: string
    type: ChannelType
    id: string
}

export type ChannelType = "TEXT" | "VOICE"

export interface TextChannel extends Channel {
    slowmode: number
    messages: Message[]
}

export interface Message {
    id: string
    content: string
    sent: number
    author: string
}
