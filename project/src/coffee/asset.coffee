asset = {
  assetList: []
  dongList: []
  requests: []
  selectedAsset: null
  filter: null
  filterReset: {
    bldType: 'one',
    hasName: 0,
    hasNumber: 0,
    hasGwan: 0,
    fmlyMin: -1,
    fmlyMax: -1,
    mainPurps: '',
    useaprDay: '',
  }

  getRequests: () ->
    _this = this
    instance = axios.create {
      baseURL: consts.apiUrl
      headers: {}
    }
    instance.get 'assetRequestedV2'
    .then (response) ->
      _this.requests = _.reverse(response.data)
      _this.showRequested()
    .catch (error) ->
      console.log(error)

  showRequested: () ->
    $('#requestContainer').empty()
    for rq, idx in this.requests
      $('#requestContainer').append (
        "<div onclick='asset.selectRequested(#{idx})'>#{rq.plat_plc}</div>")

  selectRequested: (idx) ->
    this.selectedAsset = this.requests[idx]
    this.selectAssetResult()
    nMap.map.setCenter(new naver.maps.LatLng(
      this.requests[idx].bld_map_y, this.requests[idx].bld_map_x))
    nMap.map.setZoom 14
    nMap.getAssetsInBound()

  getAssetList: (_top, _bottom, _left, _right) ->
    console.log this.filter
    _this = this
    if this.filter == null
      this.filter = Object.assign {}, this.filterReset
    headerObj = {
      'top': _top
      'bottom': _bottom
      'left': _left
      'right': _right
    }
    headerObj = Object.assign headerObj, this.filter
    
    instance = axios.create {
      baseURL: consts.apiUrl
      headers: headerObj
    }
    instance.get 'assetListV3'
    .then (response) ->
      _this.assetList = _.reverse(response.data)
      nMap.setAssetMarkers()
    .catch (error) ->
      console.log(error)

  getDongList: (_top, _bottom, _left, _right) ->
    _this = this
    if this.filter == null
      this.filter = Object.assign {}, this.filterReset
    headerObj = {
      'top': _top
      'bottom': _bottom
      'left': _left
      'right': _right
    }
    headerObj = Object.assign headerObj, this.filter

    instance = axios.create {
      baseURL: consts.apiUrl
      headers: headerObj
    }
    instance.get 'assetDongsV3'
    .then (response) ->
      _this.dongList = _.reverse(response.data)
      nMap.setDongMarkers()
    .catch (error) ->
      console.log(error)

  askDeleteAsset: () ->
    if confirm '[1차 확인] 이 매물을 삭제하시겠습니까?'
      if confirm '[2차 확인] 이 매물을 삭제하시겠습니까?'
        this.deleteAsset()
      
  deleteAsset: () ->
    _this = this
    if this.filter == null
      this.filter = Object.assign {}, this.filterReset
    headerObj = {
      'bld_idx': _this.selectedAsset.bld_idx
    }
    
    instance = axios.create {
      baseURL: consts.apiUrl
      headers: headerObj
    }
    instance.delete 'asset/deleteV2'
    .then (response) ->
      _this.assetList = []
      _this.selectedAsset = null
      nMap.getAssetsInBound()
    .catch (error) ->
      console.log(error)

  selectAsset: (idx) ->
    _this = this
    this.selectedAsset = null
    instance = axios.create {
      baseURL: consts.apiUrl
    }
    instance.get 'assetV2/' + this.assetList[idx].bld_idx
    .then (response) ->
      _this.selectedAsset = null
      _this.selectedAsset = response.data
      if _this.selectedAsset?
        _this.selectAssetResult()
    .catch (error) ->
      console.log(error)

  selectAssetResult: () ->
    $('#oldAddr').text this.selectedAsset.plat_plc
    $('#newAddr').text this.selectedAsset.new_plat_plc
    $('#flrFml').text this.selectedAsset.grnd_flr_cnt + ' | ' + this.selectedAsset.fmly_cnt
    $('#useApr').text this.selectedAsset.useapr_day
    $('#mainPurps').text this.selectedAsset.main_purps
    $('#etcPurps').text this.selectedAsset.etc_purps
    $('#bldType').val this.selectedAsset.bld_type
    $('#bldName').val this.selectedAsset.bld_name
    $('#bldGwan').val this.selectedAsset.bld_gwan
    $('#bldTelOwner').val this.selectedAsset.bld_tel_owner
    $('#bldTelGwan').val this.selectedAsset.bld_tel_gwan
    $('#bldIpKey').val this.selectedAsset.bld_ipkey
    $('#bldRoomKey').val this.selectedAsset.bld_roomkey
    $('#bldMemo').val this.selectedAsset.bld_memo
    $('#bldOnWall').val this.selectedAsset.bld_on_wall
    $('#bldOnParked').val this.selectedAsset.bld_on_parked
    $('#workRequested').prop 'checked', if this.selectedAsset.work_requested.trim() == ''
    then false else true
    if this.selectedAsset.photo != ''
      $('#seePhoto').show()
    else
      $('#seePhoto').hide()
      
  seePhoto: () ->
    window.open consts.photoUrl + this.selectedAsset.photo, '_blank'

  saveAsset: (request) ->
    _this = this
    if this.selectedAsset == null
      alert '매물이 선택되지 않았습니다.'
    else
        this.selectedAsset.bld_type = $('#bldType').val()
        this.selectedAsset.bld_name = $('#bldName').val()
        this.selectedAsset.bld_gwan = $('#bldGwan').val()
        this.selectedAsset.bld_memo = $('#bldMemo').val()
        this.selectedAsset.bld_tel_owner = $('#bldTelOwner').val()
        this.selectedAsset.bld_tel_gwan = $('#bldTelGwan').val()
        this.selectedAsset.bld_ipkey = $('#bldIpKey').val()
        this.selectedAsset.bld_roomkey = $('#bldRoomKey').val()
        this.selectedAsset.bld_on_wall = $('#bldOnWall').val()
        this.selectedAsset.bld_on_parked = $('#bldOnParked').val()
        this.selectedAsset.work_requested = request
      strObj = Qs.stringify this.selectedAsset

      axios.put consts.apiUrl + 'asset/modifyV2', strObj, {
        headers: {
          bld_idx: this.selectedAsset.bld_idx
        }
      }, {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      .then (result) ->
        nMap.getAssetsInBound()
        _this.getRequests()

  filterBldType: (src, e) ->
    this.filter.bldType = $(src).val()
    nMap.getAssetsInBound()

  filterHasName: (src, e) ->
    this.filter.hasName = $(src).val()
    nMap.getAssetsInBound()

  filterHasNumber: (src, e) ->
    this.filter.hasNumber = $(src).val()
    nMap.getAssetsInBound()

  filterHasGwan: (src, e) ->
    this.filter.hasGwan = $(src).val()
    nMap.getAssetsInBound()

  filterFmly: (src, e, which) ->
    if e.key ==  'Enter'.toString()
      if $.isNumeric $(src).val()
        this.filter[which] = $(src).val()
        nMap.getAssetsInBound()
      else
        if ($(src).val().trim() == '')
          this.filter[which] = -1
          nMap.getAssetsInBound()
        else
          alert '숫자만 입력하세요.'

  searchAddr: (src, e) ->
    if e.code ==  'Enter'.toString()
      instance = axios.create {
        baseURL: consts.apiUrl
        headers: {
          address: encodeURIComponent $(src).val()
        }
      }
      instance.get "locateAddress"
      .then (response) ->
        pos = response.data
        nMap.map.setCenter(new naver.maps.LatLng pos.y, pos.x)
        nMap.map.setZoom 12
      .catch (error) ->
        console.log(error)

  filterMainPurps: (src, e) ->
    if e.key ==  'Enter'.toString()
      this.filter.mainPurps = encodeURIComponent $(src).val()
      nMap.getAssetsInBound()

  filterUseaprDay: (src, e) ->
    if e.key ==  'Enter'.toString()
      if ($.isNumeric $(src).val()) and ($(src).val().length == 4)
        this.filter.useaprDay = $(src).val()
        nMap.getAssetsInBound()
      else
        if ($(src).val().trim() == '')
          this.filter.useaprDay = -1
          nMap.getAssetsInBound()
        else
          alert '4자리 년도만 입력하세요.'

  resetFilter: () ->
    this.filter = Object.assign {}, this.filterReset
    $('.has').val(0)
    $('#bldTypeFilter').val('one')
    $('.toReset').val('')
    nMap.getAssetsInBound()
}