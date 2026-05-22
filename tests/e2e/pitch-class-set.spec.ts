import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Mock window.__TAURI__ for browser-based testing
  await page.addInitScript(() => {
    (window as unknown as Record<string, unknown>).__TAURI__ = {
      core: {
        invoke: (cmd: string, args?: Record<string, unknown>) => {
          if (cmd === "classify_set") {
            const notes = (args as { notes: number[] }).notes;
            return Promise.resolve({
              normalForm: notes,
              primeForm: notes,
              intervalVector: [0, 0, 0, 0, 0, 0],
              forteNumber: "3-11",
              chroma: "100010010000",
              cardinality: notes.length,
              cardinalityNameZh: `${notes.length}音`,
              cardinalityNameEn: `${notes.length} notes`,
              symmetryZh: "无对称性",
              symmetryEn: "None",
              subsets: [],
              complement: [],
              isZRelated: false,
            });
          }
          if (cmd === "transform") {
            const n = (args as { notes: number[] }).notes;
            return Promise.resolve({ notes: n, noteNames: [] });
          }
          if (cmd === "generate_random") {
            return Promise.resolve([0, 4, 7]);
          }
          if (cmd === "get_forte_table") {
            return Promise.resolve([]);
          }
          return Promise.resolve(null);
        },
      },
    };
  });
  await page.goto("/");
});

test("app loads and shows sidebar", async ({ page }) => {
  await expect(page.locator("text=作曲工具")).toBeVisible();
  await expect(page.locator("text=音级集合计算器")).toBeVisible();
});

test("clicking tool opens pitch class set calculator", async ({ page }) => {
  await page.click("text=音级集合计算器");
  await expect(page.locator("text=音级集合计算器").first()).toBeVisible();
  await expect(page.locator("text=点击音符按钮")).toBeVisible();
});

test("clicking note buttons selects notes and shows classification", async ({ page }) => {
  await page.click("text=音级集合计算器");

  // Click C button (should have text "C" in the keyboard)
  const cButton = page.locator("button").filter({ hasText: /^C$/ });
  await cButton.first().click();

  // Should show current set display
  await expect(page.locator("text=集合分类")).toBeVisible({ timeout: 5000 });
});

test("text input parses notes and classifies", async ({ page }) => {
  await page.click("text=音级集合计算器");

  // Type "0 4 7" and submit
  const input = page.locator('input[type="text"]');
  await input.fill("0 4 7");
  await input.press("Enter");

  // Wait for classification
  await page.waitForTimeout(500);
  await expect(page.locator("text=集合分类")).toBeVisible();
});

test("ordered toggle switches mode", async ({ page }) => {
  await page.click("text=音级集合计算器");

  const checkbox = page.locator('input[type="checkbox"]').first();
  await expect(checkbox).toBeVisible();
  await checkbox.check();
  await expect(checkbox).toBeChecked();
});

test("transformation panel is interactive", async ({ page }) => {
  await page.click("text=音级集合计算器");

  // Select some notes first
  const cButton = page.locator("button").filter({ hasText: /^C$/ });
  await cButton.first().click();
  const eButton = page.locator("button").filter({ hasText: /^E$/ });
  await eButton.first().click();

  // Click In button
  await page.waitForTimeout(300);
  const inButton = page.locator("button").filter({ hasText: "倒影 In" });
  await inButton.click();

  // Click apply
  const applyButton = page.locator("button").filter({ hasText: "应用" });
  await applyButton.click();

  // Should show result
  await expect(page.locator("text=变体结果")).toBeVisible({ timeout: 5000 });
});
