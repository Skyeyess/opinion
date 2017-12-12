import constants from '../constants/content';
export default (text) => {
  var _keyword = text;
  _keyword = _keyword.toLowerCase();

  var isInvalid = false;
  var specialWords = constants.SPECIAL_WORDS;
  specialWords.forEach(function(character) {
    if (_keyword.indexOf(character) >= 0) {
      isInvalid = true;
    }
  });

  var specialCharacters = constants.SPECIAL_CHARACTERS;
  specialCharacters.forEach(function(character) {
    if (_keyword.indexOf(character) >= 0) {
      isInvalid = true;
    }
  });

  return isInvalid;
}
