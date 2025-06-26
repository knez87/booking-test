import { test, expect } from "@playwright/test"

test.describe("Booking Journey E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should display search page with form elements", async ({ page }) => {
    // Check page title and main heading
    await expect(page).toHaveTitle(/v0 App/)
    await expect(page.getByRole("heading", { name: "Find Your Perfect Meeting Venue" })).toBeVisible()

    // Check search form elements
    await expect(page.getByLabel("Location (Latitude)")).toBeVisible()
    await expect(page.getByLabel("Location (Longitude)")).toBeVisible()
    await expect(page.getByLabel("Delegates")).toBeVisible()
    await expect(page.getByLabel("Date")).toBeVisible()
    await expect(page.getByLabel("Start Time")).toBeVisible()
    await expect(page.getByLabel("Duration (hours)")).toBeVisible()
    await expect(page.getByLabel("Radius (meters)")).toBeVisible()
    await expect(page.getByRole("button", { name: "Search Venues" })).toBeVisible()
  })

  test("should fill search form with valid data", async ({ page }) => {
    // Fill search form
    await page.getByLabel("Location (Latitude)").fill("60.1699")
    await page.getByLabel("Location (Longitude)").fill("24.9384")
    await page.getByLabel("Delegates").fill("15")

    // Set date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateString = tomorrow.toISOString().split("T")[0]
    await page.getByLabel("Date").fill(dateString)

    await page.getByLabel("Start Time").fill("09:00")
    await page.getByLabel("Duration (hours)").fill("8")
    await page.getByLabel("Radius (meters)").selectOption("5000")

    // Verify form values
    await expect(page.getByLabel("Location (Latitude)")).toHaveValue("60.1699")
    await expect(page.getByLabel("Location (Longitude)")).toHaveValue("24.9384")
    await expect(page.getByLabel("Delegates")).toHaveValue("15")
    await expect(page.getByLabel("Date")).toHaveValue(dateString)
    await expect(page.getByLabel("Start Time")).toHaveValue("09:00")
    await expect(page.getByLabel("Duration (hours)")).toHaveValue("8")
  })

  test("should handle search form submission", async ({ page }) => {
    // Mock API response
    await page.route("**/api/availability/venues*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              id: 1,
              name: "Test Venue",
              address: {
                city: "Helsinki",
                country: "Finland",
              },
              summary: "A great test venue",
              max_delegates: 50,
              starting_price_cents: 15000,
              images: [{ url: "/placeholder.svg" }],
            },
          ],
          results: 1,
          total_results: 1,
        }),
      })
    })

    // Fill and submit form
    await page.getByLabel("Location (Latitude)").fill("60.1699")
    await page.getByLabel("Location (Longitude)").fill("24.9384")
    await page.getByLabel("Delegates").fill("15")

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    await page.getByLabel("Date").fill(tomorrow.toISOString().split("T")[0])

    await page.getByRole("button", { name: "Search Venues" }).click()

    // Wait for results
    await expect(page.getByText("Test Venue")).toBeVisible()
    await expect(page.getByText("Helsinki, Finland")).toBeVisible()
    await expect(page.getByText("From €150")).toBeVisible()
  })

  test("should navigate to venue details on venue click", async ({ page }) => {
    // Mock search results
    await page.route("**/api/availability/venues*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              id: 1,
              name: "Helsinki Business Center",
              address: {
                city: "Helsinki",
                country: "Finland",
              },
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

    // Mock venue details
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
          summary: "Modern business center in the heart of Helsinki",
          max_delegates: 200,
          images: [{ url: "/placeholder.svg" }],
        }),
      })
    })

    // Perform search
    await page.getByLabel("Location (Latitude)").fill("60.1699")
    await page.getByLabel("Location (Longitude)").fill("24.9384")
    await page.getByRole("button", { name: "Search Venues" }).click()

    // Click on venue
    await page.getByText("Helsinki Business Center").click()

    // Verify navigation to venue details
    await expect(page).toHaveURL(/\/venue\/1/)
  })

  test("should handle API errors gracefully", async ({ page }) => {
    // Mock API error
    await page.route("**/api/availability/venues*", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      })
    })

    // Fill and submit form
    await page.getByLabel("Location (Latitude)").fill("60.1699")
    await page.getByLabel("Location (Longitude)").fill("24.9384")
    await page.getByRole("button", { name: "Search Venues" }).click()

    // Check error message
    await expect(page.getByText("Error loading venues. Please try again.")).toBeVisible()
  })

  test("should display no results message when no venues found", async ({ page }) => {
    // Mock empty results
    await page.route("**/api/availability/venues*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [],
          results: 0,
          total_results: 0,
        }),
      })
    })

    // Perform search
    await page.getByLabel("Location (Latitude)").fill("60.1699")
    await page.getByLabel("Location (Longitude)").fill("24.9384")
    await page.getByRole("button", { name: "Search Venues" }).click()

    // Check no results message
    await expect(page.getByText("No venues found matching your criteria")).toBeVisible()
  })

  test("should be responsive on mobile devices", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check mobile layout
    await expect(page.getByRole("heading", { name: "Find Your Perfect Meeting Venue" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Search Venues" })).toBeVisible()

    // Form should stack vertically on mobile
    const searchForm = page.locator(".grid")
    await expect(searchForm).toHaveClass(/grid-cols-1/)
  })
})
