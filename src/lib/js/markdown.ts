import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import markdown_it_footnote from 'markdown-it-footnote';
import markdown_it_sub from 'markdown-it-sub';
import markdown_it_sup from 'markdown-it-sup';
import markdown_it_container from 'markdown-it-container';

export function renderEnhancedMarkdown(input: string) {
    const spoilerConfig = {
        validate: (params: string) => {
            return params.trim().match(/^spoiler\s+(.*)$/);
        },

        render: (tokens: any, idx: any) => {
            var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

            if (tokens[idx].nesting === 1) {
                // opening tag
                return `<details><summary> ${DOMPurify.sanitize(m[1])} </summary>\n`;
            } else {
                // closing tag
                return '</details>\n';
            }
        }
    };

    const rendered = new MarkdownIt()
        .use(markdown_it_sub)
        .use(markdown_it_sup)
        .use(markdown_it_footnote)
        .use(markdown_it_container, 'spoiler', spoilerConfig)
        .render(input);
    return rendered;
}