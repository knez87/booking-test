import { test, expect } from "@playwright/test"

test.describe("Complete Booking Flow", () => {
  test("should complete full booking journey", async ({ page }) => {
    // Mock all necessary APIs
    await page.route("**/api/availability/venues*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              id: 1,
              name: "Helsinki Business Center",
              address: { city: "Helsinki", country: "Finland" },
              summary: "Modern business center",
              max_delegates: 200,
              starting_price_cents: 15000,
              images: [{ url: "/placeholder.svg" }],
            },
          ],
          results: 1,
          total_results: 1,
        }),
      })
    })

    await page.route("**/api/venues/1*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Helsinki Business Center",
          address: {
            street: "Mannerheimintie 12",
            city: "Helsinki",
            country: "Finland",
          },
          summary: "Modern business center",
          max_delegates: 200,
          images: [{ url: "/placeholder.svg" }],
        }),
      })
    })

    await page.route("**/api/customers*", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: "1",
          email: "test@example.com",
          first_name: "John",
          last_name: "Doe",
        }),
      })
    })

    await page.route("**/api/orders*", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: "1",
          booking_reference: "BK2024001",
        }),
      })
    })

    // Start booking journey
    await page.goto("/")

    // Step 1: Search for venues
    await page.getByLabel("Location (Latitude)").fill("60.1699")
    await page.getByLabel("Location (Longitude)").fill("24.9384")
    await page.getByLabel("Delegates").fill("15")

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    await page.getByLabel("Date").fill(tomorrow.toISOString().split("T")[0])

    await page.getByRole("button", { name: "Search Venues" }).click()

    // Step 2: Select venue
    await expect(page.getByText("Helsinki Business Center")).toBeVisible()
    await page.getByText("Helsinki Business Center").click()

    // Step 3: Verify venue details page
    await expect(page).toHaveURL(/\/venue\/1/)
    await expect(page.getByRole("heading", { name: "Helsinki Business Center" })).toBeVisible()

    // This would continue with room selection, customer details, etc.
    // For now, we verify the basic navigation works
  })
})
