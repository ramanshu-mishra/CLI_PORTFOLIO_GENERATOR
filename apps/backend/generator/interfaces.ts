export type TextContainerType = "div" | "span";

export type TextAlign = "left" | "center" | "right";

export type ChalkModifier =
  | "reset"
  | "bold"
  | "dim"
  | "italic"
  | "underline"
  | "overline"
  | "inverse"
  | "hidden"
  | "strikethrough"
  | "visible";

export type ChalkForegroundColor =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray"
  | "grey"
  | "blackBright"
  | "redBright"
  | "greenBright"
  | "yellowBright"
  | "blueBright"
  | "magentaBright"
  | "cyanBright"
  | "whiteBright";

export type ChalkBackgroundColor =
  | "bgBlack"
  | "bgRed"
  | "bgGreen"
  | "bgYellow"
  | "bgBlue"
  | "bgMagenta"
  | "bgCyan"
  | "bgWhite"
  | "bgGray"
  | "bgGrey"
  | "bgBlackBright"
  | "bgRedBright"
  | "bgGreenBright"
  | "bgYellowBright"
  | "bgBlueBright"
  | "bgMagentaBright"
  | "bgCyanBright"
  | "bgWhiteBright";

export interface ChalkColorSpec {
  name?: ChalkForegroundColor;
  keyword?: string;
  hex?: string;
  rgb?: [number, number, number];
  hsl?: [number, number, number];
  hsv?: [number, number, number];
  hwb?: [number, number, number];
  ansi?: number;
  ansi256?: number;
}

export interface ChalkBackgroundColorSpec {
  name?: ChalkBackgroundColor;
  keyword?: string;
  hex?: string;
  rgb?: [number, number, number];
  hsl?: [number, number, number];
  hsv?: [number, number, number];
  hwb?: [number, number, number];
  ansi?: number;
  ansi256?: number;
}

export interface ChalkStyleOptions {
  modifiers?: ChalkModifier[];
  foreground?: ChalkColorSpec;
  background?: ChalkBackgroundColorSpec;
  level?: 0 | 1 | 2 | 3;
}

export type GradientInterpolation = "rgb" | "hsv";

export type GradientHsvSpin = "short" | "long";

export type GradientPreset =
  | "atlas"
  | "cristal"
  | "teen"
  | "mind"
  | "morning"
  | "vice"
  | "passion"
  | "fruit"
  | "instagram"
  | "retro"
  | "summer"
  | "rainbow"
  | "pastel";

export interface GradientStyle {
  preset?: GradientPreset;
  colors: [string, string, ...string[]];
  interpolation?: GradientInterpolation;
  hsvSpin?: GradientHsvSpin;
  multiline?: boolean;
}

export type FigletKerningMethod =
  | "default"
  | "full"
  | "fitted"
  | "controlled smushing"
  | "universal smushing";

export interface FigletStyleOptions {
  enabled?: boolean;
  font?: string;
  horizontalLayout?: FigletKerningMethod;
  verticalLayout?: FigletKerningMethod;
  width?: number;
  whitespaceBreak?: boolean;
  printDirection?: -1 | 0 | 1;
  showHardBlanks?: boolean;
}

export interface TextStyleOptions {
  color?: string;
  gradient?: GradientStyle;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  size?: number;
  align?: TextAlign;
  width?: number;
  chalk?: ChalkStyleOptions;
  figlet?: FigletStyleOptions;
}

export interface TextNode {
  type: "text";
  value: string;
  container?: TextContainerType;
  style?: TextStyleOptions;
}

export interface LinkNode {
  type: "link";
  label: string;
  href: string;
  external?: true;
  style?: TextStyleOptions;
}


export interface ContainerNode {
  type: "container";
  container: TextContainerType;
  style?: TextStyleOptions;
  children: PortfolioNode[];
}

export type PortfolioNode = TextNode | LinkNode  | ContainerNode;

export interface PortfolioSectionRequest {
  id: string;
  title: string;
  content: PortfolioNode[];
}

export interface PortfolioThemeRequest {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  titleStyle?: TextStyleOptions;
  sectionTitleStyle?: TextStyleOptions;
  textStyle?: TextStyleOptions;
  linkStyle?: TextStyleOptions;
}

export interface GeneratePortfolioCliRequest {
  portfolioName: string;
  theme?: PortfolioThemeRequest;
  sections: PortfolioSectionRequest[];
}
