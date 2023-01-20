
I've been using panon for a while, and I've never really been happy with how the default shaders work. Not enough customization-- and the biggest thing, a complete lack of smoothing.
## To that end, I present, the
# Highly Configurable Panon Shader
Featuring configurable smoothing, bars, colors, and damn near everything else!
## Customization
### Bars
HCPS features several bespoke features for bars. The only thing it lacks is circles; however, there are several fantastic shaders for that, and quite honestly the math makes my head hurt.
#### bar_width
The width of the bars
#### bar_gap
The gap between bars
#### bar_vertical_section_gap
The gap between vertical sections of bars
#### bar_vertical_section_height
The height of each vertical section in the bars
#### start_at_middle
If turned on, the bars will start at the middle, and expand outwards evenly.
#### round_ends
If turned on, the ends will be rounded.

### Colors
There are two main color modes: default, and custom. Default coloring just uses the panon color modes, and it's what I recommend for most people. Here are the related settings:
#### default_colors
If turned on, the mode will be set to default.
#### colors_in_block
If turned on, colors will "snap" between bars, rather than being a gradient.
#### color_from_y
If turned on, the color will be based off of the Y position, rather than the X position.
### Advanced colors
This is for people like me who want full customization. Inside of the image.frag file, there is a variable labeled "colors". If you add colors to it, bars will be sequentially colored based on the array (if it reaches the end, it will simply loop around). The syntax looks like this:
```glsl
const vec4 colors[] = vec4[](
	vec4(r,g,b,a),
	vec4(255,255,255,255)
);
```
Remember to add a comma after each entry, **except for the last one**. If you get any of the syntax wrong, even slightly, it **will not work**. If you need help with this, look up "glsl array" and "glsl vec4". If you still can't figure it out, you probably shouldn't be using the advanced colors, but if you *really* want to, shoot me an email at oranroha@gmail.com with the colors you want, and I'll make something for you to copy/paste.
### Smoothing
This is probably the biggest benefit of HCPS. Generally speaking, panon shaders are very jittery and sensitive to very small inputs. I've implemented two seperate methods for smoothing, which you can set using the **smooth_mode** setting, then you can adjust the amount with the **smooth_amount** setting. Here are the modes in more detail:
#### Mode 0
Smoothing disabled.
#### Mode 1
Smoothing is enabled, and does not scale with difference in amount.
#### Mode 2
Smoothing is enabled, with scaling based on differences in amount-- this is the mode I recommend, as it reduces jitter from small changes while still allowing snappy response to large changes.

## License
I'm not entirely certain which license to use, because it uses some code from rbn42-bar in rbn42's [plasma-effects](https://github.com/rbn42?tab=repositories&q=&type=&language=&sort=stargazers) repository, so I'll just use the same one he uses.
### Insert GPLv3 here lol
