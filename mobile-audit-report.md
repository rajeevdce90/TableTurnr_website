# Mobile Responsiveness Audit Report
**Viewport**: iPhone 14 (390x844px)  
**Test Date**: February 26, 2026  
**Pages Tested**: Homepage, Platform, Customers

---

## Executive Summary

Based on code analysis of HTML structure and CSS media queries, here are the key mobile responsiveness issues identified:

### Critical Issues 🔴
1. **Hero section mockup may be too large** on 390px width
2. **Floating badges** on hero showcase are hidden on mobile but referenced in markup
3. **Mobile menu** implementation needs JavaScript verification
4. **Hero stats** using flexbox could cause wrapping issues

### Moderate Issues 🟡
1. **Font sizes** could be too small in some sections (caption text at 0.72rem)
2. **Hero visual ordering** changes on mobile (moved to top)
3. **Conversation cards** hide "back" cards on mobile
4. **Duo-side cards** on customers page may need better stacking

### Minor Issues 🟢
1. Some animations disabled on mobile (good for performance)
2. Credibility bar items may wrap awkwardly
3. Footer link spacing

---

## Page-by-Page Analysis

## 1. Homepage (index.html)

### Hero Section
**Lines 96-190 in index.html**

#### Issues Found:

1. **Hero Grid Layout** (Line 97: `hero-grid`)
   - Desktop: 2-column grid (1.2fr 1fr)
   - Mobile (480px): Single column
   - **Issue**: Hero visual moved to top on mobile (`order: -1`) - this means mockup appears before headline
   - **Recommendation**: Consider keeping text-first on mobile for better engagement

2. **Hero Typography**
   - H1: `font-size: 2.2rem` on mobile (from CSS line 914)
   - Line 100: "Turn Every Table<br>Into Profit."
   - **Issue**: Line break may look awkward on 390px width
   - **Recommendation**: Remove `<br>` on mobile or adjust to "Turn Every Table Into Profit."

3. **Hero Subtitle** (Line 101)
   - Mobile font-size: `1.1rem` (CSS line 920)
   - **Status**: ✅ Looks appropriate

4. **Hero Actions** (Lines 102-105)
   - Two CTAs: "Book a Demo" and "See how it works"
   - Uses `flex-wrap: wrap` (CSS line 7213)
   - **Issue**: May stack vertically - test if buttons look balanced
   - **Recommendation**: Consider full-width buttons on mobile for better touch targets

5. **Hero Stats** (Lines 106-121)
   - 3 stats with separators
   - CSS shows separators at 28px height on <600px (line 7255)
   - **Issue**: Flexbox with gaps at 1rem may cause tight spacing on 390px
   - **Recommendation**: May need to stack vertically or reduce font size further

6. **Hero Showcase/Mockup** (Lines 123-165)
   - Product mockup with floating badges
   - **Critical Issue**: Floating badges (lines 137-164) are set to `display: none` on mobile (CSS line 10370)
   - **Impact**: Visual loses interactive elements
   - **Status**: ⚠️ This is intentional but reduces visual interest

### Credibility Bar (Lines 168-189)
- 4 items with icons and text
- Mobile CSS (line 10373): `gap: 1rem` → reduced to `0.75rem` at 480px (line 10402)
- **Issue**: At 390px, 4 items may cause wrapping or horizontal scroll
- **Recommendation**: Consider 2×2 grid or reduce text length

### How It Works Section (Lines 193-225)
- Section split layout with steps
- **Status**: ✅ Media queries properly handle single-column layout at 768px

### Human Section (Lines 228-235)
- Background image with overlay
- **Status**: ✅ Should work fine with proper background sizing

### Operations Demo (Lines 238-439)
- Complex tab interface with 4 scenarios
- Mock screens with detailed UI elements
- **Potential Issues**:
  - Tab pills may wrap on narrow screens
  - Mock screen internal grids may need review
  - Staff grid (lines 364-384) has many columns - needs horizontal scroll check

### Conversations Section (Lines 442-448)
- Uses `convo-stage` and `convo-pair`
- CSS shows `.convo-pair.back` is hidden on mobile (line 10391)
- **Issue**: Content loss on mobile
- **Recommendation**: Consider showing all conversations in sequence

### Integrations Hub SVG (Lines 451-540)
- Large SVG diagram (560×390 viewBox)
- **Issue**: SVG may be difficult to read at 390px width
- **Recommendation**: Verify SVG scaling and consider simplified mobile version

### Final CTA (Lines 543-551)
- Background image with overlay
- **Status**: ✅ Should work well

---

## 2. Platform Page (platform/index.html)

### Platform Hero (Lines 62-75)
- Background image with gradient overlay
- **Status**: ✅ Structure looks good

