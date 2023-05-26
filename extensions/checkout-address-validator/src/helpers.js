import emojiRegex from 'emoji-regex';

export const regexValidators = {
    // test for pipes, new lines, less than, greater than, double quote, apostrophe and ampersand. using negative lookahead, should return false if any matches found
    otherCharsTest: new RegExp(/([\||\r|\n|\<|\>|\"|\'|\&])/),
    // test for emojis. should return false if any matches found. remove any flags in the plugin. using blank second parameter to remove hardcoded /g flag from plugin
    emojiTest: new RegExp(emojiRegex(), ""),
    // Phone test for only digits or +
    phoneTest: new RegExp(/^(\d|\+)+$/), 
};