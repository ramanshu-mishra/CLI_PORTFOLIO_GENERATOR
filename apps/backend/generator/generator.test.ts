import assert from "node:assert/strict";
import test from "node:test";
import { generateCli, generateCliFromNode } from "./generator";
import { GeneratePortfolioCliRequest, PortfolioNode } from "./interfaces";

const ANSI_REGEX = /\u001B\[[0-?]*[ -/]*[@-~]/g;

function stripAnsi(input: string): string {
  return input.replace(ANSI_REGEX, "");
}

test("generateCli returns plain text for a simple text node", () => {
  const node: PortfolioNode = {
    type: "text",
    value: "Hello CLI",
  };

  assert.equal(generateCli(node), "Hello CLI");
});

test("generateCli renders full portfolio request with sections and links", () => {
  const request: GeneratePortfolioCliRequest = {
    portfolioName: "Raman Portfolio",
    theme: {
      primaryColor: "#00D4FF",
      secondaryColor: "#7C3AED",
      textStyle: {
        chalk: {
          level: 3,
        }
      },
    },
    sections: [
      {
        id: "about",
        title: "About",
        content: [
          {
            type: "text",
            value: "Building terminal-first developer tools."
          },
          {
            type: "link",
            label: "GitHub",
            href: "https://github.com/ramanshu",
            external: true,
          },
        ],
      },
    ],
  };

  const output = stripAnsi(generateCli(request));

  assert.match(output, /Raman Portfolio/);
  assert.match(output, /About/);
  assert.match(output, /Building terminal-first developer tools\./);
  assert.match(output, /GitHub ↗: https:\/\/github\.com\/ramanshu/);
});

test("generateCliFromNode applies alignment and keeps visible text intact", () => {
  const node: PortfolioNode = {
    type: "text",
    value: "Aligned",
    style: {
      align: "center",
      width: 30,
      chalk: {
        level: 3,
        modifiers: ["bold"],
        foreground: {
          hex: "#22C55E",
        },
      },
    },
  };

  const output = generateCliFromNode(node);
  const plain = stripAnsi(output);

  assert.equal(plain.trim(), "Aligned");
  assert.ok(plain.startsWith(" "));
});

test("generateCliFromNode handles gradient style without changing content", () => {
  const node: PortfolioNode = {
    type: "text",
    value: "GradientText",
    style: {
      gradient: {
        colors: ["#FF0080", "#7928CA"],
        interpolation: "rgb",
      },
      chalk: {
        level: 3,
      },
    },
  };

  const output = generateCliFromNode(node);
  assert.equal(stripAnsi(output), "GradientText");
});

test("generateCliFromNode applies figlet when enabled", () => {
  const node: PortfolioNode = {
    type: "text",
    value: "Hi",
    style: {
      figlet: {
        enabled: true,
        font: "Standard",
      },
    },
  };

  const output = stripAnsi(generateCliFromNode(node));
  const lines = output.split("\n").filter((line) => line.trim().length > 0);

  assert.ok(lines.length > 1);
});