### Module Sections (Lines 78-442)
- 5 detailed module showcases with mock screens
- Each has complex internal layouts (grids, charts, heatmaps)

#### Specific Issues:

1. **TurnrSense Mock (Lines 98-156)**
   - 4-card grid layout
   - **Issue**: May need to stack to 2×2 or 1×4 on mobile

2. **TurnrPulse RevPATH Heatmap (Lines 206-250)**
   - 5-column heatmap
   - **Critical Issue**: 5 day columns + time labels may overflow at 390px
   - **Recommendation**: Make horizontally scrollable or show 3 days

3. **TurnrOps Staffing Grid (Lines 285-322)**
   - 7-day week grid with role labels
   - **Critical Issue**: 7 columns will definitely overflow on 390px
   - **Recommendation**: Horizontal scroll or show 3-4 days at a time

4. **TurnrAgent Chat (Lines 418-434)**
   - Chat interface with bubbles
   - **Status**: ✅ Should work well on mobile

### Role Cards Grid (Lines 449-479)
- 4 role cards
- **Issue**: Grid may need to go 2×2 or 1×4 on mobile
- **Recommendation**: Check grid-template-columns responsive behavior

---

## 3. Customers Page (customers/index.html)

### Story Sections (Lines 77-128, 131-182)
- Background images with overlays
- Story cards with metrics
- **Status**: ✅ Reverse layout handled in CSS

### Duo Cards (Lines 185-224)
- Two cards side-by-side (Maria & Derek stories)
- **Issue**: At 390px, cards stack but may be too tall
- **Recommendation**: Verify card height and image sizing

### Aggregate Results (Lines 228-253)
- 4 metric items with separators
- **Same issue as credibility bar**: May wrap or be too tight
- **Recommendation**: Stack vertically or use 2×2 grid

---

## CSS Media Query Analysis

### Breakpoints Used:
- `max-width: 768px` - Tablet/large phone (31 instances)
- `max-width: 480px` - Small phone (20 instances)
- `max-width: 600px` - Mid-range (1 instance for hero stats)

### Missing: 
- **No specific 390px breakpoint** for iPhone 14
- Falls into 480px bucket, which may not be optimal

### Key Mobile Styles Applied:

1. **Typography Scaling** (CSS lines 790-827)
   - H1: 2.5rem → (implied ~2.2rem at 480px)
   - H2: 2rem
   - Body: 16px (good for iOS zoom prevention)
   - Minimum touch targets: 44px ✅

2. **Navigation** (CSS lines 829-881)
   - Desktop links hidden
   - Mobile menu toggle shown
   - Menu opens as overlay
   - **Concern**: Mobile menu background is white (line 854) but nav is dark-themed
   - **Recommendation**: Change to dark theme to match navbar

3. **Hero Adjustments** (CSS lines 908-923)
   - Padding reduced: 80px 0 60px
   - min-height: auto (removes full-screen height)
   - **Status**: ✅ Good

4. **Section Padding** (CSS line 926)
   - All sections: `padding: 60px 0 !important`
   - **Issue**: Using `!important` is a code smell
   - **Recommendation**: Refactor to avoid !important

5. **Showcase Floats Hidden** (CSS line 10370)
   - All floating elements removed on mobile
   - **Impact**: Reduces visual interest but improves performance

---

## Font Size Analysis

### Potentially Too Small:
1. **Caption text**: 0.72rem (11.52px at 16px base) - line 10410
   - May be hard to read on mobile
   - **Recommendation**: Increase to 0.8rem minimum (12.8px)

2. **Credibility items**: 0.78rem (12.48px) - line 10406
   - Borderline acceptable
   - **Recommendation**: Consider 0.85rem

3. **Module labels**: 0.65-0.7rem in orbital diagrams (lines 2198, 2142)
   - Too small for mobile
   - **Recommendation**: 0.75rem minimum

### Appropriate Sizes:
- Body text: 16px ✅
- Buttons: inherit with padding ✅
- Headings: 2rem-2.5rem ✅

---

## Spacing Issues

### Too Little Padding:
1. **Container padding**: 15px on mobile (line 787)
   - **Recommendation**: Increase to 20px for better breathing room

2. **Hero stats gap**: 1rem (line 7252)
   - May be tight with separators
   - **Recommendation**: Consider vertical stacking

### Too Much Padding:
1. **Section padding**: 60px may be excessive on short viewports
   - **Recommendation**: Reduce to 40px for mobile

---

## Horizontal Overflow Risks

### High Risk:
1. ✅ **Staffing grids** (7 columns) - Will overflow
2. ✅ **RevPATH heatmap** (5+ columns) - Will overflow
3. ⚠️ **Credibility bar** (4 items) - May overflow
4. ⚠️ **Aggregate results** (4 items) - May overflow

