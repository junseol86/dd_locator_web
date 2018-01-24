fltr = {
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

  filterApply: () ->
    request.getRequests()
    nMap.getAssetsInBound()
 
  filterBldType: (src, e) ->
    this.filter.bldType = $(src).val()
    this.filterApply()

  filterHasName: (src, e) ->
    this.filter.hasName = $(src).val()
    this.filterApply()

  filterHasNumber: (src, e) ->
    this.filter.hasNumber = $(src).val()
    this.filterApply()

  filterHasGwan: (src, e) ->
    this.filter.hasGwan = $(src).val()
    this.filterApply()

  filterFmly: (src, e, which) ->
    if e.key ==  'Enter'.toString()
      if $.isNumeric $(src).val()
        this.filter[which] = $(src).val()
        this.filterApply()
      else
        if ($(src).val().trim() == '')
          this.filter[which] = -1
          this.filterApply()
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
      this.filterApply()

  filterUseaprDay: (src, e) ->
    if e.key ==  'Enter'.toString()
      if ($.isNumeric $(src).val()) and ($(src).val().length == 4)
        this.filter.useaprDay = $(src).val()
        this.filterApply()
      else
        if ($(src).val().trim() == '')
          this.filter.useaprDay = -1
          this.filterApply()
        else
          alert '4자리 년도만 입력하세요.'

  resetFilter: () ->
    this.filter = Object.assign {}, this.filterReset
    $('.has').val(0)
    $('#bldTypeFilter').val('one')
    $('.toReset').val('')
    nMap.getAssetsInBound()
    this.filterApply()

}