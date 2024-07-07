"use client"
import React, { FormEvent, useEffect, useState } from "react";
import {useSignalR} from "@/hooks/useSignalR";
import {Box, Button, FormControl, Heading, Input, List, ListItem, Text} from "@chakra-ui/react";

type Message = {
    senderId: string;
    content: string;
    sentTime: string;
};

const Chat: React.FC = () => {

    return (
        <div></div>
    );
};

export default Chat;