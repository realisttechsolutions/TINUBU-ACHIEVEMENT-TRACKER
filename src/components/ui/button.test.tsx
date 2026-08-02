import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";
import { vi } from "vitest";

describe("Button", () => {
    it("renders correctly with default props", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    it("handles click events", () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        fireEvent.click(screen.getByRole("button", { name: /click me/i }));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