### Mitigations Needed:
- Add `overflow-x: auto` with custom scrollbars
- Or: Stack/hide columns
- Or: Use horizontal swipe indicators

---

## Accessibility Notes

### ✅ Good Practices Found:
1. Skip link present (line 65)
2. Proper ARIA labels on nav button (line 46)
3. Role="tab" on scenario pills (line 245)
4. Min touch targets: 44px (CSS line 821)
5. Font size 16px prevents iOS zoom (line 826)

### ⚠️ Improvements Needed:
1. Verify focus states work on touch
2. Test mobile menu keyboard navigation
3. Ensure mock screens have proper alt text (many marked aria-hidden)

---

## Recommendations Priority

### Critical (Fix Before Launch):
1. **Fix staffing grid overflow** - Make horizontally scrollable
2. **Fix RevPATH heatmap** - Reduce columns or make scrollable
3. **Test mobile menu** - Verify it opens/closes properly
4. **Verify hero stats layout** - May need vertical stacking

### High Priority:
1. **Remove `order: -1` from hero visual** - Keep text first on mobile
2. **Increase caption font sizes** - 0.72rem → 0.8rem minimum
3. **Fix mobile menu colors** - Match dark theme
4. **Add horizontal scroll indicators** - For grids that must scroll

### Medium Priority:
1. **Stack credibility/aggregate bars** - Vertical layout on mobile
2. **Optimize SVG integrations hub** - Simplify for mobile
3. **Review duo cards height** - May be too tall on mobile
4. **Increase container padding** - 15px → 20px

### Low Priority:
1. **Remove !important** from section padding
2. **Add 390px specific breakpoint** - For iPhone 14
3. **Consider showing "back" conversation cards** - Currently hidden
4. **Review all animation performance** - Some disabled, verify others

---

## Testing Checklist

When you test with actual browser tools:

### Homepage:
- [ ] Hero text readable and properly sized
- [ ] Hero mockup visible and appropriately sized
- [ ] Hero stats don't wrap awkwardly
- [ ] Mobile menu opens/closes
- [ ] Credibility bar doesn't overflow
- [ ] Operations demo tabs work
- [ ] Staffing grids scrollable
- [ ] Conversation section shows content
- [ ] Integrations SVG is readable
- [ ] No horizontal page scroll

### Platform Page:
- [ ] All module sections stack properly
- [ ] TurnrSense cards layout well
- [ ] RevPATH heatmap scrollable/readable
- [ ] Staffing grids scrollable
- [ ] Chat interface works
- [ ] Role cards stack properly
- [ ] No content cut off

### Customers Page:
- [ ] Story sections readable
- [ ] Story cards show all content
- [ ] Duo cards stack properly
- [ ] Metrics display correctly
- [ ] Aggregate results don't overflow
- [ ] Background images load

### All Pages:
- [ ] Footer links accessible
- [ ] All buttons min 44px touch target
- [ ] No text below 12px
- [ ] Forms are usable
- [ ] No horizontal overflow
- [ ] Smooth scrolling
- [ ] Images load properly
- [ ] Videos (if any) are responsive

---

## Code Quality Notes

### Good:
- Proper viewport meta tag
- Semantic HTML structure
- CSS custom properties used
- Accessibility features included
- Progressive enhancement approach

### Needs Improvement:
- Overuse of `!important`
- Inconsistent breakpoint strategy
- Some hardcoded sizes
- Complex grid layouts without mobile fallbacks
- SVG accessibility could be better

---

## Estimated Visual Issues Summary

Based on code analysis, here's what likely looks wrong at 390px:

### Homepage:
1. 🔴 **Staffing grid overflows** horizontally
2. 🟡 **Hero stats may wrap** awkwardly
3. 🟡 **Credibility bar tight** spacing
4. 🟢 **Mobile menu color mismatch** (white on dark nav)

### Platform:
1. 🔴 **RevPATH heatmap overflows** horizontally  
2. 🔴 **Staffing grids overflow** (7 columns)
3. 🟡 **TurnrSense cards** may need better stacking
4. 🟡 **Role cards** could stack better

### Customers:
1. 🟡 **Duo cards** may be too tall
2. 🟡 **Aggregate results** tight spacing
3. 🟢 Overall structure should work

---

## Next Steps

1. **Set up actual mobile testing** using:
   - Chrome DevTools Device Mode (390x844)
   - Real iPhone 14 if available
   - BrowserStack or similar service

2. **Fix critical overflow issues** identified above

3. **Test and iterate** on spacing and font sizes

4. **Run accessibility audit** with axe or Lighthouse

5. **Performance test** - mobile networks are slower

---

*This report generated from static code analysis. Live browser testing required to confirm all issues.*
