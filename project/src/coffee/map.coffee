nMap = {
  map: null
  pano: null
  panoMarker: null
  mapStsSaved: null
  mapSts: {
    x: 129.3433898
    y: 36.0190333
    z: 10
  }
  
  assetMarkers: []
  dongMarkers: []

  setMap: () ->
    _this = this
    this.mapStsSaved = Cookies.getJSON 'mapSts'
    if this.mapStsSaved? and this.mapStsSaved != 'undefined'
      this.mapSts = this.mapStsSaved

    mapOptions = {
      center: new naver.maps.LatLng this.mapSts.y, this.mapSts.x
      zoom: this.mapSts.z
      size: {
        width: $('#mapContainer').width(),
        height: $('#mapContainer').height()
      }
    }
    this.map = new naver.maps.Map 'mapContainer', mapOptions
    naver.maps.Event.addListener this.map, 'dragend', (e) ->
      _this.mapSts.x = e.coord.x
      _this.mapSts.y = e.coord.y
      Cookies.set 'mapSts', _this.mapSts
      _this.getAssetsInBound()
    naver.maps.Event.addListener this.map, 'zoom_changed', (e) ->
      _this.mapSts.z = e
      Cookies.set 'mapSts', _this.mapSts
      _this.getAssetsInBound()
    
    this.setMapCach(this.map)
    this.getAssetsInBound()
    request.getRequests()

  setMapCach: (map) ->

  getAssetsInBound: () ->
    bound = nMap.map.getBounds()
    if (this.map.zoom > 11)
      asset.getAssetList(bound._max.y, bound._min.y, bound._min.x, bound._max.x)
    else
      asset.getDongList(bound._max.y, bound._min.y, bound._min.x, bound._max.x)

  setAssetMarkers: () ->
    _this = this
    for mkr in this.assetMarkers
      mkr.setMap null
    this.assetMarkers = []
    for mkr in this.dongMarkers
      mkr.setMap null
    this.dongMarkers = []

    if asset.assetList.length < consts.maxMarkers || this.map.zoom >= 12
      for ast, idx in asset.assetList
        _n = if (ast.bld_name.replace '(자동입력)', '').trim() == '' then 0 else 1
        _t = if ast.bld_tel_owner.trim() == '' then 0 else 1
        _r = if ast.work_requested.trim() == '' then 0 else 1
        marker = new naver.maps.Marker {
          position: new naver.maps.LatLng ast.bld_map_y, ast.bld_map_x
          map: this.map
          icon: "/img/n#{_n}t#{_t}r#{_r}.png"
          size: new naver.maps.Size 16, 45
          origin: new naver.maps.Size 0, 0
          anchor: new naver.maps.Size 8, 45
        }
        marker.set 'idx', idx
        marker.addListener 'click', (e) ->
          mkr = e.overlay
          asset.selectAsset(mkr.idx)
          _this.setPano(asset.assetList[mkr.idx])
        this.assetMarkers.push marker
    else
      for ast, idx in asset.assetList
        if idx % (Math.floor(asset.assetList.length / consts.maxMarkers)) == 0
          marker = new naver.maps.Marker {
            position: new naver.maps.LatLng ast.bld_map_y, ast.bld_map_x
            map: this.map
          }
          marker.set 'idx', idx
          this.assetMarkers.push marker
          

  setDongMarkers: () ->
    for mkr in this.assetMarkers
      mkr.setMap null
    this.assetMarkers = []
    for mkr in this.dongMarkers
      mkr.setMap null
    this.dongMarkers = []

    for ast, idx in asset.dongList
      marker = new naver.maps.Marker {
        position: new naver.maps.LatLng ast.bld_map_y, ast.bld_map_x
        map: this.map
      }
      marker.set 'idx', idx
      this.assetMarkers.push marker

  setPano: (ast) ->
    if this.panoMarker?
      this.panoMarker.setMap null
      this.panoMarker = null
    pos = new naver.maps.LatLng ast.bld_map_y, ast.bld_map_x
    this.pano = null
    this.pano = new naver.maps.Panorama 'panoContainer', {
      position: pos
      aroundControl: true
    }
    this.panoMarker = new naver.maps.Marker {
      position: pos
    }
    this.panoMarker.setMap this.pano

  toPanoLink: (nOrD) ->
    url = if nOrD == 'naver'
    then ''
    else ''
    window.open(url, '_blank')
}
