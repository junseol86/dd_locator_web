leftPanelWidth = 480
panoHeight = 360

$ () ->
  sizeElements()
  $(window).resize sizeElements

sizeElements = () ->
  docW = $(window).width()
  docH = $(window).height()
  $('#outerWrapper').css 'padding-left', "#{leftPanelWidth}px"
  $('#leftPanel').css 'width', "#{leftPanelWidth}px"
  $('#mapContainer').css 'width', "#{docW - leftPanelWidth}px"
  $('#leftPanel').css 'height', "#{docH}px"
  $('#mapContainer').css 'height', "#{docH}px"
  $('#requestContainer').css 'height', "#{docH}px"
  $('#panoContainer').css 'height', "#{panoHeight}px"
  $('#centerCircle').css 'left', "#{(docW - leftPanelWidth) / 2 - 14}px"
  $('#centerCircle').css 'top', "#{docH / 2 - 18}px"
  nMap.setMap()
  