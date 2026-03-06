import assert from "node:assert/strict";
import test from "node:test";
import { generateCli, generateCliFromNode } from "./generator";
import { GeneratePortfolioCliRequest, PortfolioNode } from "./interfaces";
import { rainbow } from "gradient-string";

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
      figlet:{
        enabled:true,
        font: "Standard"
      },
      gradient:{
        preset: "rainbow",
        colors: ["#eab308", "#22c55e", "#22d3ee", "#eab308"],
        interpolation: "rgb"
      }
    },
  };

  const output = generateCliFromNode(node);
  const plain = stripAnsi(output);
  console.log(plain);

  const lines = output.split("\n").filter((line) => line.trim().length > 0);
  assert.ok(lines.length > 1)
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
  console.log(output);
  const lines = output.split("\n").filter((line) => line.trim().length > 0);

  assert.ok(lines.length > 1);
});