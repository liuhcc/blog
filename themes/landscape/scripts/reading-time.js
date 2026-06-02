hexo.extend.helper.register('reading_time', function(content) {
  if (!content) return '1 min';
  // Strip HTML tags
  var text = content.replace(/<[^>]*>/g, '');
  // Count Chinese characters
  var chineseChars = (text.match(/[一-鿿㐀-䶿]/g) || []).length;
  // Count English words
  var englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  // Chinese: ~400 chars/min, English: ~200 words/min
  var minutes = Math.ceil(chineseChars / 400 + englishWords / 200);
  return Math.max(1, minutes) + ' min';
});
