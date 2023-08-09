import { sanitize } from 'isomorphic-dompurify';
import MarkdownIt from 'markdown-it';
import markdown_it_link_attributes from 'markdown-it-link-attributes';
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
                return `<details><summary> ${sanitize(m[1])} </summary>\n`;
            } else {
                // closing tag
                return '</details>\n';
            }
        }
    };

    const md = new MarkdownIt({
        linkify: true,
    });
    md.linkify.set({ fuzzyLink: false });
    md.use(markdown_it_sub)
    md.use(markdown_it_sup)
    md.use(markdown_it_footnote)
    md.use(markdown_it_container, 'spoiler', spoilerConfig)
    md.use(markdown_it_link_attributes, {
        attrs: {
            target: "_blank",
            rel: "nofollow",
        }
    })
    return md.render(input);
}