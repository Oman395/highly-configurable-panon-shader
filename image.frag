#version 130

 // If true, the bars start at the middle and go down/up, mirrored
#define MIDDLE_START $start_at_middle
// If true, the ends are rounded (shocking)
#define ROUND_ENDS $round_ends
// Width of bars, in px
#define BAR_WIDTH $bar_width
// Gap between bars, in px
#define BAR_GAP $bar_gap
// Gap in between vertical sections of bar, in px
#define BAR_VERTICAL_GAP $bar_vertical_section_gap
// Height of vertical sections of bar, in px
#define BAR_VERTICAL_HEIGHT $bar_vertical_section_height
// If true, then we will ignore any sections that are smaller than the height of the vertical height
#define BAR_VERTICAL_FORCE_FULL $bar_snap_vertical_sections
// Blend along user colors
#define USER_COLORS $default_colors
// Make each bar a uniform color
#define BLOCK_COLORS $colors_in_block
// Make the colors based on y instead of x
#define VERTICAL_COLORS $color_from_y
// If true, makes sure that at least some color is left behind
#define USE_MINIMUM $use_minimum
// Minimum height, in px
// If negative, set to radius
#define MINIMUM $minimum
// If the value goes below this, then USE_MINIMUM is overrided
#define THRESHOLD $threshold

// These are the alternative to USER_COLORS, each one is an rgba color (0-255) that the bar colors will cycle through
const vec4 colors[] = vec4[](
    vec4(255)
);

// From rbn42-bar
vec4 mean(float _from,float _to) {

    if(_from>1.0)
        return vec4(0);

    _from=iChannelResolution[1].x*_from;
    _to=iChannelResolution[1].x*_to;

    vec4 v=texelFetch(iChannel2, ivec2(_from,0),0) * (1.0-fract(_from)) ;

    for(float i=ceil(_from); i<floor(_to); i++)
        v+=texelFetch(iChannel2, ivec2(i,0),0) ;

    if(floor(_to)>floor(_from))
        v+=texelFetch(iChannel2,ivec2(_to,0),0)* fract(_to);
    else
        v-=texelFetch(iChannel2,ivec2(_to,0),0)*(1.0- fract(_to));

    return v/(_to-_from);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord / iResolution.xy;
    float gap = BAR_GAP / iResolution.x;
    float width = BAR_WIDTH / iResolution.x;
    float total = gap + width;
    float gapY = BAR_VERTICAL_GAP / iResolution.y;
    float height = BAR_VERTICAL_HEIGHT / iResolution.y;
    float totalY = height + gapY;
    float modded = mod(uv.x, total);
    float moddedY = mod(uv.y, totalY);
    float minimum = MINIMUM / iResolution.y;
    float radius = width * (iResolution.x / iResolution.y);
    if(!MIDDLE_START) radius /= 2.0;
    if(minimum < 0.0) minimum = radius;
    if(modded > width || moddedY > height) {
        fragColor = vec4(0);
        return;
    };
    float floored = floor(uv.x / total) * total;
    if(MIDDLE_START) {
        uv.y -= 0.5;
        uv.y *= 2.0;
        uv.y = abs(uv.y);
    }
    // Mask
    float heightSound = mean(floored, floored + total).r;
    if(heightSound > 1.0 - radius && ROUND_ENDS) heightSound = 1.0 - radius;
    if(USE_MINIMUM && heightSound < minimum) heightSound = minimum;
    if(heightSound < uv.y) {
        fragColor = vec4(0);
        return;
    }
    if(BAR_VERTICAL_FORCE_FULL && floor(heightSound / totalY) * totalY < uv.y) {
        fragColor = vec4(0);
        return;
    }
    if(ROUND_ENDS && heightSound - uv.y <= radius) {
        // We want to be a circle, so we can get our distance from the center of the bar where the circle would be
        // If the distance is greater than the radius, we can be set to 0
        float yMod = uv.y - (heightSound - radius);
        // We can turn this into x with some basic trig
        yMod /= radius;
        float x = sqrt(1.0 - pow(yMod, 2.0));
        x = 1.0 - x;
        x *= width;
        float xMod = mod(uv.x, total);
        // Figure out if we are within the range we should be
        if(xMod < x / 2.0 || xMod > width - x / 2.0) {
            fragColor = vec4(0);
            return;
        }
    }

    // If we are past here, then we know for a fact we should be colored, and we can color ourselves
    float x = uv.x;
    if(VERTICAL_COLORS) x = uv.y;
    if(!USER_COLORS) {
        fragColor = colors[int(floor(x / total)) % colors.length()] / 255.0;
        return;
    }
    // Get a copy of x that has the gaps removed, scaled between 0 and 1
    float xRm;
    if(VERTICAL_COLORS) {
        xRm = x - floor(x / totalY) * gapY;
        xRm /= 1.0 - gapY * (1.0 / totalY);
    }
    else {
        xRm = x - floor(x / total) * gap;
        xRm /= 1.0 - gap * (1.0 / total);
    }
    if(BLOCK_COLORS) {
        if(VERTICAL_COLORS) xRm = floor(xRm / totalY) * totalY;
        else xRm = floor((xRm) / total) * total;
    }
    fragColor = vec4(getRGB(xRm), 1);
}
