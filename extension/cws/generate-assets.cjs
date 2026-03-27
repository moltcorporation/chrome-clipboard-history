/**
 * CWS Asset Generator for Clipboard History
 * Generates promotional images for Chrome Web Store listing.
 * Run: node generate-assets.cjs
 * Outputs: screenshot-1280x800.svg, promo-tile-440x280.svg
 */

const fs = require("fs");
const path = require("path");

const colors = {
  bg: "#f8f9fa",
  bgWhite: "#ffffff",
  bgHover: "#f7f9fc",
  bgPinned: "#fffbe6",
  text: "#1a1a1a",
  textSecondary: "#888888",
  textMuted: "#bbbbbb",
  border: "#eeeeee",
  borderInput: "#dddddd",
  accent: "#4a9eff",
  pinColor: "#e8a735",
  copied: "#e8f5e9",
};

function generateScreenshot() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <defs>
    <style>
      text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    </style>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#000" flood-opacity="0.15"/>
    </filter>
    <filter id="popupShadow" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1280" height="800" fill="#e8ecf0"/>

  <!-- Browser window -->
  <rect x="60" y="30" width="1160" height="740" rx="12" fill="${colors.bgWhite}" filter="url(#shadow)"/>

  <!-- Browser chrome -->
  <rect x="60" y="30" width="1160" height="44" rx="12" fill="#f0f1f3"/>
  <rect x="60" y="62" width="1160" height="12" fill="#f0f1f3"/>

  <!-- Window buttons -->
  <circle cx="88" cy="52" r="6" fill="#ff5f57"/>
  <circle cx="108" cy="52" r="6" fill="#febc2e"/>
  <circle cx="128" cy="52" r="6" fill="#28c840"/>

  <!-- Tab -->
  <rect x="150" y="38" width="180" height="28" rx="6" fill="${colors.bgWhite}"/>
  <text x="170" y="57" fill="${colors.text}" font-size="11" font-weight="500">Research Notes — Google Docs</text>

  <!-- Address bar -->
  <rect x="80" y="78" width="1120" height="28" rx="14" fill="#e8ecf0"/>
  <text x="110" y="97" fill="${colors.textSecondary}" font-size="11">docs.google.com/document/d/1abc...</text>

  <!-- Page content area -->
  <rect x="60" y="110" width="1160" height="660" fill="${colors.bgWhite}"/>

  <!-- Document content mockup -->
  <rect x="260" y="140" width="720" height="600" fill="${colors.bgWhite}"/>

  <!-- Document text lines -->
  <text x="300" y="185" fill="${colors.text}" font-size="22" font-weight="700">Q2 Research Summary</text>
  <rect x="300" y="200" width="600" height="1" fill="#e8ecf0"/>

  <text x="300" y="230" fill="${colors.text}" font-size="13">Key findings from the market analysis show significant growth in the</text>
  <text x="300" y="248" fill="${colors.text}" font-size="13">enterprise segment. Customer retention improved by 18% compared to</text>
  <text x="300" y="266" fill="${colors.text}" font-size="13">Q1, with notable gains in the APAC region.</text>

  <text x="300" y="300" fill="${colors.text}" font-size="13">The competitive landscape has shifted — three major players launched</text>
  <text x="300" y="318" fill="${colors.text}" font-size="13">new offerings in February, but early adoption data suggests limited</text>
  <text x="300" y="336" fill="${colors.text}" font-size="13">traction. Our NPS score remains the highest in the category at 72.</text>

  <text x="300" y="375" fill="${colors.text}" font-size="16" font-weight="600">Action Items</text>
  <text x="300" y="400" fill="${colors.text}" font-size="13">1. Schedule customer advisory board meeting for April 10</text>
  <text x="300" y="420" fill="${colors.text}" font-size="13">2. Finalize pricing model for enterprise tier</text>
  <text x="300" y="440" fill="${colors.text}" font-size="13">3. Review competitor launch responses by March 30</text>

  <!-- Extension popup overlay -->
  <rect x="770" y="105" width="380" height="500" rx="10" fill="${colors.bgWhite}" stroke="${colors.border}" stroke-width="1" filter="url(#popupShadow)"/>

  <!-- Popup header -->
  <rect x="770" y="105" width="380" height="44" fill="${colors.bgWhite}" rx="10"/>
  <rect x="770" y="135" width="380" height="14" fill="${colors.bgWhite}"/>
  <line x1="770" y1="149" x2="1150" y2="149" stroke="${colors.border}" stroke-width="1"/>
  <text x="784" y="133" fill="${colors.text}" font-size="15" font-weight="600">Clipboard History</text>
  <!-- Clear button -->
  <line x1="1128" y1="121" x2="1138" y2="131" stroke="${colors.textSecondary}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="1138" y1="121" x2="1128" y2="131" stroke="${colors.textSecondary}" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Search bar -->
  <rect x="784" y="157" width="352" height="32" rx="6" fill="#fafafa" stroke="${colors.borderInput}" stroke-width="1"/>
  <text x="798" y="178" fill="#ccc" font-size="13">Search clipboard history...</text>

  <!-- Clipboard item 1 (pinned) -->
  <rect x="770" y="197" width="380" height="60" fill="${colors.bgPinned}"/>
  <line x1="770" y1="257" x2="1150" y2="257" stroke="#f5f5f5" stroke-width="1"/>
  <text x="784" y="217" fill="${colors.text}" font-size="13">Schedule customer advisory board</text>
  <text x="784" y="235" fill="${colors.text}" font-size="13">meeting for April 10</text>
  <text x="1100" y="217" fill="${colors.textMuted}" font-size="10">2m ago</text>
  <!-- Pin icon -->
  <text x="1110" y="238" fill="${colors.pinColor}" font-size="12">&#9733;</text>

  <!-- Clipboard item 2 -->
  <rect x="770" y="257" width="380" height="52" fill="${colors.bgWhite}"/>
  <line x1="770" y1="309" x2="1150" y2="309" stroke="#f5f5f5" stroke-width="1"/>
  <text x="784" y="280" fill="${colors.text}" font-size="13">Our NPS score remains the highest in</text>
  <text x="784" y="296" fill="${colors.text}" font-size="13">the category at 72.</text>
  <text x="1100" y="280" fill="${colors.textMuted}" font-size="10">5m ago</text>

  <!-- Clipboard item 3 (just copied - green flash) -->
  <rect x="770" y="309" width="380" height="52" fill="${colors.copied}"/>
  <line x1="770" y1="361" x2="1150" y2="361" stroke="#f5f5f5" stroke-width="1"/>
  <text x="784" y="332" fill="${colors.text}" font-size="13">enterprise segment. Customer retention</text>
  <text x="784" y="348" fill="${colors.text}" font-size="13">improved by 18% compared to Q1</text>
  <text x="1088" y="332" fill="${colors.textMuted}" font-size="10">12m ago</text>
  <!-- Copied badge -->
  <rect x="1088" y="340" width="50" height="16" rx="8" fill="#4caf50" opacity="0.2"/>
  <text x="1097" y="352" fill="#2e7d32" font-size="9" font-weight="600">Copied!</text>

  <!-- Clipboard item 4 -->
  <rect x="770" y="361" width="380" height="52" fill="${colors.bgWhite}"/>
  <line x1="770" y1="413" x2="1150" y2="413" stroke="#f5f5f5" stroke-width="1"/>
  <text x="784" y="384" fill="${colors.text}" font-size="13">https://dashboard.internal/metrics/q2</text>
  <text x="1088" y="384" fill="${colors.textMuted}" font-size="10">28m ago</text>

  <!-- Clipboard item 5 -->
  <rect x="770" y="413" width="380" height="52" fill="${colors.bgWhite}"/>
  <line x1="770" y1="465" x2="1150" y2="465" stroke="#f5f5f5" stroke-width="1"/>
  <text x="784" y="436" fill="${colors.text}" font-size="13">Finalize pricing model for enterprise</text>
  <text x="784" y="452" fill="${colors.text}" font-size="13">tier — see attached spreadsheet</text>
  <text x="1100" y="436" fill="${colors.textMuted}" font-size="10">1h ago</text>

  <!-- Clipboard item 6 -->
  <rect x="770" y="465" width="380" height="52" fill="${colors.bgWhite}"/>
  <line x1="770" y1="517" x2="1150" y2="517" stroke="#f5f5f5" stroke-width="1"/>
  <text x="784" y="488" fill="${colors.text}" font-size="13">three major players launched new</text>
  <text x="784" y="504" fill="${colors.text}" font-size="13">offerings in February</text>
  <text x="1100" y="488" fill="${colors.textMuted}" font-size="10">1h ago</text>

  <!-- Popup footer -->
  <rect x="770" y="561" width="380" height="44" fill="${colors.bgWhite}" rx="10"/>
  <rect x="770" y="561" width="380" height="14" fill="${colors.bgWhite}"/>
  <line x1="770" y1="565" x2="1150" y2="565" stroke="${colors.border}" stroke-width="1"/>
  <text x="784" y="590" fill="${colors.textMuted}" font-size="11">8 items</text>
  <text x="1108" y="590" fill="#ccc" font-size="11">max 25</text>

  <!-- Feature badges at bottom -->
  <rect x="80" y="732" width="145" height="32" rx="16" fill="${colors.accent}" opacity="0.1"/>
  <text x="112" y="753" fill="${colors.accent}" font-size="12" font-weight="600">Ctrl+Shift+V</text>

  <rect x="240" y="732" width="130" height="32" rx="16" fill="${colors.accent}" opacity="0.1"/>
  <text x="261" y="753" fill="${colors.accent}" font-size="12" font-weight="600">Search &amp; Pin</text>

  <rect x="385" y="732" width="155" height="32" rx="16" fill="${colors.accent}" opacity="0.1"/>
  <text x="407" y="753" fill="${colors.accent}" font-size="12" font-weight="600">Zero Data Collection</text>

  <rect x="555" y="732" width="140" height="32" rx="16" fill="${colors.accent}" opacity="0.1"/>
  <text x="575" y="753" fill="${colors.accent}" font-size="12" font-weight="600">One-Click Copy</text>
