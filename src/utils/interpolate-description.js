export default function interpolateDescription(text, universe) {
    const textStylesRegEx = /\$\{style\-([^\}]+)\}/ig;

    const styledText = text.replaceAll(textStylesRegEx, (match, style) => {
        return `{{${style}}}`;
    });

    const textDataRegEx =/\$\{\-([^\}]+)\}/ig;

    const interpolatedText = styledText.replaceAll(textDataRegEx, (match, data) => {
        let value = 'DATA-KEY-NOT-FOUND';

        switch(data) {
            case 'PlayerName':
                value = universe.avatar.name;
               break; 
        }

        return value;
    });

    return interpolatedText;
}