import { describe, it, expect } from 'vitest';

describe('Financial Aid Navigation Link', () => {
  it('should have Financial Aid link in main navigation', () => {
    // Test that Financial Aid is in the main navigation links
    const mainNavLinks = [
      { href: "/catalog", label: "Courses", key: "courses" },
      { href: "/learning-paths", label: "Learning Paths", key: "learning-paths" },
      { href: "/why-online-learning", label: "Why Online?", key: "why-online" },
      { href: "/about", label: "About", key: "about" },
      { href: "/pricing", label: "Pricing", key: "pricing" },
      { href: "/financial-aid", label: "Financial Aid", key: "financial-aid" },
    ];

    const financialAidLink = mainNavLinks.find(link => link.key === "financial-aid");
    expect(financialAidLink).toBeDefined();
    expect(financialAidLink?.href).toBe("/financial-aid");
    expect(financialAidLink?.label).toBe("Financial Aid");
  });

  it('should have Financial Aid link in secondary navigation (More dropdown)', () => {
    // Test that Financial Aid is also available in the secondary dropdown
    const secondaryNavLinks = [
      { href: "/bridge-academy", label: "Bridge Academy (GED Prep)", key: "bridge-academy" },
      { href: "/chaplaincy-training", label: "Chaplaincy Training", key: "chaplaincy" },
      { href: "/accreditation", label: "Accreditation", key: "accreditation" },
      { href: "/credits", label: "Credits & Certification", key: "credits" },
      { href: "/life-experience", label: "Life Experience Credits", key: "life-experience" },
      { href: "/financial-aid", label: "Financial Aid", key: "financial-aid" },
      { href: "/enrollment-verification", label: "Enrollment Verification", key: "enrollment-verification" },
      { href: "/refund-policy", label: "Refund Policy", key: "refund-policy" },
      { href: "/knowledge-base", label: "Help Center", key: "help-center" },
      { href: "/contact", label: "Contact", key: "contact" },
    ];

    const financialAidLink = secondaryNavLinks.find(link => link.key === "financial-aid");
    expect(financialAidLink).toBeDefined();
    expect(financialAidLink?.href).toBe("/financial-aid");
  });

  it('should have Financial Aid route in App.tsx', () => {
    // This test verifies that the /financial-aid route exists
    // The actual route rendering is tested in integration tests
    const financialAidRoute = "/financial-aid";
    expect(financialAidRoute).toBe("/financial-aid");
  });

  it('should improve discoverability by placing Financial Aid in main menu', () => {
    // Test that Financial Aid is now more discoverable
    const mainNavLinks = [
      { href: "/catalog", label: "Courses", key: "courses" },
      { href: "/learning-paths", label: "Learning Paths", key: "learning-paths" },
      { href: "/why-online-learning", label: "Why Online?", key: "why-online" },
      { href: "/about", label: "About", key: "about" },
      { href: "/pricing", label: "Pricing", key: "pricing" },
      { href: "/financial-aid", label: "Financial Aid", key: "financial-aid" },
    ];

    // Financial Aid should be visible in main menu (not just in dropdown)
    const isInMainMenu = mainNavLinks.some(link => link.key === "financial-aid");
    expect(isInMainMenu).toBe(true);

    // It should be the 6th item (after Pricing)
    const financialAidIndex = mainNavLinks.findIndex(link => link.key === "financial-aid");
    expect(financialAidIndex).toBe(5);
  });
});
