var request;

request = {
  requests: [],
  getRequests: function() {
    var _this, headerObj, instance;
    _this = this;
    headerObj = {
      'bld_name': encodeURIComponent($('#searchBldName').val()),
      'bld_memo': encodeURIComponent($('#searchBldMemo').val())
    };
    headerObj = Object.assign(headerObj, fltr.filter);
    instance = axios.create({
      baseURL: consts.apiUrl,
      headers: headerObj
    });
    return instance.get('assetRequestedV3').then(function(response) {
      _this.requests = _.reverse(response.data);
      return _this.showRequested();
    }).catch(function(error) {
      return console.log(error);
    });
  },
  showRequested: function() {
    var i, idx, len, ref, results, rq;
    $('#requestContainer').empty();
    ref = this.requests;
    results = [];
    for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
      rq = ref[idx];
      results.push($('#requestContainer').append(`<div onclick='request.selectRequested(${idx})'>` + `<div>[${asset.decodeBldType(rq.bld_type)}] ${rq.bld_name}</div>` + `<div>${rq.plat_plc}</div></div>`));
    }
    return results;
  },
  selectRequested: function(idx) {
    asset.selectedAsset = this.requests[idx];
    asset.selectAssetResult();
    nMap.map.setCenter(new naver.maps.LatLng(this.requests[idx].bld_map_y, this.requests[idx].bld_map_x));
    nMap.map.setZoom(14);
    nMap.getAssetsInBound();
    return nMap.setPano(this.requests[idx]);
  }
};
