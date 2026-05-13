import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-verify-email.ftl" });

const meta = {
    title: "login/login-verify-email.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithEmail: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                user: { email: "max.mustermann@hefame.es" }
            }}
        />
    )
};

export const WithTestEnvironment: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm: { name: "hefame-tst", displayName: "Hefame TST" },
                user: { email: "usuario@hefame.es" }
            }}
        />
    )
};
