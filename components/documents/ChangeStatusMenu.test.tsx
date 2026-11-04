import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChangeStatusMenu } from "@/components/documents/ChangeStatusMenu";

describe("ChangeStatusMenu", () => {
  it("opens and selects a status without throwing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ChangeStatusMenu
        status="failed"
        onChange={onChange}
        trigger={
          <button type="button" aria-label="More actions">
            Open
          </button>
        }
      />,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    await user.click(await screen.findByText("Pending"));

    expect(onChange).toHaveBeenCalledWith("pending");
  });
});
