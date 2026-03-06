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
import chalk, { Chalk } from "chalk";
import {
	GeneratePortfolioCliRequest,
	PortfolioNode,
	PortfolioSectionRequest,
    SeperatorEnum,
    ChalkStyleOptions,
} from "./interfaces";





export class generator{
    
    constructor(){
        
    }


    parseRequest(request: GeneratePortfolioCliRequest){
         // once we get  the generatePortfolioCLi request 
        const portfolioName = request.portfolioName;
        const theme = request.theme;
        const sections  = request.sections as PortfolioSectionRequest[];
    }

    parseSections(sections: PortfolioSectionRequest[]){
        
        const rendered_sections = sections.map(section=>{
            this.parseSection(section)
        });
    }

    parseSection(section: PortfolioSectionRequest){
        const rendered_section = [];
        const width = process.stdout.columns ?? 80;
        const seperator = section?.sectionSeperator
        
        if(section.content){
            section.content.map((m)=>{
                rendered_section.push(this.parseNode(m))
            })
        }

        if(seperator){
            const sep = seperator.type ?? SeperatorEnum.line;
            const style = seperator.chalk;
            const rendered_text = Array.from({ length: width }, () => sep).join("");
            this.applyChalk(rendered_text, style ?? {})
        }
    }

    applyFiglet(node : PortfolioNode){
        if(!node.style?.figlet?.enabled){
            return;
        }   
    }

    applyGradientString(node: PortfolioNode){
        if(!node.style?.gradient){
            return;
        }
    }

    applyChalk(node: PortfolioNode): string;
    applyChalk(text: string, style: ChalkStyleOptions): string;
    applyChalk(nodeOrText: PortfolioNode | string, style?: ChalkStyleOptions): string {
        if (typeof nodeOrText === "string") {
            let styled = style?.level !== undefined
                ? new chalk.Instance({ level: style.level })
                : chalk;

            for (const modifier of style?.modifiers ?? []) {
                styled = (styled as any)[modifier] ?? styled;
            }

            if (style?.foreground?.name) {
                styled = (styled as any)[style.foreground.name] ?? styled;
            }

            if (style?.foreground?.hex) {
                styled = styled.hex(style.foreground.hex);
            }

            if (style?.foreground?.keyword) {
                styled = styled.keyword(style.foreground.keyword);
            }

            if (style?.background?.name) {
                styled = (styled as any)[style.background.name] ?? styled;
            }

            if (style?.background?.hex) {
                styled = styled.bgHex(style.background.hex);
            }

            if (style?.background?.keyword) {
                styled = styled.bgKeyword(style.background.keyword);
            }

            return styled(nodeOrText);
        }

        const node = nodeOrText;
        if (node.type === "text") {
            return this.applyChalk(node.value, node.style?.chalk ?? {});
        }

        if (node.type === "link") {
            const renderedLink = node.external
                ? `${node.label} ↗: ${node.href}`
                : `${node.label}: ${node.href}`;
            return this.applyChalk(renderedLink, node.style?.chalk ?? {});
        }

        return node.children
            .map((child) => this.applyChalk(child))
            .join(node.container === "span" ? " " : "\n");
    }

    parseNode(node: PortfolioNode){

    }

    
    
}




