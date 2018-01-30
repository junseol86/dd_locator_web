var nMap;

nMap = {
  map: null,
  pano: null,
  panoMarker: null,
  mapStsSaved: null,
  mapSts: {
    x: 129.3433898,
    y: 36.0190333,
    z: 10
  },
  assetMarkers: [],
  dongMarkers: [],
  setMap: function() {
    var _this, mapOptions;
    _this = this;
    this.mapStsSaved = Cookies.getJSON('mapSts');
    if ((this.mapStsSaved != null) && this.mapStsSaved !== 'undefined') {
      this.mapSts = this.mapStsSaved;
    }
    mapOptions = {
      center: new naver.maps.LatLng(this.mapSts.y, this.mapSts.x),
      zoom: this.mapSts.z,
      size: {
        width: $('#mapContainer').width(),
        height: $('#mapContainer').height()
      }
    };
    this.map = new naver.maps.Map('mapContainer', mapOptions);
    naver.maps.Event.addListener(this.map, 'dragend', function(e) {
      _this.mapSts.x = e.coord.x;
      _this.mapSts.y = e.coord.y;
      Cookies.set('mapSts', _this.mapSts);
      return _this.getAssetsInBound();
    });
    naver.maps.Event.addListener(this.map, 'zoom_changed', function(e) {
      _this.mapSts.z = e;
      Cookies.set('mapSts', _this.mapSts);
      return _this.getAssetsInBound();
    });
    this.setMapCach(this.map);
    this.getAssetsInBound();
    return request.getRequests();
  },
  setMapCach: function(map) {},
  getAssetsInBound: function() {
    var bound;
    bound = nMap.map.getBounds();
    if (this.map.zoom > 11) {
      return asset.getAssetList(bound._max.y, bound._min.y, bound._min.x, bound._max.x);
    } else {
      return asset.getDongList(bound._max.y, bound._min.y, bound._min.x, bound._max.x);
    }
  },
  setAssetMarkers: function() {
    var _n, _r, _t, _this, ast, i, idx, j, k, l, len, len1, len2, len3, marker, mkr, ref, ref1, ref2, ref3, results, results1;
    _this = this;
    ref = this.assetMarkers;
    for (i = 0, len = ref.length; i < len; i++) {
      mkr = ref[i];
      mkr.setMap(null);
    }
    this.assetMarkers = [];
    ref1 = this.dongMarkers;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      mkr = ref1[j];
      mkr.setMap(null);
    }
    this.dongMarkers = [];
    if (asset.assetList.length < consts.maxMarkers || this.map.zoom >= 12) {
      ref2 = asset.assetList;
      results = [];
      for (idx = k = 0, len2 = ref2.length; k < len2; idx = ++k) {
        ast = ref2[idx];
        _n = (ast.bld_name.replace('(자동입력)', '')).trim() === '' ? 0 : 1;
        _t = ast.bld_tel_owner.trim() === '' ? 0 : 1;
        _r = ast.work_requested.trim() === '' ? 0 : 1;
        marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(ast.bld_map_y, ast.bld_map_x),
          map: this.map,
          icon: `/img/n${_n}t${_t}r${_r}.png`,
          size: new naver.maps.Size(16, 45),
          origin: new naver.maps.Size(0, 0),
          anchor: new naver.maps.Size(8, 45)
        });
        marker.set('idx', idx);
        marker.addListener('click', function(e) {
          mkr = e.overlay;
          asset.selectAsset(mkr.idx);
          return _this.setPano(asset.assetList[mkr.idx]);
        });
        results.push(this.assetMarkers.push(marker));
      }
      return results;
    } else {
      ref3 = asset.assetList;
      results1 = [];
      for (idx = l = 0, len3 = ref3.length; l < len3; idx = ++l) {
        ast = ref3[idx];
        if (idx % (Math.floor(asset.assetList.length / consts.maxMarkers)) === 0) {
          marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(ast.bld_map_y, ast.bld_map_x),
            map: this.map
          });
          marker.set('idx', idx);
          results1.push(this.assetMarkers.push(marker));
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    }
  },
  setDongMarkers: function() {
    var ast, i, idx, j, k, len, len1, len2, marker, mkr, ref, ref1, ref2, results;
    ref = this.assetMarkers;
    for (i = 0, len = ref.length; i < len; i++) {
      mkr = ref[i];
      mkr.setMap(null);
    }
    this.assetMarkers = [];
    ref1 = this.dongMarkers;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      mkr = ref1[j];
      mkr.setMap(null);
    }
    this.dongMarkers = [];
    ref2 = asset.dongList;
    results = [];
    for (idx = k = 0, len2 = ref2.length; k < len2; idx = ++k) {
      ast = ref2[idx];
      marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(ast.bld_map_y, ast.bld_map_x),
        map: this.map
      });
      marker.set('idx', idx);
      results.push(this.assetMarkers.push(marker));
    }
    return results;
  },
  setPano: function(ast) {
    var pos;
    if (this.panoMarker != null) {
      this.panoMarker.setMap(null);
      this.panoMarker = null;
    }
    pos = new naver.maps.LatLng(ast.bld_map_y, ast.bld_map_x);
    this.pano = null;
    this.pano = new naver.maps.Panorama('panoContainer', {
      position: pos,
      aroundControl: true
    });
    this.panoMarker = new naver.maps.Marker({
      position: pos
    });
    return this.panoMarker.setMap(this.pano);
  },
  toPanoLink: function(nOrD) {
    var url;
    url = nOrD === 'naver' ? '' : '';
    return window.open(url, '_blank');
  }
};
