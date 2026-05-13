import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-reset-password.ftl" });

const meta = {
    title: "login/login-reset-password.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithUsernameError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    existsError: (fieldName: string) => fieldName === "username",
                    get: (fieldName: string) => (fieldName === "username" ? "Invalid email address." : "")
                }
            }}
        />
    )
};

export const WithPresetUsername: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                auth: { attemptedUsername: "max.mustermann@mail.com" }
            }}
        />
    )
};

export const EmailSent: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    type: "success",
                    summary: "You should receive an email shortly with further instructions."
                }
            }}
        />
    )
};

export const WithTestEnvironment: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm: { name: "hefame-tst", displayName: "Hefame TST" }
            }}
        />
    )
};
