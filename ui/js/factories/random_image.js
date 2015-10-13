import random from 'lodash/number/random';
import please from 'pleasejs';

function randomImageFactory() {
    let randomXY = function() {
            return random(200, 700);
        },
        formatColor = function(color) {
            return color.replace('#', '');
        };

    return function() {
        let [bgColor, textColor] = please.make_scheme(
            please.HEX_to_HSV(please.make_color()[0]),
            {
                scheme_type: 'complement',
                format: 'hex'
            }
        );

        return `http://placehold.it/${randomXY()}x${randomXY()}/${formatColor(bgColor)}/${formatColor(textColor)}`;
    }
}

export default randomImageFactory;