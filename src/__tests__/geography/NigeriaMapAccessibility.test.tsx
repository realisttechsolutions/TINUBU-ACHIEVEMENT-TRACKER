import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NigeriaMapSvg from "@/components/geography/NigeriaMapSvg";
import { nigeriaStatePaths } from "@/data/geography/nigeria-states.geojson";
import { resolveStateMapping } from "@/lib/geography/nigeria-state-mapping";

describe("NigeriaMap Accessibility & Geography Structure", () => {
  it("contains exactly 37 canonical geographic units (36 States + FCT)", () => {
    expect(nigeriaStatePaths.length).toBe(37);

    // Verify uniqueness of state codes
    const codes = nigeriaStatePaths.map((s) => s.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(37);

    // Verify FCT is present
    expect(codes).toContain("NG-FC");

    // Verify Lagos and Kaduna are present
    expect(codes).toContain("NG-LA");
    expect(codes).toContain("NG-KD");
  });

  it("renders exactly 37 accessible keyboard focus stops in SVG", () => {
    const handleSelect = vi.fn();
    render(<NigeriaMapSvg onStateSelect={handleSelect} />);

    // Query all state buttons
    const stateButtons = screen.getAllByRole("button");
    expect(stateButtons.length).toBe(37);

    // Verify each button has tabIndex 0 and valid aria-label
    stateButtons.forEach((btn) => {
      expect(btn.getAttribute("tabindex") || btn.getAttribute("tabIndex")).toBe("0");
      expect(btn.getAttribute("aria-label")).toBeTruthy();
    });
  });

  it("triggers onStateSelect on click, Enter, and Space keys", () => {
    const handleSelect = vi.fn();
    render(<NigeriaMapSvg onStateSelect={handleSelect} />);

    const lagosBtn = screen.getByLabelText(/Lagos State/i);
    expect(lagosBtn).toBeDefined();

    // Click
    fireEvent.click(lagosBtn);
    expect(handleSelect).toHaveBeenCalledWith("NG-LA");

    // Enter key
    fireEvent.keyDown(lagosBtn, { key: "Enter" });
    expect(handleSelect).toHaveBeenCalledWith("NG-LA");

    // Space key
    fireEvent.keyDown(lagosBtn, { key: " " });
    expect(handleSelect).toHaveBeenCalledWith("NG-LA");
  });

  it("correctly resolves deep link state slugs to canonical ISO codes", () => {
    expect(resolveStateMapping("lagos")?.code).toBe("NG-LA");
    expect(resolveStateMapping("kaduna")?.code).toBe("NG-KD");
    expect(resolveStateMapping("fct-abuja")?.code).toBe("NG-FC");
    expect(resolveStateMapping("kano")?.code).toBe("NG-KN");
    expect(resolveStateMapping("rivers")?.code).toBe("NG-RI");
  });
});
