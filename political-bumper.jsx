/*
 * POLITICAL BUMPER END GRAPHIC
 * Panel Collision → Starburst Fan → Logo Reveal
 *
 * Adobe After Effects ExtendScript
 * Run via: File > Scripts > Run Script File
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

var CONFIG = {
    colors: {
        red:   [0.698, 0.132, 0.203],    // #B22234 - Flag Red
        white: [1.000, 1.000, 1.000],    // #FFFFFF - White
        blue:  [0.133, 0.173, 0.298]     // #222C4C - Deep Navy
    },
    comp: {
        name: "Political_Bumper_End",
        width: 1920,
        height: 1080,
        duration: 3.5,
        frameRate: 30
    },
    logo: {
        width: 500,
        height: 280
    }
};

// ============================================================================
// UTILITIES
// ============================================================================

function addKeyframes(prop, keyframes) {
    for (var i = 0; i < keyframes.length; i++) {
        prop.setValueAtTime(keyframes[i][0], keyframes[i][1]);
    }
    for (var j = 1; j <= prop.numKeys; j++) {
        var ease = new KeyframeEase(0.33, 85);
        prop.setTemporalEaseAtKey(j, [ease], [ease]);
    }
}

function addKeyframesSnappy(prop, keyframes) {
    for (var i = 0; i < keyframes.length; i++) {
        prop.setValueAtTime(keyframes[i][0], keyframes[i][1]);
    }
    for (var j = 1; j <= prop.numKeys; j++) {
        var easeIn = new KeyframeEase(0.1, 33);
        var easeOut = new KeyframeEase(0.8, 90);
        prop.setTemporalEaseAtKey(j, [easeIn], [easeOut]);
    }
}

// ============================================================================
// BUILD
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
    // BACKGROUND - Navy
    // ========================================================================
    var bg = comp.layers.addSolid(c.blue, "BG_Navy", comp.width, comp.height, 1);
    bg.moveToEnd();

    // ========================================================================
    // STARBURST RAYS - These fan OUT from center to reveal logo
    // Start scaled to 0 (hidden), then burst outward
    // Each ray is a wedge that rotates outward from center
    // ========================================================================
    var numRays = 12;
    var rayLayers = [];

    for (var i = 0; i < numRays; i++) {
        var rayLayer = comp.layers.addShape();
        rayLayer.name = "Ray_" + (i + 1);
        var contents = rayLayer.property("Contents");

        var grp = contents.addProperty("ADBE Vector Group");

        // Create wedge/triangle shape
        var pathProp = grp.property("Contents").addProperty("ADBE Vector Shape - Group");
        var shape = new Shape();

        var wedgeAngle = (360 / numRays) * (Math.PI / 180);
        var rayLength = 1600;
        var halfWedge = wedgeAngle / 2;

        // Triangle from center outward
        shape.vertices = [
            [0, 0],
            [Math.sin(-halfWedge) * rayLength, -Math.cos(-halfWedge) * rayLength],
            [Math.sin(halfWedge) * rayLength, -Math.cos(halfWedge) * rayLength]
        ];
        shape.closed = true;
        pathProp.property("Path").setValue(shape);

        // Fill - alternate red and darker red for depth
        var fill = grp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        var rayColor = (i % 2 === 0) ? c.red : [0.55, 0.10, 0.16];
        fill.property("Color").setValue(rayColor);

        // Position at center
        rayLayer.property("Transform").property("Position").setValue([cx, cy]);

        // Base rotation for this ray's position in the circle
        var baseAngle = (360 / numRays) * i;

        // ANIMATION: Rays start clustered (collapsed), then fan out
        var rotProp = rayLayer.property("Transform").property("Rotation");

        // At collision moment (0.5s): all rays point UP (clustered together)
        // Then they rotate to their final spread positions
        addKeyframesSnappy(rotProp, [
            [0.0, 90],                    // Start horizontal (hidden by panels)
            [0.5, 90],                    // Still horizontal at collision
            [0.55, 90],                   // Brief hold
            [1.1, baseAngle]              // Fan out to final position
        ]);

        // Scale: start at 0, burst out
        var scaleProp = rayLayer.property("Transform").property("Scale");
        addKeyframes(scaleProp, [
            [0.5, [0, 0]],
            [0.55, [20, 20]],
            [1.0, [100, 100]]
        ]);

        rayLayers.push(rayLayer);
    }

    // Move all rays behind the panels (for now)
    for (var r = 0; r < rayLayers.length; r++) {
        rayLayers[r].moveToEnd();
        rayLayers[r].moveAfter(bg);
    }

    // ========================================================================
    // LEFT PANEL - Wipes in, fully covers left half + overlap
    // ========================================================================
    var leftPanel = comp.layers.addSolid(c.red, "Panel_Left", comp.width * 0.6, comp.height + 100, 1);
    leftPanel.property("Transform").property("Anchor Point").setValue([comp.width * 0.6, (comp.height + 100) / 2]);

    var leftPos = leftPanel.property("Transform").property("Position");
    addKeyframes(leftPos, [
        [0.0, [-comp.width * 0.3, cy]],      // Off left
        [0.4, [cx + 50, cy]],                 // Overlap past center
        [0.55, [cx + 50, cy]],                // Hold at collision
        [0.9, [-comp.width * 0.3, cy]]        // Exit left
    ]);

    // ========================================================================
    // RIGHT PANEL - Wipes in, fully covers right half + overlap
    // ========================================================================
    var rightPanel = comp.layers.addSolid(c.red, "Panel_Right", comp.width * 0.6, comp.height + 100, 1);
    rightPanel.property("Transform").property("Anchor Point").setValue([0, (comp.height + 100) / 2]);

    var rightPos = rightPanel.property("Transform").property("Position");
    addKeyframes(rightPos, [
        [0.0, [comp.width + comp.width * 0.3, cy]],  // Off right
        [0.4, [cx - 50, cy]],                         // Overlap past center
        [0.55, [cx - 50, cy]],                        // Hold at collision
        [0.9, [comp.width + comp.width * 0.3, cy]]    // Exit right
    ]);

    // ========================================================================
    // WHITE FLASH - At collision moment
    // ========================================================================
    var flash = comp.layers.addSolid(c.white, "Collision_Flash", comp.width, comp.height, 1);
    var flashOp = flash.property("Transform").property("Opacity");
    addKeyframes(flashOp, [
        [0.38, 0],
        [0.45, 80],
        [0.6, 0]
    ]);

    // ========================================================================
    // LOGO BACKDROP - White circle/rectangle that scales up behind logo
    // ========================================================================
    var logoBack = comp.layers.addShape();
    logoBack.name = "Logo_Backdrop";
    var lbContent = logoBack.property("Contents");

    var lbGrp = lbContent.addProperty("ADBE Vector Group");
    var lbEllipse = lbGrp.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
    lbEllipse.property("Size").setValue([CONFIG.logo.width + 150, CONFIG.logo.height + 120]);

    var lbFill = lbGrp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
    lbFill.property("Color").setValue(c.white);

    logoBack.property("Transform").property("Position").setValue([cx, cy]);

    var lbScale = logoBack.property("Transform").property("Scale");
    addKeyframes(lbScale, [
        [0.8, [0, 0]],
        [1.3, [100, 100]]
    ]);

    // ========================================================================
    // LOGO PLACEHOLDER
    // ========================================================================
    var logoText = comp.layers.addText("LOGO");
    logoText.name = "REPLACE_WITH_LOGO";
    var textProp = logoText.property("Source Text");
    var textDoc = textProp.value;
    textDoc.font = "Arial-BoldMT";
    textDoc.fontSize = 80;
    textDoc.fillColor = c.blue;
    textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
    textProp.setValue(textDoc);

    logoText.property("Transform").property("Position").setValue([cx, cy + 25]);

    var logoScale = logoText.property("Transform").property("Scale");
    var logoOp = logoText.property("Transform").property("Opacity");
    addKeyframes(logoScale, [
        [1.0, [0, 0]],
        [1.4, [100, 100]]
    ]);
    addKeyframes(logoOp, [
        [1.0, 0],
        [1.3, 100]
    ]);

    // ========================================================================
    // ACCENT LINES - Thin lines framing logo
    // ========================================================================
    var lineY = [cy - 120, cy + 140];
    var lineRot = [-2, 2];

    for (var ln = 0; ln < 2; ln++) {
        var line = comp.layers.addSolid(c.blue, "Accent_Line_" + (ln + 1), comp.width, 4, 1);
        line.property("Transform").property("Position").setValue([cx, lineY[ln]]);
        line.property("Transform").property("Rotation").setValue(lineRot[ln]);

        var lineScale = line.property("Transform").property("Scale");
        addKeyframes(lineScale, [
            [1.3 + ln * 0.1, [0, 100]],
            [1.6 + ln * 0.1, [100, 100]]
        ]);
    }

    // ========================================================================
    // CORNER STARS
    // ========================================================================
    var starPos = [
        [100, 80], [comp.width - 100, 80],
        [100, comp.height - 80], [comp.width - 100, comp.height - 80]
    ];

    for (var s = 0; s < 4; s++) {
        var star = comp.layers.addShape();
        star.name = "Star_" + (s + 1);
        var starContent = star.property("Contents");
        var starGrp = starContent.addProperty("ADBE Vector Group");

        var starPath = starGrp.property("Contents").addProperty("ADBE Vector Shape - Group");
        var starShape = new Shape();
        var verts = [];
        for (var p = 0; p < 10; p++) {
            var rad = (p % 2 === 0) ? 22 : 9;
            var ang = (Math.PI / 2) + (Math.PI * p / 5);
            verts.push([Math.cos(ang) * rad, -Math.sin(ang) * rad]);
        }
        starShape.vertices = verts;
        starShape.closed = true;
        starPath.property("Path").setValue(starShape);

        var starFill = starGrp.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        starFill.property("Color").setValue(c.white);

        star.property("Transform").property("Position").setValue(starPos[s]);

        var starSc = star.property("Transform").property("Scale");
        var delay = 1.5 + s * 0.07;
        addKeyframes(starSc, [
            [delay, [0, 0]],
            [delay + 0.2, [100, 100]]
        ]);
    }

    // Move panels to front
    leftPanel.moveToBeginning();
    rightPanel.moveAfter(leftPanel);
    flash.moveAfter(rightPanel);

    comp.openInViewer();
    app.endUndoGroup();

    alert("Political Bumper Created!\n\n" +
          "MOTION: Panels collide → Starburst fans out → Logo revealed\n\n" +
          "Replace 'REPLACE_WITH_LOGO' layer with your logo.");
}

buildBumper();
