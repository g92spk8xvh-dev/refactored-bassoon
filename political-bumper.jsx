/*
 * POLITICAL BUMPER END GRAPHIC
 * Panel Collision → Starburst Fan → Logo Reveal
 *
 * Adobe After Effects ExtendScript
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

var CONFIG = {
    colors: {
        red:      [0.698, 0.132, 0.203],    // #B22234
        darkRed:  [0.500, 0.090, 0.140],    // Darker red for alternating rays
        white:    [1.000, 1.000, 1.000],    // #FFFFFF
        blue:     [0.133, 0.173, 0.298]     // #222C4C
    },
    comp: {
        width: 1920,
        height: 1080,
        duration: 3.5,
        frameRate: 30
    }
};

// ============================================================================
// UTILITIES
// ============================================================================

function ease(prop, keyframes) {
    // Set keyframes only - easing can be added manually in AE if desired
    for (var i = 0; i < keyframes.length; i++) {
        prop.setValueAtTime(keyframes[i][0], keyframes[i][1]);
    }
}

// ============================================================================
// MAIN
// ============================================================================

app.beginUndoGroup("Political Bumper");

var comp = app.project.items.addComp(
    "Political_Bumper_End",
    CONFIG.comp.width,
    CONFIG.comp.height,
    1,
    CONFIG.comp.duration,
    CONFIG.comp.frameRate
);

var W = comp.width;
var H = comp.height;
var cx = W / 2;
var cy = H / 2;
var c = CONFIG.colors;

// ============================================================================
// 1. BACKGROUND
// ============================================================================

var bg = comp.layers.addSolid(c.blue, "Background", W, H, 1);

// ============================================================================
// 2. STARBURST RAYS (12 rays that fan out)
// ============================================================================

var NUM_RAYS = 12;
var RAY_LENGTH = 1500;

for (var i = 0; i < NUM_RAYS; i++) {

    var ray = comp.layers.addShape();
    ray.name = "Starburst_Ray_" + (i + 1);

    var contents = ray.property("ADBE Root Vectors Group");
    var shapeGroup = contents.addProperty("ADBE Vector Group");
    shapeGroup.name = "Wedge";

    // Create wedge path
    var shapePath = shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Group");
    var path = shapePath.property("ADBE Vector Shape");

    var wedgeAngle = (360 / NUM_RAYS) * (Math.PI / 180);
    var hw = wedgeAngle / 2;

    var myShape = new Shape();
    myShape.vertices = [
        [0, 0],
        [Math.sin(hw) * RAY_LENGTH, -Math.cos(hw) * RAY_LENGTH],
        [Math.sin(-hw) * RAY_LENGTH, -Math.cos(-hw) * RAY_LENGTH]
    ];
    myShape.closed = true;
    path.setValue(myShape);

    // Fill
    var fill = shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
    var fillColor = (i % 2 === 0) ? c.red : c.darkRed;
    fill.property("ADBE Vector Fill Color").setValue(fillColor);

    // Position at center
    ray.property("ADBE Transform Group").property("ADBE Position").setValue([cx, cy]);

    // Final rotation angle for this ray
    var finalAngle = (360 / NUM_RAYS) * i;

    // Animate rotation: start all pointing same direction, fan out
    var rotProp = ray.property("ADBE Transform Group").property("ADBE Rotate Z");
    ease(rotProp, [
        [0.4, 0],           // All rays start at 0 (pointing up, hidden behind panels)
        [0.5, 0],           // Hold during collision
        [1.2, finalAngle]   // Fan out to final position
    ]);

    // Animate scale: pop in at collision
    var scaleProp = ray.property("ADBE Transform Group").property("ADBE Scale");
    ease(scaleProp, [
        [0.4, [0, 0]],
        [0.6, [100, 100]]
    ]);
}

// ============================================================================
// 3. LEFT PANEL (wipes in from left, exits left)
// ============================================================================

var panelW = W * 0.6;
var panelH = H + 100;

var leftPanel = comp.layers.addSolid(c.red, "Panel_Left", panelW, panelH, 1);
leftPanel.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([panelW, panelH / 2]);

var leftPos = leftPanel.property("ADBE Transform Group").property("ADBE Position");
ease(leftPos, [
    [0.0, [-panelW + 100, cy]],     // Off screen left
    [0.35, [cx + 100, cy]],          // Overlap center
    [0.55, [cx + 100, cy]],          // Hold
    [0.95, [-panelW + 100, cy]]      // Exit left
]);

// ============================================================================
// 4. RIGHT PANEL (wipes in from right, exits right)
// ============================================================================

var rightPanel = comp.layers.addSolid(c.red, "Panel_Right", panelW, panelH, 1);
rightPanel.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, panelH / 2]);

var rightPos = rightPanel.property("ADBE Transform Group").property("ADBE Position");
ease(rightPos, [
    [0.0, [W + panelW - 100, cy]],   // Off screen right
    [0.35, [cx - 100, cy]],           // Overlap center
    [0.55, [cx - 100, cy]],           // Hold
    [0.95, [W + panelW - 100, cy]]    // Exit right
]);

// ============================================================================
// 5. COLLISION FLASH
// ============================================================================

var flash = comp.layers.addSolid(c.white, "Flash", W, H, 1);
var flashOp = flash.property("ADBE Transform Group").property("ADBE Opacity");
ease(flashOp, [
    [0.30, 0],
    [0.40, 70],
    [0.55, 0]
]);

// ============================================================================
// 6. LOGO BACKDROP (white oval)
// ============================================================================

var backdrop = comp.layers.addShape();
backdrop.name = "Logo_Backdrop";

var bdContent = backdrop.property("ADBE Root Vectors Group");
var bdGroup = bdContent.addProperty("ADBE Vector Group");
var bdEllipse = bdGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse");
bdEllipse.property("ADBE Vector Ellipse Size").setValue([600, 380]);

var bdFill = bdGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
bdFill.property("ADBE Vector Fill Color").setValue(c.white);

backdrop.property("ADBE Transform Group").property("ADBE Position").setValue([cx, cy]);

var bdScale = backdrop.property("ADBE Transform Group").property("ADBE Scale");
ease(bdScale, [
    [0.7, [0, 0]],
    [1.2, [100, 100]]
]);

// ============================================================================
// 7. LOGO PLACEHOLDER
// ============================================================================

var logo = comp.layers.addText("LOGO");
logo.name = "REPLACE_WITH_YOUR_LOGO";

var textProp = logo.property("ADBE Text Properties").property("ADBE Text Document");
var textDoc = textProp.value;
textDoc.font = "Arial-BoldMT";
textDoc.fontSize = 90;
textDoc.fillColor = c.blue;
textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
textProp.setValue(textDoc);

logo.property("ADBE Transform Group").property("ADBE Position").setValue([cx, cy + 30]);

var logoScale = logo.property("ADBE Transform Group").property("ADBE Scale");
var logoOp = logo.property("ADBE Transform Group").property("ADBE Opacity");
ease(logoScale, [
    [0.9, [50, 50]],
    [1.3, [100, 100]]
]);
ease(logoOp, [
    [0.9, 0],
    [1.2, 100]
]);

// ============================================================================
// 8. ACCENT LINES
// ============================================================================

var topLine = comp.layers.addSolid(c.blue, "Accent_Top", W + 200, 5, 1);
topLine.property("ADBE Transform Group").property("ADBE Position").setValue([cx, cy - 140]);
topLine.property("ADBE Transform Group").property("ADBE Rotate Z").setValue(-2);

var topLineScale = topLine.property("ADBE Transform Group").property("ADBE Scale");
ease(topLineScale, [
    [1.2, [0, 100]],
    [1.5, [100, 100]]
]);

var botLine = comp.layers.addSolid(c.blue, "Accent_Bottom", W + 200, 5, 1);
botLine.property("ADBE Transform Group").property("ADBE Position").setValue([cx, cy + 160]);
botLine.property("ADBE Transform Group").property("ADBE Rotate Z").setValue(2);

var botLineScale = botLine.property("ADBE Transform Group").property("ADBE Scale");
ease(botLineScale, [
    [1.25, [0, 100]],
    [1.55, [100, 100]]
]);

// ============================================================================
// 9. CORNER STARS
// ============================================================================

var starPositions = [
    [90, 70],
    [W - 90, 70],
    [90, H - 70],
    [W - 90, H - 70]
];

for (var s = 0; s < 4; s++) {
    var star = comp.layers.addShape();
    star.name = "Star_" + (s + 1);

    var starContent = star.property("ADBE Root Vectors Group");
    var starGroup = starContent.addProperty("ADBE Vector Group");
    var starPath = starGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Group");
    var starShape = starPath.property("ADBE Vector Shape");

    var verts = [];
    var outerR = 24;
    var innerR = 10;
    for (var p = 0; p < 10; p++) {
        var rad = (p % 2 === 0) ? outerR : innerR;
        var ang = (Math.PI / 2) + (Math.PI * p / 5);
        verts.push([Math.cos(ang) * rad, -Math.sin(ang) * rad]);
    }
    var sShape = new Shape();
    sShape.vertices = verts;
    sShape.closed = true;
    starShape.setValue(sShape);

    var starFill = starGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
    starFill.property("ADBE Vector Fill Color").setValue(c.white);

    star.property("ADBE Transform Group").property("ADBE Position").setValue(starPositions[s]);

    var starScale = star.property("ADBE Transform Group").property("ADBE Scale");
    var starDelay = 1.4 + (s * 0.08);
    ease(starScale, [
        [starDelay, [0, 0]],
        [starDelay + 0.25, [100, 100]]
    ]);
}

// ============================================================================
// LAYER ORDER (top to bottom in timeline = front to back visually)
// ============================================================================

// Move panels and flash to top (front)
leftPanel.moveToBeginning();
rightPanel.moveAfter(leftPanel);
flash.moveAfter(rightPanel);

// Background stays at bottom
bg.moveToEnd();

// ============================================================================
// DONE
// ============================================================================

comp.openInViewer();
app.endUndoGroup();

alert("Political Bumper Created!\n\n" +
      "Timeline:\n" +
      "0.0-0.35s: Panels slam together\n" +
      "0.35-0.55s: Full collision + flash\n" +
      "0.55-1.2s: Panels exit, starburst fans out\n" +
      "0.7-1.3s: Logo backdrop + logo reveal\n\n" +
      "Replace 'REPLACE_WITH_YOUR_LOGO' with your logo.");
