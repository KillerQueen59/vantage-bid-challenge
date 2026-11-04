import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DocumentsDashboard } from "@/components/documents/DocumentsDashboard";

// Stateful next/navigation mock: router.replace writes query params that
// useSearchParams reads, so the URL-driven filtering actually re-renders.
vi.mock("next/navigation", async () => {
  const React = await import("react");
  let current = new URLSearchParams();
  const subscribers = new Set<() => void>();
  return {
    __setParams: (params: URLSearchParams) => {
      current = params;
      subscribers.forEach((fn) => fn());
    },
    useSearchParams: () =>
      React.useSyncExternalStore(
        (cb) => {
          subscribers.add(cb);
          return () => subscribers.delete(cb);
        },
        () => current,
        () => current,
      ),
    usePathname: () => "/",
    useRouter: () => ({
      replace: (url: string) => {
        const qs = url.includes("?") ? url.split("?")[1] : "";
        current = new URLSearchParams(qs);
        subscribers.forEach((fn) => fn());
      },
      push: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }),
  };
});

function renderDashboard() {
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <DocumentsDashboard />
    </SWRConfig>,
  );
}

describe("DocumentsDashboard filtering", () => {
  beforeEach(async () => {
    const nav = (await import("next/navigation")) as unknown as {
      __setParams: (p: URLSearchParams) => void;
    };
    nav.__setParams(new URLSearchParams());
  });

  it("narrows the table when searching and filtering by status", async () => {
    const user = userEvent.setup();
    renderDashboard();

    // Wait for the data to load and the desktop table to render.
    const table = await screen.findByRole("table", {}, { timeout: 3000 });
    await waitFor(
      () =>
        expect(
          within(table).getByText("RKS Pembangunan Gedung B.docx"),
        ).toBeInTheDocument(),
      { timeout: 3000 },
    );

    // Search by name (debounced).
    await user.type(screen.getByLabelText("Search by document name"), "BoQ");
    await waitFor(
      () =>
        expect(
          within(table).queryByText("RKS Pembangunan Gedung B.docx"),
        ).not.toBeInTheDocument(),
      { timeout: 3000 },
    );
    expect(
      within(table).getByText("BoQ Jalan Tol Seksi 3.xlsx"),
    ).toBeInTheDocument();

    // Add the Failed status filter: only the failed BoQ document remains.
    await user.click(screen.getByRole("button", { name: /^Failed/ }));
    await waitFor(
      () =>
        expect(
          within(table).queryByText("BoQ Gedung B – Pekerjaan MEP.xlsx"),
        ).not.toBeInTheDocument(),
      { timeout: 3000 },
    );
    expect(
      within(table).getByText("BoQ Jalan Tol Seksi 3.xlsx"),
    ).toBeInTheDocument();
  });
});
