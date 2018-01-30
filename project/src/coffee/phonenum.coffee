phonenum = {
  phonenums: []

  searchPhonenum: (src, e) ->
    if e.key ==  'Enter'.toString()
      filted = this.filtNonNumeric $('#phonenumSearch').val()
      if filted != ''
        this.getPhonenums(filted)
      else
        this.phonenums = []
        this.showPhonenums()

  getPhonenums: (kwd) ->
    _this = this
    
    instance = axios.create {
      baseURL: consts.apiUrl
      headers: {
        keyword: kwd
      }
    }
    instance.get 'phoneNumberList'
    .then (response) ->
      _this.phonenums = response.data
      _this.showPhonenums()
    .catch (error) ->
      console.log(error)

  filtNonNumeric: (str) ->
    result = ''
    for char, idx in str
      if !isNaN(char)
        result += char
    result
    
  filtNonNumericOrDash: (str) ->
    result = ''
    for char, idx in str
      if !isNaN(char) || char == '-'
        result += char
    result

  showPhonenums: () ->
    $('#phonenumResult').empty()
    if this.phonenums.length != 0
      $('#afterPhonenumSearch').show()
      for pn, idx in this.phonenums
        $('#phonenumResult').append(
          '<tr>' +
          "<td>#{pn.pn_belong}</td>" +
          "<td>#{pn.pn_number}</td>" +
          "<td onclick='phonenum.deletePhonenum(#{pn.pn_idx})'>" +
          if pn.pn_idx == 0 then "" else "<i class='fa fa-times-circle'></i>삭제" +
          "</td>" +
          '</tr>'
        )
    else
      $('#afterPhonenumSearch').hide()

  savePhonenum: (src, e) ->
    if e.key ==  'Enter'.toString()
      _this = this
      phonenumNumber = this.filtNonNumericOrDash $('#phonenumSearch').val()
      phonenumBelong = $('#phonenumBelong').val()

      if phonenumNumber.trim() == '' || phonenumBelong.trim() == ''
        alert '전화번호와 번호주를 입력하세요.'
      else
        phonenumObj = {
          pn_number: phonenumNumber
          pn_belong: phonenumBelong
        }
        
        axios.post consts.apiUrl + 'phoneNumberInsert', phonenumObj, {
          headers: {}
        }, {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
        .then (result) ->
          _this.getPhonenums phonenumNumber
          $('#phonenumBelong').val ''
        .catch (error) ->
          console.log(error)

  deletePhonenum: (pnIdx) ->
    if confirm '이 전화번호를 삭제하시겠습니까?'
      _this = this
      headerObj = {
        'pn_idx': pnIdx
      }
      
      instance = axios.create {
        baseURL: consts.apiUrl
        headers: headerObj
      }
      instance.delete 'phoneNumberDelete'
      .then (response) ->
        _this.getPhonenums _this.filtNonNumeric $('#phonenumSearch').val()
      .catch (error) ->
        console.log(error)
    
}