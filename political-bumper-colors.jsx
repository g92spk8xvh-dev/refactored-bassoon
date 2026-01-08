/*
 * POLITICAL BUMPER - COLOR PRESETS
 *
 * Copy any of these color schemes into the main political-bumper.jsx
 * CONFIG.colors.primary section to change the look.
 *
 * Colors are in RGB format (0-1 range)
 * To convert from hex: divide each value by 255
 * Example: #B22234 = [178/255, 34/255, 52/255] = [0.698, 0.133, 0.204]
 */

// ============================================================================
// AMERICAN POLITICAL PRESETS
// ============================================================================

var COLOR_PRESETS = {

    // CLASSIC AMERICAN FLAG
    // Traditional patriotic colors
    classicFlag: {
        red:   [0.698, 0.132, 0.203],    // #B22234 - Old Glory Red
        white: [1.000, 1.000, 1.000],    // #FFFFFF - Pure White
        blue:  [0.234, 0.234, 0.430]     // #3C3C6E - Old Glory Blue
    },

    // MODERN CAMPAIGN (Democratic lean)
    modernDemocrat: {
        red:   [0.890, 0.145, 0.210],    // #E32536 - Bright Red accent
        white: [0.976, 0.976, 0.976],    // #F9F9F9 - Soft White
        blue:  [0.000, 0.267, 0.545]     // #00448B - Strong Blue
    },

    // MODERN CAMPAIGN (Republican lean)
    modernRepublican: {
        red:   [0.800, 0.000, 0.133],    // #CC0022 - Deep Red
        white: [1.000, 1.000, 1.000],    // #FFFFFF - Pure White
        blue:  [0.125, 0.169, 0.353]     // #202B5A - Navy Blue
    },

    // VINTAGE WPA POSTER STYLE
    // Muted, aged look inspired by 1930s-40s government posters
    vintageWPA: {
        red:   [0.765, 0.220, 0.173],    // #C3382C - Earthy Red
        white: [0.961, 0.949, 0.918],    // #F5F2EA - Cream/Off-white
        blue:  [0.184, 0.286, 0.388]     // #2F4963 - Steel Blue
    },

    // BOLD NEWS NETWORK
    // High contrast broadcast style
    boldNews: {
        red:   [0.929, 0.110, 0.141],    // #ED1C24 - Broadcast Red
        white: [1.000, 1.000, 1.000],    // #FFFFFF - Pure White
        blue:  [0.000, 0.188, 0.412]     // #003069 - News Blue
    },

    // RETRO AMERICANA
    // 1950s-60s patriotic style
    retroAmericana: {
        red:   [0.835, 0.180, 0.165],    // #D52E2A - Cherry Red
        white: [0.996, 0.988, 0.941],    // #FEFCF0 - Antique White
        blue:  [0.149, 0.196, 0.322]     // #263252 - Midnight Blue
    },

    // PASTEL POLITICAL
    // Softer, more modern web-friendly
    pastelPolitical: {
        red:   [0.918, 0.376, 0.376],    // #EA6060 - Soft Red
        white: [0.988, 0.988, 0.988],    // #FCFCFC - Near White
        blue:  [0.294, 0.424, 0.620]     // #4B6C9E - Soft Blue
    },

    // HIGH CONTRAST ACCESSIBILITY
    // WCAG compliant high contrast
    highContrast: {
        red:   [0.698, 0.000, 0.000],    // #B20000 - Dark Red
        white: [1.000, 1.000, 1.000],    // #FFFFFF - Pure White
        blue:  [0.000, 0.000, 0.545]     // #00008B - Dark Blue
    },

    // MUTED PROFESSIONAL
    // Corporate/formal political style
    mutedProfessional: {
        red:   [0.580, 0.173, 0.180],    // #942C2E - Burgundy
        white: [0.949, 0.949, 0.949],    // #F2F2F2 - Light Gray
        blue:  [0.220, 0.251, 0.322]     // #384052 - Charcoal Blue
    },

    // ELECTRIC MODERN
    // Bold contemporary style
    electricModern: {
        red:   [1.000, 0.176, 0.333],    // #FF2D55 - Hot Pink-Red
        white: [1.000, 1.000, 1.000],    // #FFFFFF - Pure White
        blue:  [0.000, 0.478, 1.000]     // #007AFF - Electric Blue
    }
};

// ============================================================================
// CUSTOM COLOR CONVERTER HELPER
// ============================================================================

/*
 * Use this function to convert hex colors to After Effects format
 *
 * Example usage (in ExtendScript Toolkit or AE console):
 * hexToAE("#B22234") returns [0.698, 0.133, 0.204]
 */

function hexToAE(hex) {
    // Remove # if present
    hex = hex.replace('#', '');

    var r = parseInt(hex.substring(0, 2), 16) / 255;
    var g = parseInt(hex.substring(2, 4), 16) / 255;
    var b = parseInt(hex.substring(4, 6), 16) / 255;

    return [
        Math.round(r * 1000) / 1000,
        Math.round(g * 1000) / 1000,
        Math.round(b * 1000) / 1000
    ];
}

// ============================================================================
// HOW TO USE CUSTOM COLORS
// ============================================================================

/*
 * OPTION 1: Use a preset
 * Copy one of the presets above into your CONFIG.colors.primary section
 *
 * OPTION 2: Custom hex colors
 * 1. Use the hexToAE() function to convert your hex colors
 * 2. Or manually calculate: hex_value / 255 = AE_value
 *
 * OPTION 3: Use exact brand colors
 * Many political organizations have specific brand colors.
 * Convert their hex values using the formula above.
 *
 * EXAMPLE - To use vintageWPA preset in main script:
 *
 * colors: {
 *     primary: {
 *         red:   [0.765, 0.220, 0.173],    // #C3382C
 *         white: [0.961, 0.949, 0.918],    // #F5F2EA
 *         blue:  [0.184, 0.286, 0.388]     // #2F4963
 *     }
 * }
 */

// ============================================================================
// QUICK REFERENCE: POLITICAL BRAND COLORS
// ============================================================================

/*
 * Note: These are approximate. Always verify with official style guides.
 *
 * U.S. POLITICAL PARTIES (approximate):
 * - Democratic Blue: #0015BC → [0.000, 0.082, 0.737]
 * - Republican Red:  #E81B23 → [0.910, 0.106, 0.137]
 *
 * NEWS NETWORKS (approximate):
 * - CNN Red:         #CC0000 → [0.800, 0.000, 0.000]
 * - Fox Blue:        #003366 → [0.000, 0.200, 0.400]
 * - MSNBC Blue:      #0089D0 → [0.000, 0.537, 0.816]
 *
 * GOVERNMENT:
 * - White House:     #002868 → [0.000, 0.157, 0.408]
 * - Congress Blue:   #00205B → [0.000, 0.125, 0.357]
 */
