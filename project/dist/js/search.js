var search;

search = {
  searched: [],
  searchAssets: function(src, e) {
    if (e.key === 'Enter'.toString()) {
      if ($('#searchBldName').val().trim() === '' && $('#searchBldMemo').val().trim() === '') {
        this.searched = [];
        return this.showSearched();
      } else {
        return this.getSearchedList();
      }
    }
  },
  getSearchedList: function() {
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
    return instance.get('assetSearchedV2').then(function(response) {
      _this.searched = _.reverse(response.data);
      return _this.showSearched();
    }).catch(function(error) {
      return console.log(error);
    });
  },
  showSearched: function() {
    var i, idx, len, ref, results, sc;
    request.getRequests();
    if (this.searched.length === 0) {
      return $('#searchResult').hide();
    } else {
      $('#searchResult').show();
      $('#searched').empty();
      ref = this.searched;
      results = [];
      for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
        sc = ref[idx];
        results.push($('#searched').append(`<div onclick='search.selectSearched(${idx})'>` + `<div>[${asset.decodeBldType(sc.bld_type)}] ${sc.bld_name}</div>` + `<div>${sc.plat_plc}</div></div>`));
      }
      return results;
    }
  },
  selectSearched: function(idx) {
    asset.selectedAsset = this.searched[idx];
    asset.selectAssetResult();
    nMap.map.setCenter(new naver.maps.LatLng(this.searched[idx].bld_map_y, this.searched[idx].bld_map_x));
    nMap.map.setZoom(14);
    nMap.getAssetsInBound();
    return nMap.setPano(this.searched[idx]);
  },
  clearSearched: function() {
    $('#searchBldName').val('');
    $('#searchBldMemo').val('');
    this.searched = [];
    return this.showSearched();
  }
};