</svg>`;
}

function generatePromoTile() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="280" viewBox="0 0 440 280">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0f4ff"/>
      <stop offset="100%" stop-color="#e0e8ff"/>
    </linearGradient>
  </defs>
  <rect width="440" height="280" fill="url(#bgGrad)"/>

  <!-- Decorative clipboard icon -->
  <rect x="190" y="30" width="60" height="76" rx="6" fill="none" stroke="${colors.accent}" stroke-width="2.5" opacity="0.7"/>
  <rect x="205" y="22" width="30" height="16" rx="4" fill="${colors.accent}" opacity="0.7"/>
  <!-- Lines on clipboard -->
  <rect x="202" y="50" width="36" height="3" rx="1.5" fill="${colors.accent}" opacity="0.35"/>
  <rect x="202" y="60" width="28" height="3" rx="1.5" fill="${colors.accent}" opacity="0.35"/>
  <rect x="202" y="70" width="32" height="3" rx="1.5" fill="${colors.accent}" opacity="0.35"/>
  <rect x="202" y="80" width="20" height="3" rx="1.5" fill="${colors.accent}" opacity="0.35"/>

  <!-- Title -->
  <text x="220" y="140" fill="${colors.text}" font-size="22" font-weight="700" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Clipboard History</text>
  <text x="220" y="164" fill="${colors.textSecondary}" font-size="13" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Never lose a copied text again</text>

  <!-- Feature pills -->
  <rect x="56" y="190" width="88" height="26" rx="13" fill="${colors.accent}" opacity="0.12"/>
  <text x="100" y="207" fill="${colors.accent}" font-size="11" text-anchor="middle" font-family="-apple-system, sans-serif" font-weight="500">Search</text>

  <rect x="154" y="190" width="60" height="26" rx="13" fill="${colors.accent}" opacity="0.12"/>
  <text x="184" y="207" fill="${colors.accent}" font-size="11" text-anchor="middle" font-family="-apple-system, sans-serif" font-weight="500">Pin</text>

  <rect x="224" y="190" width="88" height="26" rx="13" fill="${colors.accent}" opacity="0.12"/>
  <text x="268" y="207" fill="${colors.accent}" font-size="11" text-anchor="middle" font-family="-apple-system, sans-serif" font-weight="500">One-Click</text>

  <rect x="322" y="190" width="68" height="26" rx="13" fill="${colors.accent}" opacity="0.12"/>
  <text x="356" y="207" fill="${colors.accent}" font-size="11" text-anchor="middle" font-family="-apple-system, sans-serif" font-weight="500">Private</text>

  <!-- Keyboard shortcut -->
  <text x="220" y="248" fill="${colors.textMuted}" font-size="11" text-anchor="middle" font-family="-apple-system, sans-serif">Ctrl+Shift+V • Free • No Account Required</text>
</svg>`;
}

// Write SVG files
fs.writeFileSync(
  path.join(__dirname, "screenshot-1280x800.svg"),
  generateScreenshot()
);
fs.writeFileSync(
  path.join(__dirname, "promo-tile-440x280.svg"),
  generatePromoTile()
);

console.log("Generated: screenshot-1280x800.svg (1280x800)");
console.log("Generated: promo-tile-440x280.svg (440x280)");
console.log(
  "\nTo convert to PNG for CWS upload:"
);
console.log(
  "  npx svg2png screenshot-1280x800.svg -o screenshot-1280x800.png -w 1280 -h 800"
);
console.log(
  "  npx svg2png promo-tile-440x280.svg -o promo-tile-440x280.png -w 440 -h 280"
);
