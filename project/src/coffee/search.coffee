search = {
  searched: [],

  searchAssets: (src, e) ->
    if e.key ==  'Enter'.toString()
      if $('#searchBldName').val().trim() == '' &&
      $('#searchBldMemo').val().trim() == ''
        this.searched = []
        this.showSearched()
      else
        this.getSearchedList()

  getSearchedList: () ->
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
    instance.get 'assetSearchedV2'
    .then (response) ->
      _this.searched = _.reverse(response.data)
      _this.showSearched()

    .catch (error) ->
      console.log(error)

  showSearched: () ->
    request.getRequests()
    if this.searched.length == 0
      $('#searchResult').hide()
    else
      $('#searchResult').show()
      $('#searched').empty()
      for sc, idx in this.searched
        $('#searched').append (
          "<div onclick='search.selectSearched(#{idx})'>" +
          "<div>[#{asset.decodeBldType sc.bld_type}] #{sc.bld_name}</div>" +
          "<div>#{sc.plat_plc}</div></div>")
          
  selectSearched: (idx) ->
    asset.selectedAsset = this.searched[idx]
    asset.selectAssetResult()
    nMap.map.setCenter(new naver.maps.LatLng(
      this.searched[idx].bld_map_y, this.searched[idx].bld_map_x))
    nMap.map.setZoom 14
    nMap.getAssetsInBound()
    nMap.setPano this.searched[idx]

  clearSearched: () ->
    $('#searchBldName').val ''
    $('#searchBldMemo').val ''
    this.searched = []
    this.showSearched()
    
}