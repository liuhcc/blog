hexo.extend.helper.register('toc_generate', function(content) {
  if (!content || typeof content !== 'string') return [];
  var headings = [];
  var regex = /<h([1-3])\s+id="([^"]*)"[^>]*>(.*?)<\/h\1>/gi;
  var match;
  while ((match = regex.exec(content)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, '')
    });
  }
  return headings;
});
