asset = {
  assetList: []
  dongList: []
  selectedAsset: null


  getAssetList: (_top, _bottom, _left, _right) ->
    _this = this
    if fltr.filter == null
      fltr.filter = Object.assign {}, fltr.filterReset
    headerObj = {
      'top': _top
      'bottom': _bottom
      'left': _left
      'right': _right
    }
    headerObj = Object.assign headerObj, fltr.filter
    
    instance = axios.create {
      baseURL: consts.apiUrl
      headers: headerObj
    }
    instance.get 'assetListV4'
    .then (response) ->
      _this.assetList = _.reverse(response.data.asset_list)
      $('#totalAssetCount').text response.data.total_count
      nMap.setAssetMarkers()
    .catch (error) ->
      console.log(error)

  getDongList: (_top, _bottom, _left, _right) ->
    _this = this
    if fltr.filter == null
      fltr.filter = Object.assign {}, fltr.filterReset
    headerObj = {
      'top': _top
      'bottom': _bottom
      'left': _left
      'right': _right
    }
    headerObj = Object.assign headerObj, fltr.filter

    instance = axios.create {
      baseURL: consts.apiUrl
      headers: headerObj
    }
    instance.get 'assetDongsV4'
    .then (response) ->
      _this.dongList = _.reverse(response.data.dong_list)
      $('#totalAssetCount').text response.data.total_count
      nMap.setDongMarkers()
    .catch (error) ->
      console.log(error)

  askDeleteAsset: () ->
    if confirm '[1차 확인] 이 매물을 삭제하시겠습니까?'
      if confirm '[2차 확인] 이 매물을 삭제하시겠습니까?'
        this.deleteAsset()
      
  deleteAsset: () ->
    _this = this
    if fltr.filter == null
      fltr.filter = Object.assign {}, fltr.filterReset
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
        request.getRequests()
        
  decodeBldType: (code) ->
    if (code == '')
      return '미분류'
    else
      return code.replace('one', '원룸').replace('sg', '상가').replace('lnd', '토지').replace('hs', '주택')
}