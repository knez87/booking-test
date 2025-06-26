import { test, expect } from "@playwright/test"

test.describe("Venue Details Page", () => {
  test.beforeEach(async ({ page }) => {
    // Mock venue details API
    await page.route("**/api/venues/1*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Helsinki Business Center",
          address: {
            street: "Mannerheimintie 12",
            postal_code: "00100",
            city: "Helsinki",
            country: "Finland",
          },
          summary: "Modern business center in the heart of Helsinki",
          max_delegates: 200,
          starting_price_cents: 15000,
          images: [{ url: "/placeholder.svg?height=300&width=400" }],
          facilities: [{ id: 1, facility_description: "WiFi", localized_description: "Wireless Internet" }],
          rooms: [
            {
              id: 1,
              name: "Executive Boardroom",
              min_delegates: 8,
              max_delegates: 20,
              instant_bookable: true,
            },
          ],
        }),
      })
    })

    await page.goto("/venue/1")
  })

  test("should display venue information correctly", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Helsinki Business Center" })).toBeVisible()
    await expect(page.getByText("Mannerheimintie 12")).toBeVisible()
    await expect(page.getByText("Helsinki, Finland")).toBeVisible()
    await expect(page.getByText("Modern business center in the heart of Helsinki")).toBeVisible()
    await expect(page.getByText("Up to 200 delegates")).toBeVisible()
  })

  test("should display venue facilities", async ({ page }) => {
    await expect(page.getByText("WiFi")).toBeVisible()
  })

  test("should display available rooms", async ({ page }) => {
    await expect(page.getByText("Executive Boardroom")).toBeVisible()
    await expect(page.getByText("8-20 delegates")).toBeVisible()
  })
})
