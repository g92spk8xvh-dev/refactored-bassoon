/*
 * POLITICAL BUMPER END GRAPHIC
 * Modern Political Motion Graphic with WPA-Style Americana
 *
 * Adobe After Effects ExtendScript
 *
 * USAGE: Run this script in After Effects via File > Scripts > Run Script File
 *
 * The script creates a complete animated bumper composition with:
 * - Sunburst rays (WPA style)
 * - Geometric stripes
 * - Star accents
 * - Logo placeholder
 * - Smooth transitions
 */

// ============================================================================
// CONFIGURATION - EASILY CUSTOMIZE COLORS AND SETTINGS HERE
// ============================================================================

var CONFIG = {
    // PRIMARY COLORS (RGB values 0-1)
    // Classic American political palette - easily change these values
    colors: {
        primary: {
            red:   [0.698, 0.132, 0.203],    // #B22234 - Classic Flag Red
            white: [1.000, 1.000, 1.000],    // #FFFFFF - Pure White
            blue:  [0.234, 0.234, 0.430]     // #3C3C6E - Classic Flag Blue
        },
        // Alternative color schemes (uncomment to use)
        // Modern Bold:
        // red:   [0.890, 0.145, 0.210],    // #E32536
        // white: [0.976, 0.976, 0.976],    // #F9F9F9
        // blue:  [0.129, 0.220, 0.478]     // #21387A

        // Vintage WPA:
        // red:   [0.765, 0.220, 0.173],    // #C3382C
        // white: [0.961, 0.949, 0.918],    // #F5F2EA
        // blue:  [0.184, 0.286, 0.388]     // #2F4963
    },

    // COMPOSITION SETTINGS
    comp: {
        name: "Political_Bumper_End",
        width: 1920,
        height: 1080,
        pixelAspect: 1,
        duration: 4,          // seconds
        frameRate: 30
    },

    // LOGO SETTINGS
    logo: {
        maxWidth: 400,        // Maximum logo width in pixels
        maxHeight: 200,       // Maximum logo height in pixels
        holdTime: 1.5         // How long logo stays on screen (seconds)
    },

    // ANIMATION TIMING
    timing: {
        raysStart: 0,
        raysEnd: 1.5,
        stripesStart: 0.3,
        stripesEnd: 2.0,
        starsStart: 0.8,
        starsEnd: 2.5,
        logoFadeIn: 1.8,
        logoFullOn: 2.2
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createComp() {
    var comp = app.project.items.addComp(
        CONFIG.comp.name,
        CONFIG.comp.width,
        CONFIG.comp.height,
        CONFIG.comp.pixelAspect,
        CONFIG.comp.duration,
        CONFIG.comp.frameRate
    );
    return comp;
}

function addSolidLayer(comp, name, color, width, height) {
    width = width || comp.width;
    height = height || comp.height;
    return comp.layers.addSolid(color, name, width, height, 1);
}

function setAnchorPoint(layer, x, y) {
    layer.property("Transform").property("Anchor Point").setValue([x, y]);
}

function setPosition(layer, x, y) {
    layer.property("Transform").property("Position").setValue([x, y]);
}

function setScale(layer, scaleX, scaleY) {
    scaleY = scaleY || scaleX;
    layer.property("Transform").property("Scale").setValue([scaleX, scaleY]);
}

function setRotation(layer, degrees) {
    layer.property("Transform").property("Rotation").setValue(degrees);
}

function setOpacity(layer, opacity) {
    layer.property("Transform").property("Opacity").setValue(opacity);
}

function addKeyframe(property, time, value) {
    property.setValueAtTime(time, value);
}

function applyEaseToKeyframes(property) {
    var numKeys = property.numKeys;
    for (var i = 1; i <= numKeys; i++) {
        var easeIn = new KeyframeEase(0.5, 75);
        var easeOut = new KeyframeEase(0.5, 75);
        property.setTemporalEaseAtKey(i, [easeIn], [easeOut]);
    }
}

function createShapeLayer(comp, name) {
    var shapeLayer = comp.layers.addShape();
    shapeLayer.name = name;
    return shapeLayer;
}

// ============================================================================
// WPA-STYLE SUNBURST RAYS
// ============================================================================

function createSunburstRays(comp) {
    var colors = CONFIG.colors.primary;
    var numRays = 24;
    var rayGroup = createShapeLayer(comp, "WPA_Sunburst_Rays");

    var contents = rayGroup.property("Contents");

    for (var i = 0; i < numRays; i++) {
        var angle = (360 / numRays) * i;
        var rayColor = (i % 2 === 0) ? colors.red : colors.blue;

        // Add a group for each ray
        var group = contents.addProperty("ADBE Vector Group");
        group.name = "Ray_" + (i + 1);

        // Create triangle path for ray
        var pathGroup = group.property("Contents").addProperty("ADBE Vector Shape - Group");
        var path = pathGroup.property("Path");

        // Triangle vertices (elongated ray shape)
        var rayLength = 1500;
        var rayWidth = Math.tan((360 / numRays / 2) * Math.PI / 180) * rayLength;

        var shape = new Shape();
        shape.vertices = [
            [0, 0],
            [-rayWidth, -rayLength],
            [rayWidth, -rayLength]
        ];
        shape.closed = true;
        path.setValue(shape);

        // Add fill
        var fill = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue(rayColor);
        fill.property("Opacity").setValue(85);

        // Transform the ray group
        var transform = group.property("Transform");
        transform.property("Rotation").setValue(angle);
    }

    // Position sunburst at center-bottom (WPA style - rising sun)
    setPosition(rayGroup, comp.width / 2, comp.height + 200);

    // Animate scale
    var scaleProp = rayGroup.property("Transform").property("Scale");
    addKeyframe(scaleProp, CONFIG.timing.raysStart, [0, 0]);
    addKeyframe(scaleProp, CONFIG.timing.raysEnd, [100, 100]);
    applyEaseToKeyframes(scaleProp);

    // Animate rotation for dynamic effect
    var rotProp = rayGroup.property("Transform").property("Rotation");
    addKeyframe(rotProp, CONFIG.timing.raysStart, -15);
    addKeyframe(rotProp, CONFIG.comp.duration, 15);

    return rayGroup;
}

// ============================================================================
// GEOMETRIC STRIPES (WPA STYLE)
// ============================================================================

function createGeometricStripes(comp) {
    var colors = CONFIG.colors.primary;
    var stripeGroup = createShapeLayer(comp, "WPA_Stripes");
    var contents = stripeGroup.property("Contents");

    var stripeHeight = 80;
    var numStripes = 7;
    var stripeColors = [
        colors.red, colors.white, colors.blue,
        colors.white, colors.red, colors.white, colors.blue
    ];

    for (var i = 0; i < numStripes; i++) {
        var group = contents.addProperty("ADBE Vector Group");
        group.name = "Stripe_" + (i + 1);

        // Create rectangle for stripe
        var rect = group.property("Contents").addProperty("ADBE Vector Shape - Rect");
        rect.property("Size").setValue([comp.width * 2, stripeHeight]);

        // Add fill
        var fill = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue(stripeColors[i]);

        // Position each stripe
        var yPos = comp.height - (stripeHeight * (i + 0.5)) - 100;
        group.property("Transform").property("Position").setValue([comp.width / 2, yPos]);

        // Animate each stripe sliding in from alternating sides
        var posProp = group.property("Transform").property("Position");
        var startX = (i % 2 === 0) ? -comp.width : comp.width * 2;
        var delay = i * 0.08;

        addKeyframe(posProp, CONFIG.timing.stripesStart + delay, [startX, yPos]);
        addKeyframe(posProp, CONFIG.timing.stripesEnd + delay, [comp.width / 2, yPos]);
        applyEaseToKeyframes(posProp);
    }

    // Slight rotation for dynamic diagonal look
    setRotation(stripeGroup, -5);

    return stripeGroup;
}

// ============================================================================
// STAR ACCENTS
// ============================================================================

function createStarShape(group, size) {
    var pathGroup = group.property("Contents").addProperty("ADBE Vector Shape - Group");
    var path = pathGroup.property("Path");

    var shape = new Shape();
    var points = 5;
    var outerRadius = size;
    var innerRadius = size * 0.4;
    var vertices = [];

    for (var i = 0; i < points * 2; i++) {
        var radius = (i % 2 === 0) ? outerRadius : innerRadius;
        var angle = (Math.PI / 2) + (Math.PI * i / points);
        vertices.push([
            Math.cos(angle) * radius,
            -Math.sin(angle) * radius
        ]);
    }

    shape.vertices = vertices;
    shape.closed = true;
    path.setValue(shape);
}

function createStarAccents(comp) {
    var colors = CONFIG.colors.primary;
    var starLayer = createShapeLayer(comp, "Star_Accents");
    var contents = starLayer.property("Contents");

    // Star positions and sizes (positioned for political bumper aesthetic)
    var stars = [
        { x: comp.width * 0.15, y: comp.height * 0.25, size: 60, color: colors.white },
        { x: comp.width * 0.85, y: comp.height * 0.25, size: 60, color: colors.white },
        { x: comp.width * 0.1, y: comp.height * 0.5, size: 40, color: colors.white },
        { x: comp.width * 0.9, y: comp.height * 0.5, size: 40, color: colors.white },
        { x: comp.width * 0.2, y: comp.height * 0.15, size: 30, color: colors.red },
        { x: comp.width * 0.8, y: comp.height * 0.15, size: 30, color: colors.red },
        { x: comp.width * 0.5, y: comp.height * 0.12, size: 80, color: colors.white }
    ];

    for (var i = 0; i < stars.length; i++) {
        var star = stars[i];
        var group = contents.addProperty("ADBE Vector Group");
        group.name = "Star_" + (i + 1);

        createStarShape(group, star.size);

        // Add fill
        var fill = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue(star.color);

        // Add stroke for definition
        var stroke = group.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
        stroke.property("Color").setValue(colors.blue);
        stroke.property("Stroke Width").setValue(2);

        // Position
        group.property("Transform").property("Position").setValue([star.x, star.y]);

        // Animate scale with staggered timing
        var scaleProp = group.property("Transform").property("Scale");
        var delay = i * 0.1;
        addKeyframe(scaleProp, CONFIG.timing.starsStart + delay, [0, 0]);
        addKeyframe(scaleProp, CONFIG.timing.starsEnd + delay, [100, 100]);
        applyEaseToKeyframes(scaleProp);

        // Add subtle rotation animation
        var rotProp = group.property("Transform").property("Rotation");
        addKeyframe(rotProp, CONFIG.timing.starsStart + delay, -180);
        addKeyframe(rotProp, CONFIG.timing.starsEnd + delay, 0);
        applyEaseToKeyframes(rotProp);
    }

    return starLayer;
}

// ============================================================================
// BACKGROUND
// ============================================================================

function createBackground(comp) {
    var colors = CONFIG.colors.primary;

    // Main background
    var bg = addSolidLayer(comp, "Background", colors.blue);
    bg.moveToEnd();

    // Vignette overlay for depth
    var vignette = addSolidLayer(comp, "Vignette", [0, 0, 0]);
    vignette.moveToEnd();

    // Add radial gradient effect for vignette
    var radialWipe = vignette.property("Effects").addProperty("ADBE Radial Wipe");
    radialWipe.property("Transition Completion").setValue(0);

    // Use a simple approach - just darken edges with opacity
    setOpacity(vignette, 0);

    return bg;
}

// ============================================================================
// LOGO PLACEHOLDER
// ============================================================================

function createLogoPlaceholder(comp) {
    var colors = CONFIG.colors.primary;
    var logoLayer = createShapeLayer(comp, "LOGO_PLACEHOLDER");
    var contents = logoLayer.property("Contents");

    // Create a placeholder rectangle where logo will go
    var group = contents.addProperty("ADBE Vector Group");
    group.name = "Logo_Box";

    var rect = group.property("Contents").addProperty("ADBE Vector Shape - Rect");
    rect.property("Size").setValue([CONFIG.logo.maxWidth, CONFIG.logo.maxHeight]);
    rect.property("Roundness").setValue(10);

    // Subtle fill
    var fill = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
    fill.property("Color").setValue(colors.white);
    fill.property("Opacity").setValue(95);

    // Border stroke
    var stroke = group.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Color").setValue(colors.blue);
    stroke.property("Stroke Width").setValue(4);

    // Add "LOGO" text indicator
    var textLayer = comp.layers.addText("YOUR LOGO");
    textLayer.name = "Logo_Text_Indicator";

    var textProp = textLayer.property("Source Text");
    var textDoc = textProp.value;
    textDoc.font = "Arial-BoldMT";
    textDoc.fontSize = 36;
    textDoc.fillColor = colors.blue;
    textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
    textProp.setValue(textDoc);

    // Center both elements
    setPosition(logoLayer, comp.width / 2, comp.height / 2 - 50);
    setPosition(textLayer, comp.width / 2, comp.height / 2 - 40);

    // Animate logo fade in and scale
    var scaleProp = logoLayer.property("Transform").property("Scale");
    addKeyframe(scaleProp, CONFIG.timing.logoFadeIn, [80, 80]);
    addKeyframe(scaleProp, CONFIG.timing.logoFullOn, [100, 100]);
    applyEaseToKeyframes(scaleProp);

    var opacityProp = logoLayer.property("Transform").property("Opacity");
    addKeyframe(opacityProp, CONFIG.timing.logoFadeIn, 0);
    addKeyframe(opacityProp, CONFIG.timing.logoFullOn, 100);
    applyEaseToKeyframes(opacityProp);

    // Same for text indicator
    var textScaleProp = textLayer.property("Transform").property("Scale");
    addKeyframe(textScaleProp, CONFIG.timing.logoFadeIn, [80, 80]);
    addKeyframe(textScaleProp, CONFIG.timing.logoFullOn, [100, 100]);
    applyEaseToKeyframes(textScaleProp);

    var textOpacityProp = textLayer.property("Transform").property("Opacity");
    addKeyframe(textOpacityProp, CONFIG.timing.logoFadeIn, 0);
    addKeyframe(textOpacityProp, CONFIG.timing.logoFullOn, 100);
    applyEaseToKeyframes(textOpacityProp);

    return logoLayer;
}

// ============================================================================
// TITLE BAR / LOWER THIRD ELEMENT
// ============================================================================

function createTitleBar(comp) {
    var colors = CONFIG.colors.primary;
    var barLayer = createShapeLayer(comp, "Title_Bar");
    var contents = barLayer.property("Contents");

    // Main bar
    var mainBar = contents.addProperty("ADBE Vector Group");
    mainBar.name = "Main_Bar";

    var rect = mainBar.property("Contents").addProperty("ADBE Vector Shape - Rect");
    rect.property("Size").setValue([comp.width + 100, 120]);

    var fill = mainBar.property("Contents").addProperty("ADBE Vector Graphic - Fill");
    fill.property("Color").setValue(colors.red);

    // Accent line
    var accentBar = contents.addProperty("ADBE Vector Group");
    accentBar.name = "Accent_Line";

    var accentRect = accentBar.property("Contents").addProperty("ADBE Vector Shape - Rect");
    accentRect.property("Size").setValue([comp.width + 100, 8]);

    var accentFill = accentBar.property("Contents").addProperty("ADBE Vector Graphic - Fill");
    accentFill.property("Color").setValue(colors.white);

    accentBar.property("Transform").property("Position").setValue([0, -60]);

    // Position bar at bottom
    setPosition(barLayer, comp.width / 2, comp.height + 80);
    setRotation(barLayer, -3);

    // Animate bar sliding up
    var posProp = barLayer.property("Transform").property("Position");
    addKeyframe(posProp, 0.5, [comp.width / 2, comp.height + 150]);
    addKeyframe(posProp, 1.2, [comp.width / 2, comp.height - 60]);
    applyEaseToKeyframes(posProp);

    return barLayer;
}

// ============================================================================
// FRAME / BORDER ELEMENT
// ============================================================================

function createFrame(comp) {
    var colors = CONFIG.colors.primary;
    var frameLayer = createShapeLayer(comp, "Frame_Border");
    var contents = frameLayer.property("Contents");

    var borderWidth = 20;

    // Create frame as 4 rectangles
    var sides = [
        { name: "Top", w: comp.width, h: borderWidth, x: comp.width/2, y: borderWidth/2 },
        { name: "Bottom", w: comp.width, h: borderWidth, x: comp.width/2, y: comp.height - borderWidth/2 },
        { name: "Left", w: borderWidth, h: comp.height, x: borderWidth/2, y: comp.height/2 },
        { name: "Right", w: borderWidth, h: comp.height, x: comp.width - borderWidth/2, y: comp.height/2 }
    ];

    for (var i = 0; i < sides.length; i++) {
        var side = sides[i];
        var group = contents.addProperty("ADBE Vector Group");
        group.name = "Border_" + side.name;

        var rect = group.property("Contents").addProperty("ADBE Vector Shape - Rect");
        rect.property("Size").setValue([side.w, side.h]);

        var fill = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue(colors.blue);

        group.property("Transform").property("Position").setValue([side.x, side.y]);
    }

    // Animate frame appearing
    var opacityProp = frameLayer.property("Transform").property("Opacity");
    addKeyframe(opacityProp, 0, 0);
    addKeyframe(opacityProp, 0.8, 100);
    applyEaseToKeyframes(opacityProp);

    return frameLayer;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
    // Start undo group
    app.beginUndoGroup("Create Political Bumper");

    try {
        // Create main composition
        var comp = createComp();

        // Build layers (order matters - first created = top layer)
        createFrame(comp);
        createLogoPlaceholder(comp);
        createStarAccents(comp);
        createTitleBar(comp);
        createGeometricStripes(comp);
        createSunburstRays(comp);
        createBackground(comp);

        // Open the composition
        comp.openInViewer();

        alert("Political Bumper Created Successfully!\n\n" +
              "TO CUSTOMIZE:\n" +
              "1. Colors: Edit the CONFIG.colors section at the top of the script\n" +
              "2. Logo: Replace the 'LOGO_PLACEHOLDER' layer with your logo\n" +
              "3. Timing: Adjust CONFIG.timing values\n\n" +
              "TIP: Select 'LOGO_PLACEHOLDER' layer and use Edit > Replace With to add your logo");

    } catch (error) {
        alert("Error creating bumper: " + error.toString());
    }

    // End undo group
    app.endUndoGroup();
}

// Run the script
main();
