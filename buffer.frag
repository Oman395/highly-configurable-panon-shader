#version 130

#define SMOOTH_MODE $smooth_mode
#define SMOOTH_AMOUNT $smooth_amount

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord / iResolution.xy;
    vec4 new = texture(iChannel1, uv);
    if(SMOOTH_MODE == 0) {
        // No smoothing
        fragColor = new;
        return;
    }
    vec4 texAt = texture(iChannel2, uv);
    if(SMOOTH_MODE == 1) {
        // Simple smoothing, no difference from size of change
        fragColor = texAt * SMOOTH_AMOUNT + new * (1.0 - SMOOTH_AMOUNT);
    } else {
        // Smoothing based on delta
        vec4 delta = texture(iChannel2, uv) - texture(iChannel1, uv);
        float leng = length(delta) / 2.0;
        float amnt = max(pow(leng, SMOOTH_AMOUNT), (1.0 - SMOOTH_AMOUNT));
        fragColor = texture(iChannel2, uv) * (1.0 - amnt) + texture(iChannel1, uv) * amnt;
    }
}
