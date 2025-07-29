"use server";

type ChatMessage = {
    role: string;
    content: string;
    timestamp?: string;
};

type ChatData = {
    messages: ChatMessage[];
    userMessages: string[];
};

export async function parseChatGPTData(file: File): Promise<ChatData> {
    const text = await file.text();
    let data: any;

    try {

        data = JSON.parse(text);

        if (data.mapping) {

            return parseNewChatGPTFormat(data);
        } else if (Array.isArray(data)) {

            return parseArrayFormat(data);
        } else if (data.messages && Array.isArray(data.messages)) {
           
            return {
                messages: data.messages,
                userMessages: data.messages.filter((msg: ChatMessage) => msg.role === "user").map((msg: ChatMessage) => msg.content),
            };
        }
    } catch (e) {

        return parseTextFormat(text);
    }

    return {messages: [], userMessages: []};
}

function parseNewChatGPTFormat(data: any): ChatData {
    const messages: ChatMessage[] = [];
    const nodes = data.mapping || {};

    // Convert the mapping object to an array of messages
    Object.keys(nodes).forEach(key => {
        const node = nodes[key];
        if (node.message && node.message.content && node.message.content.parts) {
            messages.push({
                role: node.message.author.role,
                content: node.message.content.parts.join("\n"),
                timestamp: node.message.create_time,
            });
        }
    });


    messages.sort((a, b) => {
        if (a.timestamp && b.timestamp) {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        return 0;
    });

    return {
        messages,
        userMessages: messages.filter(msg => msg.role === "user").map(msg => msg.content),
    };
}

function parseArrayFormat(data: any[]): ChatData {
    const messages = data.map(item => ({
        role: item.role || "unknown",
        content: item.content || "",
        timestamp: item.timestamp,
    }));

    return {
        messages,
        userMessages: messages.filter(msg => msg.role === "user").map(msg => msg.content),
    };
}

function parseTextFormat(text: string): ChatData {
    // This is a basic implementation and might need refinement
    const lines = text.split("\n");
    const messages: ChatMessage[] = [];
    let currentRole = "user";
    let currentContent: string[] = [];

    lines.forEach(line => {
        if (line.startsWith("User:") || line.startsWith("You:")) {

            if (currentContent.length > 0) {
                messages.push({
                    role: currentRole,
                    content: currentContent.join("\n").trim(),
                });
                currentContent = [];
            }
            currentRole = "user";
            currentContent.push(line.replace(/^(User:|You:)\s*/, ""));
        } else if (line.startsWith("ChatGPT:") || line.startsWith("Assistant:")) {
       
            if (currentContent.length > 0) {
                messages.push({
                    role: currentRole,
                    content: currentContent.join("\n").trim(),
                });
                currentContent = [];
            }
            currentRole = "assistant";
            currentContent.push(line.replace(/^(ChatGPT:|Assistant:)\s*/, ""));
        } else {
         
            currentContent.push(line);
        }
    });


    if (currentContent.length > 0) {
        messages.push({
            role: currentRole,
            content: currentContent.join("\n").trim(),
        });
    }

    return {
        messages,
        userMessages: messages.filter(msg => msg.role === "user").map(msg => msg.content),
    };
}
