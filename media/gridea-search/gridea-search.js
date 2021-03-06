/**
 * https://github.com/tangkaichuan/gridea-search
 */

(function() {
  var CACHES = checkCache()
  if (!CACHES) {
    var NOW = Date.now()
    var API_CONTENT = '/api-content/index.html' + '?_=' + NOW
    var API_INFO = '/api-info/index.html' + '?_=' + NOW
    preload(API_CONTENT)
    preload(API_INFO)
  }
  preload(getTemplateURL())
  fillSearchInput()
  fillSearchTitle()
  grideaSearch()

  // 获取 url 参数
  function getParam(url, param) {
    if (url.indexOf('?') > -1) {
      var urlSearch = url.split('?')
      var paramList = urlSearch[1].split('&')
      for (var i = paramList.length - 1; i >= 0; i--) {
        var temp = paramList[i].split('=')
        if (temp[0] === param) {
          return temp[1]
        }
      }
    }
  }

  // 获取解码后的搜索词
  function getQueryPhrase() {
    var phrase = getParam(window.location.href, 'q') || ''
    var queryPhrase = decodeURIComponent(phrase.replace(/\+/g, ' '))
    return queryPhrase
  }

  // 填充搜索输入框
  function fillSearchInput() {
    var searchForm = document.getElementById('search-form')
    var searchInput = searchForm.getElementsByTagName('input')[0]
    searchInput.value = getQueryPhrase()
  }
  
  // 填充搜索页标题
  function fillSearchTitle() {
    var queryPhrase = getQueryPhrase()
    if (queryPhrase === '' || typeof (queryPhrase) === 'undefined') {
      // do nothing
    } else {
      document.getElementById("search-title").innerHTML += (": <span class='searched-keyword'>" + getQueryPhrase() + "</span>");
    }
  }

  // preload
  function preload(url) {
    var preloadLink = document.createElement('link')
    preloadLink.href = url
    preloadLink.rel = 'preload'
    preloadLink.as = 'fetch'
    preloadLink.crossOrigin = 'anonymous'
    document.head.appendChild(preloadLink)
  }

  // 异步 GET 请求
  function get(obj) {
    var xhr = new XMLHttpRequest()
    xhr.open('get', obj.url, true)
    xhr.send(null)
    xhr.onreadystatechange = function() {
      // 异步请求：响应状态为4，数据加载完毕
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          obj.success(xhr.responseText)
        } else {
          obj.error(xhr.status)
        }
      }
    }
  }

  // 模糊搜索 https://github.com/krisk/fuse
  function fuzzySearch(data, phrase) {
    var options = {
      includeMatches: true,
      ignoreLocation: true,
      keys: [
        'title',
        'content'
      ]
    }
    // eslint-disable-next-line no-undef
    var fuse = new Fuse(data, options)
    var fuzzyResult = fuse.search(phrase)
    return fuzzyResult
  }

  // 检查缓存是否最新
  function checkCache() {
    var caches = {}
    caches.infos = JSON.parse(localStorage.getItem('InfosCache'))
    caches.contents = JSON.parse(localStorage.getItem('ContentsCache'))
    if (caches.infos && caches.contents) {
      var cachedTime = caches.infos.utils.now.toString()
      var updateTime = document.getElementById('search-result').getAttribute('data-update')
      if (cachedTime === updateTime) {
        return caches
      }
    }
    localStorage.removeItem('InfosCache')
    localStorage.removeItem('ContentsCache')
    return false
  }

  // 获取博客全文 api
  function getContents(callback) {
    if (CACHES) {
      callback(CACHES.contents)
    } else {
      get({
        url: API_CONTENT,
        success: function(data) {
          callback(JSON.parse(data))
          localStorage.setItem('ContentsCache', data)
        }
      })
    }
  }

  // 获取博客信息 api
  function getInfos(callback) {
    if (CACHES) {
      callback(CACHES.infos)
    } else {
      get({
        url: API_INFO,
        success: function(data) {
          callback(JSON.parse(data))
          localStorage.setItem('InfosCache', data)
        }
      })
    }
  }

  // 根据一段文本调用模糊搜索
  function searchBy(phrase, callback) {
    var result = ''
    var getFuzzyResult = function(data) {
      result = fuzzySearch(data.posts, phrase)
      callback(result)
    }
    // 根据全文内容获取搜索结果
    getContents(getFuzzyResult)
  }

  // 显示无搜索结果
  function showNoResult() {
    var resultDIV = document.getElementById('search-result')
    var noResult = resultDIV.getElementsByClassName('no-result')[0]
    noResult.style.display = 'block'
    resultDIV.innerHTML = noResult.outerHTML
  }

  // 根据解码后的搜索词执行搜索
  function searchByPhrase(resultHandler) {
    var queryPhrase = getQueryPhrase()
    if (queryPhrase === '' || typeof (queryPhrase) === 'undefined') {
      showNoResult()
    } else {
      searchBy(queryPhrase, resultHandler)
    }
  }

  // 获取搜索结果列表模板的 URL
  function getTemplateURL() {
    var scripts = document.getElementsByTagName('script')
    var templateURL = ''
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].type === 'text/ejs') {
        templateURL = scripts[i].src
        return templateURL
      }
    }
  }

  // 渲染搜索结果列表 ejs https://github.com/mde/ejs
  function renderResult(searchedInfos) {
    if (searchedInfos.posts.length > 0) {
      get({
        url: getTemplateURL(),
        success: function(data) {
          var resultDIV = document.getElementById('search-result')
          // eslint-disable-next-line no-undef
          resultDIV.innerHTML = ejs.compile(data)(searchedInfos)
        }
      })
    } else {
      showNoResult()
    }
  }

  // 搜索结果关键字高亮
  function keywordHighlight(searchedContent) {
    var searchedPostContent = searchedContent.item.content// 搜索结果内容预览
    var preview = ''
    for (var i = 0; i < searchedContent.matches.length; i++) {
      if (searchedContent.matches[i].key === 'content') { // 如果匹配到文章内容，截取关键字
        var indices = searchedContent.matches[i].indices[0]
        var beforeKeyword = searchedPostContent.substring(indices[0] - 20, indices[0])// 关键字前20字
        var keyword = searchedPostContent.substring(indices[0], indices[1] + 1)// 关键字
        var afterKeyword = searchedPostContent.substring(indices[1] + 1, indices[1] + 80)// 关键字后80字
        preview = beforeKeyword + '<span class="searched-keyword">' + keyword + '</span>' + afterKeyword
      } else { // 没有匹配到文章内容，则是标题，直接截取前80字
        // preview = searchedPostContent.substring(0, 80)
        var indices = searchedContent.matches[i].indices[0]
        var beforeKeyword = searchedPostContent.substring(0, indices[0])// 关键字前
        var keyword = searchedPostContent.substring(indices[0], indices[1] + 1)// 关键字
        var afterKeyword = searchedPostContent.substring(indices[1] + 1, indices[1] + 40)// 关键字后40字
        preview = beforeKeyword + '<span class="searched-keyword">' + keyword + '</span>' + afterKeyword
      }
    }
    return preview + '...'
  }

  // 循环匹配搜索到的内容与展示信息
  function getResult(infos, searchedContents) {
    var searchedInfos = JSON.parse(JSON.stringify(infos))// 对象深拷贝
    searchedInfos.posts = []
    for (var i = 0; i < searchedContents.length; i++) {
      for (var j = 0; j < infos.posts.length; j++) {
        if (searchedContents[i].item.link === infos.posts[j].link) {
          infos.posts[j].searchedPreview = keywordHighlight(searchedContents[i])// 预览关键字高亮
          infos.posts[j].content = searchedContents[i].item.content// content注入
          searchedInfos.posts.push(infos.posts[j])// push到所需结果中
        }
      }
    }
    return searchedInfos
  }

  // 主方法
  function grideaSearch() {
    // 搜索结果回调
    var resultHandler = function(searchedContents) {
      getInfos(function(infos) {
        // console.log(infos);
        // console.log(searchedContents);
        var searchedInfos = getResult(infos, searchedContents)
        renderResult(searchedInfos)
      })
    }
    searchByPhrase(resultHandler)
  }
})()
