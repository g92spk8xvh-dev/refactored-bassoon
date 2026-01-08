/*
 * POLITICAL BUMPER END GRAPHIC
 * Clean Modern Political Transition with WPA Americana Influence
 *
 * Adobe After Effects ExtendScript
 * Run via: File > Scripts > Run Script File
 */

// ============================================================================
// CONFIGURATION - CUSTOMIZE COLORS AND SETTINGS HERE
// ============================================================================

var CONFIG = {
    // PRIMARY COLORS (RGB 0-1) - Easy to change
    colors: {
        red:   [0.698, 0.132, 0.203],    // #B22234 - Flag Red
        white: [1.000, 1.000, 1.000],    // #FFFFFF - White
        blue:  [0.133, 0.173, 0.298]     // #222C4C - Deep Navy
    },

    // COMPOSITION
    comp: {
        name: "Political_Bumper_End",
        width: 1920,
        height: 1080,
        duration: 3,
        frameRate: 30
    },

    // LOGO AREA (where your logo will be placed)
    logo: {
        width: 500,
        height: 280
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function addKeyframes(prop, keyframes) {
    for (var i = 0; i < keyframes.length; i++) {
        prop.setValueAtTime(keyframes[i][0], keyframes[i][1]);
    }
    // Apply ease
    for (var j = 1; j <= prop.numKeys; j++) {
        var ease = new KeyframeEase(0.33, 90);
        prop.setTemporalEaseAtKey(j, [ease], [ease]);
    }
}

// ============================================================================
// MAIN BUILD
// ============================================================================

function buildBumper() {
    app.beginUndoGroup("Create Political Bumper");

    var c = CONFIG.colors;
    var comp = app.project.items.addComp(
        CONFIG.comp.name,
        CONFIG.comp.width,
        CONFIG.comp.height,
        1,
        CONFIG.comp.duration,
        CONFIG.comp.frameRate
    );

    var cx = comp.width / 2;
    var cy = comp.height / 2;

    // ========================================================================
    // LAYER 1: BACKGROUND - Solid navy blue
    // ========================================================================
    var bg = comp.layers.addSolid(c.blue, "BG_Navy", comp.width, comp.height, 1);
    bg.moveToEnd();

    // ========================================================================
    // LAYER 2: SUNBURST RAYS - WPA style, behind everything
    // Rays radiate from center, subtle rotation
    // ========================================================================
    var rays = comp.layers.addShape();
    rays.name = "Sunburst_Rays";
    var raysContent = rays.property("Contents");

    var numRays = 16;
    var rayLength = 1400;

    for (var i = 0; i < numRays; i++) {
        var angle = (360 / numRays) * i;
        // Alternate between slightly lighter and darker blue
        var rayColor = (i % 2 === 0) ? [0.18, 0.22, 0.38] : [0.10, 0.14, 0.26];

        var rayGrp = raysContent.addProperty("ADBE Vector Group");
        rayGrp.name = "Ray_" + i;

        var rayPath = rayGrp.property("Contents").addProperty("ADBE Vector Shape - Group");
        var shape = new Shape();
        var halfAngle = (360 / numRays / 2) * (Math.PI / 180);
        var rayWidth = Math.tan(halfAngle) * rayLength;

        shape.vertices = [[0, 0], [-rayWidth, -rayLength], [rayWidth, -rayLength]];
        shape.closed = true;
        rayPath.property("Path").setValue(shape);

        var rayFill = rayGrp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        rayFill.property("Color").setValue(rayColor);

        rayGrp.property("Transform").property("Rotation").setValue(angle);
    }

    rays.property("Transform").property("Position").setValue([cx, cy]);
    // Slow rotation throughout
    var raysRot = rays.property("Transform").property("Rotation");
    addKeyframes(raysRot, [[0, 0], [CONFIG.comp.duration, 8]]);

    rays.moveToEnd();
    rays.moveAfter(bg);

    // ========================================================================
    // LAYER 3: LEFT WIPE PANEL - Red panel wipes in from left, then exits left
    // ========================================================================
    var leftPanel = comp.layers.addSolid(c.red, "Panel_Left", comp.width / 2 + 100, comp.height + 200, 1);
    leftPanel.property("Transform").property("Anchor Point").setValue([comp.width / 2 + 100, (comp.height + 200) / 2]);
    leftPanel.property("Transform").property("Rotation").setValue(-3);

    var leftPos = leftPanel.property("Transform").property("Position");
    addKeyframes(leftPos, [
        [0.0, [-400, cy]],           // Start off-screen left
        [0.4, [cx - 50, cy]],        // Wipe to center
        [1.2, [cx - 50, cy]],        // Hold
        [1.7, [-600, cy]]            // Exit left
    ]);

    // ========================================================================
    // LAYER 4: RIGHT WIPE PANEL - Red panel wipes in from right, then exits right
    // ========================================================================
    var rightPanel = comp.layers.addSolid(c.red, "Panel_Right", comp.width / 2 + 100, comp.height + 200, 1);
    rightPanel.property("Transform").property("Anchor Point").setValue([0, (comp.height + 200) / 2]);
    rightPanel.property("Transform").property("Rotation").setValue(3);

    var rightPos = rightPanel.property("Transform").property("Position");
    addKeyframes(rightPos, [
        [0.0, [comp.width + 400, cy]],   // Start off-screen right
        [0.4, [cx + 50, cy]],            // Wipe to center
        [1.2, [cx + 50, cy]],            // Hold
        [1.7, [comp.width + 600, cy]]    // Exit right
    ]);

    // ========================================================================
    // LAYER 5: CENTER WHITE FLASH - Brief flash as panels meet
    // ========================================================================
    var flash = comp.layers.addSolid(c.white, "Center_Flash", comp.width, comp.height, 1);
    var flashOpacity = flash.property("Transform").property("Opacity");
    addKeyframes(flashOpacity, [
        [0.35, 0],
        [0.42, 60],
        [0.55, 0]
    ]);

    // ========================================================================
    // LAYER 6: LOGO ZONE MASK/HOLDER - White area where logo goes
    // This fades in as panels exit, providing clean backdrop for logo
    // ========================================================================
    var logoZone = comp.layers.addShape();
    logoZone.name = "LOGO_ZONE";
    var lzContent = logoZone.property("Contents");

    var lzGrp = lzContent.addProperty("ADBE Vector Group");
    var lzRect = lzGrp.property("Contents").addProperty("ADBE Vector Shape - Rect");
    lzRect.property("Size").setValue([CONFIG.logo.width + 80, CONFIG.logo.height + 60]);
    lzRect.property("Roundness").setValue(0);

    var lzFill = lzGrp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
    lzFill.property("Color").setValue(c.white);

    logoZone.property("Transform").property("Position").setValue([cx, cy]);

    var lzScale = logoZone.property("Transform").property("Scale");
    var lzOpacity = logoZone.property("Transform").property("Opacity");
    addKeyframes(lzScale, [
        [1.3, [0, 100]],
        [1.65, [100, 100]]
    ]);
    addKeyframes(lzOpacity, [
        [1.3, 0],
        [1.5, 100]
    ]);

    // ========================================================================
    // LAYER 7: LOGO PLACEHOLDER TEXT - Replace this with actual logo
    // ========================================================================
    var logoText = comp.layers.addText("LOGO");
    logoText.name = "REPLACE_WITH_LOGO";
    var textProp = logoText.property("Source Text");
    var textDoc = textProp.value;
    textDoc.font = "Arial-BoldMT";
    textDoc.fontSize = 72;
    textDoc.fillColor = c.blue;
    textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
    textProp.setValue(textDoc);

    logoText.property("Transform").property("Position").setValue([cx, cy + 20]);

    var logoScale = logoText.property("Transform").property("Scale");
    var logoOpacity = logoText.property("Transform").property("Opacity");
    addKeyframes(logoScale, [
        [1.4, [90, 90]],
        [1.7, [100, 100]]
    ]);
    addKeyframes(logoOpacity, [
        [1.4, 0],
        [1.65, 100]
    ]);

    // ========================================================================
    // LAYER 8: TOP ACCENT BAR - Thin white line accent
    // ========================================================================
    var topBar = comp.layers.addSolid(c.white, "Accent_Top", comp.width + 200, 6, 1);
    topBar.property("Transform").property("Position").setValue([cx, cy - CONFIG.logo.height / 2 - 50]);
    topBar.property("Transform").property("Rotation").setValue(-1);

    var topBarScale = topBar.property("Transform").property("Scale");
    addKeyframes(topBarScale, [
        [1.5, [0, 100]],
        [1.8, [100, 100]]
    ]);

    // ========================================================================
    // LAYER 9: BOTTOM ACCENT BAR - Thin white line accent
    // ========================================================================
    var botBar = comp.layers.addSolid(c.white, "Accent_Bottom", comp.width + 200, 6, 1);
    botBar.property("Transform").property("Position").setValue([cx, cy + CONFIG.logo.height / 2 + 50]);
    botBar.property("Transform").property("Rotation").setValue(1);

    var botBarScale = botBar.property("Transform").property("Scale");
    addKeyframes(botBarScale, [
        [1.5, [0, 100]],
        [1.8, [100, 100]]
    ]);

    // ========================================================================
    // LAYER 10: CORNER STARS - Small star accents in corners (WPA touch)
    // ========================================================================
    var starPositions = [
        [120, 100], [comp.width - 120, 100],
        [120, comp.height - 100], [comp.width - 120, comp.height - 100]
    ];

    for (var s = 0; s < starPositions.length; s++) {
        var starLayer = comp.layers.addShape();
        starLayer.name = "Star_" + (s + 1);
        var starContent = starLayer.property("Contents");
        var starGrp = starContent.addProperty("ADBE Vector Group");

        // 5-point star
        var starPath = starGrp.property("Contents").addProperty("ADBE Vector Shape - Group");
        var starShape = new Shape();
        var outerR = 25;
        var innerR = 10;
        var pts = [];
        for (var p = 0; p < 10; p++) {
            var r = (p % 2 === 0) ? outerR : innerR;
            var ang = (Math.PI / 2) + (Math.PI * p / 5);
            pts.push([Math.cos(ang) * r, -Math.sin(ang) * r]);
        }
        starShape.vertices = pts;
        starShape.closed = true;
        starPath.property("Path").setValue(starShape);

        var starFill = starGrp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        starFill.property("Color").setValue(c.white);

        starLayer.property("Transform").property("Position").setValue(starPositions[s]);

        var starScale = starLayer.property("Transform").property("Scale");
        var starOpacity = starLayer.property("Transform").property("Opacity");
        var delay = 1.7 + (s * 0.08);
        addKeyframes(starScale, [[delay, [0, 0]], [delay + 0.2, [100, 100]]]);
        addKeyframes(starOpacity, [[delay, 0], [delay + 0.15, 100]]);
    }

    // Open composition
    comp.openInViewer();

    app.endUndoGroup();

    alert("Political Bumper Created!\n\n" +
          "TO ADD YOUR LOGO:\n" +
          "1. Import your logo file\n" +
          "2. Drag it into the comp above 'REPLACE_WITH_LOGO'\n" +
          "3. Position at center, copy the keyframes from REPLACE_WITH_LOGO\n" +
          "4. Delete the REPLACE_WITH_LOGO text layer\n\n" +
          "COLORS: Edit CONFIG.colors at top of script");
}

buildBumper();
