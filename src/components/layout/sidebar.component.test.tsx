import { fireEvent, render, screen } from "@testing-library/react";
import { SidebarContainer } from ".";

describe("Sidebar Component Test Suite", () => {
  describe("what happens during mouse events for the list items", () => {
    it("should change the background color for the list item", () => {
      render(<SidebarContainer />);

      const items = screen.queryAllByRole("listitem");
      expect(items.length).toBeGreaterThan(0);

      const item = items[0];
      expect(item).toHaveClass("nav-item");

      expect(item).toHaveAttribute(
        "style",
        expect.stringContaining("background-color: lightgrey"),
      );

      fireEvent.mouseEnter(item);

      expect(item).toHaveAttribute(
        "style",
        expect.stringContaining("background-color: darkgrey"),
      );

      fireEvent.mouseLeave(item);

      expect(item).toHaveAttribute(
        "style",
        expect.stringContaining("background-color: lightgrey"),
      );
    });
  });
});
