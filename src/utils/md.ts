/**
 * Generate markdown used in discord chat
 */
const MD = {
    underline: (text: string) => `_${text}_`,
    strikethrough: (text: string) => `~~${text}~~`,
    italic: {
        i: (text: string) => `*${text}*`,
        underline: (text: string) => MD.underline(MD.italic.i(text)),
    },
    bold: {
        b: (text: string) => `**${text}**`,
        boldUnderline: (text: string) => MD.underline(MD.bold.b(text)),
        boldItalic: (text: string) => `***${text}***`,
        boldUnderlineItalic: (text: string) => MD.underline(MD.bold.boldItalic(text)),
    },
    codeBlock: {
        line: (text: string) => `\`${text}\``,
        multiline: (text: string) => `\`\`\`${text}\`\`\``
    }
}

export default MD;