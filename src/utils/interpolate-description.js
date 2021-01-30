export default function interpolateDescription(text, universe) {
    if (text === undefined || typeof text !== "string") {
        throw new Error("text is not a string");
    }

    const textStylesRegEx = /\$\{style\-([^\}]+)\}/ig;

    const styledText = text.replaceAll(textStylesRegEx, (match, style) => {
        return `{{${style}}}`;
    });

    const textDataRegEx =/\$\{data\-([^\}]+)\}/ig;

    const interpolatedText = styledText.replaceAll(textDataRegEx, (match, data) => {
        let value = 'DATA-KEY-NOT-FOUND';

        switch(data) {
            case 'PlayerName':
                value = universe.player.avatar.name;
               break; 
        }

        return value;
    });

    return interpolatedText;
}