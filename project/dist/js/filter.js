var fltr;

fltr = {
  filter: null,
  filterReset: {
    bldType: 'one',
    hasName: 0,
    hasNumber: 0,
    hasGwan: 0,
    fmlyMin: -1,
    fmlyMax: -1,
    mainPurps: '',
    useaprDay: ''
  },
  filterApply: function() {
    request.getRequests();
    return nMap.getAssetsInBound();
  },
  filterBldType: function(src, e) {
    this.filter.bldType = $(src).val();
    return this.filterApply();
  },
  filterHasName: function(src, e) {
    this.filter.hasName = $(src).val();
    return this.filterApply();
  },
  filterHasNumber: function(src, e) {
    this.filter.hasNumber = $(src).val();
    return this.filterApply();
  },
  filterHasGwan: function(src, e) {
    this.filter.hasGwan = $(src).val();
    return this.filterApply();
  },
  filterFmly: function(src, e, which) {
    if (e.key === 'Enter'.toString()) {
      if ($.isNumeric($(src).val())) {
        this.filter[which] = $(src).val();
        return this.filterApply();
      } else {
        if ($(src).val().trim() === '') {
          this.filter[which] = -1;
          return this.filterApply();
        } else {
          return alert('숫자만 입력하세요.');
        }
      }
    }
  },
  searchAddr: function(src, e) {
    var instance;
    if (e.code === 'Enter'.toString()) {
      instance = axios.create({
        baseURL: consts.apiUrl,
        headers: {
          address: encodeURIComponent($(src).val())
        }
      });
      return instance.get("locateAddress").then(function(response) {
        var pos;
        pos = response.data;
        nMap.map.setCenter(new naver.maps.LatLng(pos.y, pos.x));
        return nMap.map.setZoom(12);
      }).catch(function(error) {
        return console.log(error);
      });
    }
  },
  filterMainPurps: function(src, e) {
    if (e.key === 'Enter'.toString()) {
      this.filter.mainPurps = encodeURIComponent($(src).val());
      return this.filterApply();
    }
  },
  filterUseaprDay: function(src, e) {
    if (e.key === 'Enter'.toString()) {
      if (($.isNumeric($(src).val())) && ($(src).val().length === 4)) {
        this.filter.useaprDay = $(src).val();
        return this.filterApply();
      } else {
        if ($(src).val().trim() === '') {
          this.filter.useaprDay = -1;
          return this.filterApply();
        } else {
          return alert('4자리 년도만 입력하세요.');
        }
      }
    }
  },
  resetFilter: function() {
    this.filter = Object.assign({}, this.filterReset);
    $('.has').val(0);
    $('#bldTypeFilter').val('one');
    $('.toReset').val('');
    nMap.getAssetsInBound();
    return this.filterApply();
  }
};
