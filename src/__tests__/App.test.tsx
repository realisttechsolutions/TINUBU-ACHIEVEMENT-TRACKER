import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Providers } from "@/app/providers";
import Index from "@/views/Index";

describe("App Foundation", () => {
    it("renders root providers and index view without crashing", () => {
        render(
            <Providers>
                <Index />
            </Providers>
        );
        expect(document.body).toBeInTheDocument();
    });
});