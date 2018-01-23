var leftPanelWidth, panoHeight, sizeElements;

leftPanelWidth = 480;

panoHeight = 360;

$(function() {
  sizeElements();
  return $(window).resize(sizeElements);
});

sizeElements = function() {
  var docH, docW;
  docW = $(window).width();
  docH = $(window).height();
  $('#outerWrapper').css('padding-left', `${leftPanelWidth}px`);
  $('#leftPanel').css('width', `${leftPanelWidth}px`);
  $('#mapContainer').css('width', `${docW - leftPanelWidth}px`);
  $('#leftPanel').css('height', `${docH}px`);
  $('#mapContainer').css('height', `${docH}px`);
  $('#requestContainer').css('height', `${docH}px`);
  $('#panoContainer').css('height', `${panoHeight}px`);
  $('#centerCircle').css('left', `${(docW - leftPanelWidth) / 2 - 12}px`);
  $('#centerCircle').css('top', `${docH / 2 - 42}px`);
  return nMap.setMap();
};
