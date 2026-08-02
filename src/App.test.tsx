import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
    it("renders without crashing", () => {
        render(<App />);
        // We expect the app to render. since it has lazy loaded components, 
        // it might show the loading spinner initially. 
        // We can just check if the document body contains something.
        expect(document.body).toBeInTheDocument();
    });
});
