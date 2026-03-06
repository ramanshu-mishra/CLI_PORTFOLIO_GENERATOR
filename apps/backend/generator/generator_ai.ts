import figlet from "figlet";
import gradient, {
	atlas,
	cristal,
	fruit,
	instagram,
	mind,
	morning,
	passion,
	pastel,
	rainbow,
	retro,
	summer,
	teen,
	vice,
} from "gradient-string";
import chalk from "chalk";
import {
	ChalkBackgroundColor,
	ChalkBackgroundColorSpec,
	ChalkColorSpec,
	ChalkForegroundColor,
	ChalkModifier,
	GeneratePortfolioCliRequest,
	GradientPreset,
	PortfolioNode,
	PortfolioSectionRequest,
	TextAlign,
	TextStyleOptions,
} from "./interfaces";

type GradientAliasFunction = ((input: string) => string) & {
	multiline: (input: string) => string;
};

const FOREGROUND_COLORS = new Set<ChalkForegroundColor>([
	"black",
	"red",
	"green",
	"yellow",
	"blue",
	"magenta",
	"cyan",
	"white",
	"gray",
	"grey",
	"blackBright",
	"redBright",
	"greenBright",
	"yellowBright",
	"blueBright",
	"magentaBright",
	"cyanBright",
	"whiteBright",
]);

const BACKGROUND_COLORS = new Set<ChalkBackgroundColor>([
	"bgBlack",
	"bgRed",
	"bgGreen",
	"bgYellow",
	"bgBlue",
	"bgMagenta",
	"bgCyan",
	"bgWhite",
	"bgGray",
	"bgGrey",
	"bgBlackBright",
	"bgRedBright",
	"bgGreenBright",
	"bgYellowBright",
	"bgBlueBright",
	"bgMagentaBright",
	"bgCyanBright",
	"bgWhiteBright",
]);

const MODIFIERS = new Set<ChalkModifier>([
	"reset",
	"bold",
	"dim",
	"italic",
	"underline",
	"overline",
	"inverse",
	"hidden",
	"strikethrough",
	"visible",
]);

const GRADIENT_PRESETS: Record<GradientPreset, GradientAliasFunction> = {
	atlas,
	cristal,
	teen,
	mind,
	morning,
	vice,
	passion,
	fruit,
	instagram,
	retro,
	summer,
	rainbow,
	pastel,
};

