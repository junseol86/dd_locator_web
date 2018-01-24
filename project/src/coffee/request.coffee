request = {
  requests: []
  
  getRequests: () ->
    _this = this
    
    headerObj = {
      'bld_name': encodeURIComponent $('#searchBldName').val()
      'bld_memo': encodeURIComponent $('#searchBldMemo').val()
    }
    headerObj = Object.assign headerObj, fltr.filter

    instance = axios.create {
      baseURL: consts.apiUrl
      headers: headerObj
    }
    instance.get 'assetRequestedV3'
    .then (response) ->
      _this.requests = _.reverse(response.data)
      _this.showRequested()
    .catch (error) ->
      console.log(error)

  showRequested: () ->
    $('#requestContainer').empty()
    for rq, idx in this.requests
      $('#requestContainer').append (
        "<div onclick='request.selectRequested(#{idx})'>" +
        "<div>[#{asset.decodeBldType rq.bld_type}] #{rq.bld_name}</div>" +
        "<div>#{rq.plat_plc}</div></div>")

  selectRequested: (idx) ->
    asset.selectedAsset = this.requests[idx]
    asset.selectAssetResult()
    nMap.map.setCenter(new naver.maps.LatLng(
      this.requests[idx].bld_map_y, this.requests[idx].bld_map_x))
    nMap.map.setZoom 14
    nMap.getAssetsInBound()
    nMap.setPano this.requests[idx]
}