const ANSI_REGEX = /\u001B\[[0-?]*[ -/]*[@-~]/g;

function isPortfolioRequest(
	input: PortfolioNode | GeneratePortfolioCliRequest,
): input is GeneratePortfolioCliRequest {
	return "sections" in input;
}

function mergeStyle(
	inheritedStyle?: TextStyleOptions,
	ownStyle?: TextStyleOptions,
): TextStyleOptions | undefined {
	if (!inheritedStyle) {
		return ownStyle;
	}

	if (!ownStyle) {
		return inheritedStyle;
	}

	return {
		...inheritedStyle,
		...ownStyle,
		gradient: ownStyle.gradient ?? inheritedStyle.gradient,
		figlet: {
			...inheritedStyle.figlet,
			...ownStyle.figlet,
		},
		chalk: {
			...inheritedStyle.chalk,
			...ownStyle.chalk,
			modifiers: ownStyle.chalk?.modifiers ?? inheritedStyle.chalk?.modifiers,
			foreground: ownStyle.chalk?.foreground ?? inheritedStyle.chalk?.foreground,
			background: ownStyle.chalk?.background ?? inheritedStyle.chalk?.background,
		},
	};
}

function applyFiglet(text: string, style?: TextStyleOptions): string {
	const figletOptions = style?.figlet;
	if (!figletOptions || figletOptions.enabled === false) {
		return text;
	}

	const hasRenderableConfig =
		figletOptions.enabled === true ||
		figletOptions.font !== undefined ||
		figletOptions.horizontalLayout !== undefined ||
		figletOptions.verticalLayout !== undefined ||
		figletOptions.width !== undefined ||
		figletOptions.whitespaceBreak !== undefined ||
		figletOptions.printDirection !== undefined ||
		figletOptions.showHardBlanks !== undefined;

	if (!hasRenderableConfig) {
		return text;
	}

	try {
		return figlet.textSync(text, {
			font: figletOptions.font,
			horizontalLayout: figletOptions.horizontalLayout,
			verticalLayout: figletOptions.verticalLayout,
			width: figletOptions.width,
			whitespaceBreak: figletOptions.whitespaceBreak,
			printDirection: figletOptions.printDirection,
			showHardBlanks: figletOptions.showHardBlanks,
		});
	} catch {
		return text;
	}
}

function applyGradient(text: string, style?: TextStyleOptions): string {
	const gradientStyle = style?.gradient;
	if (!gradientStyle) {
		return text;
	}

	if (gradientStyle.preset) {
		const preset = GRADIENT_PRESETS[gradientStyle.preset];
    console.log(preset.multiline(text));
		return gradientStyle.multiline ? preset.multiline(text) : preset(text);
	}

	if (!gradientStyle.colors || gradientStyle.colors.length < 2) {
		return text;
	}

	const hasInterpolation = gradientStyle.interpolation !== undefined;
	const hasHsvSpin = gradientStyle.hsvSpin !== undefined;

	const configuredGradient = hasInterpolation || hasHsvSpin
		? gradient(gradientStyle.colors, {
			interpolation: gradientStyle.interpolation ?? (hasHsvSpin ? "hsv" : "rgb"),
			hsvSpin: gradientStyle.hsvSpin,
		})
		: gradient(gradientStyle.colors);

	return gradientStyle.multiline
		? configuredGradient.multiline(text)
		: configuredGradient(text);
}

function applyForegroundColor(
	chalkBuilder: any,
	colorSpec?: ChalkColorSpec,
): any {
	if (!colorSpec) {
		return chalkBuilder;
	}

	let styledBuilder = chalkBuilder;

	if (colorSpec.name && FOREGROUND_COLORS.has(colorSpec.name)) {
		styledBuilder = styledBuilder[colorSpec.name];
	}
	if (colorSpec.keyword) {
		styledBuilder = styledBuilder.keyword(colorSpec.keyword);
	}
	if (colorSpec.hex) {
		styledBuilder = styledBuilder.hex(colorSpec.hex);
	}
	if (colorSpec.rgb) {
		styledBuilder = styledBuilder.rgb(...colorSpec.rgb);
	}
	if (colorSpec.hsl) {
		styledBuilder = styledBuilder.hsl(...colorSpec.hsl);
	}
	if (colorSpec.hsv) {
		styledBuilder = styledBuilder.hsv(...colorSpec.hsv);
	}
	if (colorSpec.hwb) {
		styledBuilder = styledBuilder.hwb(...colorSpec.hwb);
	}
	if (typeof colorSpec.ansi === "number") {
		styledBuilder = styledBuilder.ansi(colorSpec.ansi);
	}
	if (typeof colorSpec.ansi256 === "number") {
		styledBuilder = styledBuilder.ansi256(colorSpec.ansi256);
	}

	return styledBuilder;
}

function applyBackgroundColor(
	chalkBuilder: any,
	colorSpec?: ChalkBackgroundColorSpec,
): any {
	if (!colorSpec) {
		return chalkBuilder;
	}

	let styledBuilder = chalkBuilder;

	if (colorSpec.name && BACKGROUND_COLORS.has(colorSpec.name)) {
		styledBuilder = styledBuilder[colorSpec.name];
	}
	if (colorSpec.keyword) {
		styledBuilder = styledBuilder.bgKeyword(colorSpec.keyword);
	}
	if (colorSpec.hex) {
		styledBuilder = styledBuilder.bgHex(colorSpec.hex);
	}
	if (colorSpec.rgb) {
		styledBuilder = styledBuilder.bgRgb(...colorSpec.rgb);
	}
	if (colorSpec.hsl) {
		styledBuilder = styledBuilder.bgHsl(...colorSpec.hsl);
	}
	if (colorSpec.hsv) {
		styledBuilder = styledBuilder.bgHsv(...colorSpec.hsv);
	}
	if (colorSpec.hwb) {
		styledBuilder = styledBuilder.bgHwb(...colorSpec.hwb);
	}
	if (typeof colorSpec.ansi === "number") {
		styledBuilder = styledBuilder.bgAnsi(colorSpec.ansi);
	}
	if (typeof colorSpec.ansi256 === "number") {
		styledBuilder = styledBuilder.bgAnsi256(colorSpec.ansi256);
	}

	return styledBuilder;
}

function applyLegacyColor(chalkBuilder: any, color?: string): any {
	if (!color) {
		return chalkBuilder;
	}

	const normalized = color.trim();

	if (!normalized) {
		return chalkBuilder;
	}

	if (normalized.startsWith("#")) {
		return chalkBuilder.hex(normalized);
	}

	if (FOREGROUND_COLORS.has(normalized as ChalkForegroundColor)) {
		return chalkBuilder[normalized];
	}

	return chalkBuilder.keyword(normalized);
}

function applyChalk(text: string, style?: TextStyleOptions): string {
	if (!style) {
		return text;
	}

	const chalkBuilderBase =
		style.chalk?.level !== undefined
			? new chalk.Instance({ level: style.chalk.level })
			: chalk;

	let styledBuilder: any = chalkBuilderBase;

	const modifiers = [...(style.chalk?.modifiers ?? [])];
	if (style.bold) {
		modifiers.push("bold");
	}
	if (style.italic) {
		modifiers.push("italic");
	}
	if (style.underline) {
		modifiers.push("underline");
	}

	for (const modifier of modifiers) {
		if (MODIFIERS.has(modifier)) {
			styledBuilder = styledBuilder[modifier];
		}
	}

	styledBuilder = applyForegroundColor(styledBuilder, style.chalk?.foreground);
	styledBuilder = applyBackgroundColor(styledBuilder, style.chalk?.background);
	styledBuilder = applyLegacyColor(styledBuilder, style.color);

	return styledBuilder(text);
}

function applyAlignment(
	text: string,
	align: TextAlign = "left",
	width = process.stdout.columns ?? 80,
): string {
	if (align === "left") {
		return text;
	}

	const targetWidth = Math.max(1, width);

	return text
		.split("\n")
		.map((line) => {
			const visibleLength = line.replace(ANSI_REGEX, "").length;
			const totalPadding = Math.max(0, targetWidth - visibleLength);

			if (align === "right") {
				return `${" ".repeat(totalPadding)}${line}`;
			}

			const leftPadding = Math.floor(totalPadding / 2);
			return `${" ".repeat(leftPadding)}${line}`;
		})
		.join("\n");
}

function renderStyledText(raw: string, style?: TextStyleOptions): string {
	const withFiglet = applyFiglet(raw, style);
	const withGradient = applyGradient(withFiglet, style);
	const withChalk = applyChalk(withGradient, style);
	return applyAlignment(withChalk, style?.align, style?.width);
}

function renderNode(node: PortfolioNode, inheritedStyle?: TextStyleOptions): string {
	if (node.type === "container") {
		const containerStyle = mergeStyle(inheritedStyle, node.style);
		const separator = node.container === "span" ? " " : "\n";
		return node.children
			.map((childNode) => renderNode(childNode, containerStyle))
			.join(separator);
	}

	const mergedStyle = mergeStyle(inheritedStyle, node.style);

	if (node.type === "link") {
		const label = node.external ? `${node.label} ↗` : node.label;
		return renderStyledText(`${label}: ${node.href}`, mergedStyle);
	}

	return renderStyledText(node.value, mergedStyle);
}

function renderSection(
	section: PortfolioSectionRequest,
	request: GeneratePortfolioCliRequest,
): string {
	const sectionTitleStyle = mergeStyle(request.theme?.sectionTitleStyle, {
		bold: true,
		color: request.theme?.primaryColor,
	});

	const bodyStyle = request.theme?.textStyle;

	const title = renderStyledText(section.title, sectionTitleStyle);
	const content = section.content
		.map((sectionNode) => renderNode(sectionNode, bodyStyle))
		.join("\n");

	return `${title}\n${content}`;
}

function renderPortfolioHeader(request: GeneratePortfolioCliRequest): string {
	const gradientFromTheme =
		request.theme?.primaryColor && request.theme?.secondaryColor
			? {
					colors: [
						request.theme.primaryColor,
						request.theme.secondaryColor,
					] as [string, string],
				}
			: undefined;

	const titleStyle = mergeStyle(request.theme?.titleStyle, {
		gradient: request.theme?.titleStyle?.gradient ?? gradientFromTheme,
	});

	return renderStyledText(request.portfolioName, titleStyle);
}





export function generateCli(
	input: PortfolioNode | GeneratePortfolioCliRequest,
): string {
	if (!isPortfolioRequest(input)) {
		return renderNode(input);
	}

	const header = renderPortfolioHeader(input);
	const sections = input.sections.map((section) => renderSection(section, input));
	return [header, ...sections].join("\n\n");
}

export function generateCliFromNode(layout: PortfolioNode): string {
	return renderNode(layout);
}




