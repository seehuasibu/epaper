app.factory('Categories', function(Category){
    function Categories(categories) {
        this.categories = categories.sort(function(a, b)
        {
			  var nA = a.categoryId.toLowerCase();
			  var nB = b.categoryId.toLowerCase();

			  if(nA < nB)
				return -1;
			  else if(nA > nB)
				return 1;
			 return 0;
        });
    }
    
    Categories.build = function(data) {
        function getCategoryIds(data) {
            var categoriesIds = [];
            angular.forEach(data, function(news, key) {
                //not exists
                if(categoriesIds.indexOf(news.category) == -1) {
                    categoriesIds.push(news.category);
                }
            });
            return categoriesIds;
        }
        var categoryIds = getCategoryIds(data);
        var categories = [];
        angular.forEach(categoryIds, function(categoryId, key) {
            categories.push(Category.build(categoryId, data));
        });
        return new Categories(categories);
    }
    
    Categories.prototype.getTotal = function() {
        return this.categories.length;
    };
    Categories.prototype.getCategory = function(index) {
        return this.categories[index];
    }
    
    Categories.prototype.getTotalNews = function() {
        var total = 0;
        angular.forEach(this.categories, function(category) {
            total += category.getTotal();
        });
        return total;
    }
    Categories.prototype.getNoOfPages = function(pageSize) {
        var total = 0;
        angular.forEach(this.categories, function(category) {
            total += category.getNoOfPages(pageSize);
        }); 
        return total;
    }
    Categories.prototype.getPageNo = function(categoryIndex, categoryPageNo, pageSize) {
        var index = 0;
        var pageNo = 0;
        for (i = 0; i < categoryIndex; i++) {
            var category = this.getCategory(i);
            var noOfPages = category.getNoOfPages(pageSize);
            pageNo += noOfPages;
        }
        pageNo += categoryPageNo;
        return pageNo;
    }
    Categories.prototype.getCategoryByCategoryId = function(categoryId) {
        var category;
        angular.forEach(this.categories, function(data) {
            if(data.categoryId == categoryId) {
                category = data;
            }
        });
        return category;
    }
    Categories.prototype.getNews = function(categoryId, pageNo) {
        return this.getCategoryByCategoryId(categoryId).getNewsByPageNo(pageNo);
    }
    return Categories;
});

app.factory('Category', function(){
    var chinese_menu_dictionary = {'A': '南砂', 'B': '中区', 'C': '北砂', 'D': '新華日報', 'E': '西沙', 'F': '东沙', 'G': '西马', 'H': '体育', 'I': '国际', 'J': '娱乐', 'K': '副刊', 'L': '财经', 'M': '豆苗' }
    function Category(categoryId, news) {
        this.categoryId = categoryId;
        this.news = news;
        this.categoryDesc = chinese_menu_dictionary[categoryId];
    }
    Category.build = function(categoryId, data) {
        var arrayOfNews = [];
        angular.forEach(data, function(news, key) {
            if(news.category == categoryId) {
                arrayOfNews.push(news);
            }
        });
        return new Category(categoryId, arrayOfNews);
    }
    
    Category.prototype.getNewsStartFrom = function (currentPage, pageSize) {
        var start = currentPage * pageSize;
        var end = start + pageSize;
        return this.news.slice(start,end);
    };
    Category.prototype.getTotal = function() {
        return this.news.length;
    }
    Category.prototype.getNoOfPages = function(pageSize) {
        return Math.ceil(this.getTotal()/pageSize);  
    }
    Category.prototype.getStart = function(pageNo, pageSize) {
        return pageNo * pageSize + 1;
    }
    Category.prototype.getEnd = function(pageNo, pageSize) {
        return this.getStart(pageNo, pageSize) + pageSize - 1;
    }
    Category.prototype.getNews = function(index) {
        return this.news[index];
    }
    Category.prototype.getNewsByPageNo = function(pageNo) {
        var news = this.getNews(pageNo);
        if(news != undefined && news.pageNo == pageNo) {
            return news;
        }
        angular.forEach(this.news, function(data) {
            if(data.pageNo == pageNo) {
                news = data;
            }
        });
        return news;
    }
    Category.prototype.getCategoryDesc = function() {
        return this.categoryDesc;
    }
    
    return Category;
});

app.factory('TodayShCategories', function(TodayShCategory){
    function TodayShCategories(categories) {
        this.categories = categories.sort(function(a, b)
        {
			  var nA = a.categoryId.toLowerCase();
			  var nB = b.categoryId.toLowerCase();

			  if(nA < nB)
				return -1;
			  else if(nA > nB)
				return 1;
			 return 0;
        });
    }
    
    TodayShCategories.build = function(data) {
        function getCategoryIds(data) {
            var categoriesIds = [];
            angular.forEach(data, function(news, key) {
                //not exists
                if(categoriesIds.indexOf(news.category) == -1) {
                    categoriesIds.push(news.category);
                }
            });
            return categoriesIds;
        }
        var categoryIds = getCategoryIds(data);
        var categories = [];
        angular.forEach(categoryIds, function(categoryId, key) {
            categories.push(TodayShCategory.build(categoryId, data));
        });
        return new TodayShCategories(categories);
    }
    
    TodayShCategories.prototype.getTotal = function() {
        return this.categories.length;
    };
    TodayShCategories.prototype.getCategory = function(index) {
        return this.categories[index];
    }
    
    TodayShCategories.prototype.getTotalNews = function() {
        var total = 0;
        angular.forEach(this.categories, function(category) {
            total += category.getTotal();
        });
        return total;
    }
    
    TodayShCategories.prototype.getCategoryByCategoryId = function(categoryId) {
        var category;
        angular.forEach(this.categories, function(data) {
            if(data.categoryId == categoryId) {
                category = data;
            }
        });
        return category;
    }
    
    TodayShCategories.prototype.getNews = function(categoryId) {
        return this.getCategoryByCategoryId(categoryId).getNews();
    }
    
    return TodayShCategories;
});

app.factory('TodayShCategory', function(){
    var chinese_menu_dictionary = {'A': '南砂', 'B': '中区', 'C': '北砂', 'D': '新華日報', 'E': '西沙', 'F': '东沙', 'G': '西马', 'H': '体育', 'I': '国际', 'J': '娱乐', 'K': '副刊', 'L': '财经', 'M': '豆苗' }
    
    function TodayShCategory(categoryId, news) {
        this.categoryId = categoryId;
        this.news = news;
        this.categoryDesc = chinese_menu_dictionary[categoryId];
    }
    
    TodayShCategory.build = function(categoryId, data) {
        var arrayOfNews = [];
        angular.forEach(data, function(news, key) {
            if(news.category == categoryId) {
                arrayOfNews.push(news);
            }
        });
        return new TodayShCategory(categoryId, arrayOfNews);
    }
    
    TodayShCategory.prototype.getTotal = function() {
        return this.news.length;
    }
    
    TodayShCategory.prototype.getNews = function(index) {
        return this.news[index];
    }
    
    TodayShCategory.prototype.getCategoryDesc = function() {
        return this.categoryDesc;
    }
    
    return TodayShCategory;
});

app.factory('ePaperService', function($http, $q, Category, Categories, TodayShCategories, $cordovaPreferences) {
   	var baseUrl = 'http://shetest.theborneopost.com';
    var ePaperService = {};
    //POST login
    var loginApiUrl = '/login';
    ePaperService.login = function() {
        return $http.post(baseUrl + loginApiUrl, data)
            .then(function(status, headers){
            },function (error) {
            });
    }


    //GET /news/breaking - online version
    var breakingApiUrl = '/seehua_breaking_news.json';
    //no cache for breaking news
    ePaperService.getBreakingNews = function() {  
	     return $http.get(baseUrl + breakingApiUrl, {cache:false}).then(function(response) {
            return response.data;
        });
    }

    //GET /news/categories - epaper
    var today = new Date();//this is to get once a day
	var categoriesApiUrl = '/seehua_pdf.json?date=' + today.toISOString().substring(0, 10);;
    ePaperService.getCategories = function() {
        return $http.get(baseUrl + categoriesApiUrl, {cache:true}).then(function(response) {
            return Categories.build(response.data);
        }, function(error){
            return undefined;
        });
    }
    ePaperService.getNews = function(categoryId, pageNo) {
        return ePaperService.getCategories().then(function(categories){
           return categories.getNews(categoryId, pageNo);
        });
    }

    //GET /news/categories - today seehua (todaySh)
    var today = new Date();//this is to get once a day
	var todayShCategoriesApiUrl = '/seehua_pdf.json?date=' + today.toISOString().substring(0, 10);; // TODO: update actual api url
    ePaperService.getTodayShCategories = function() {
        return $http.get(baseUrl + todayShCategoriesApiUrl, {cache:true}).then(function(response) {
            return TodayShCategories.build(response.data);
        }, function(error){
            return undefined;
        });
    }
    
    var registerPushNotificationUrl = '/sh_rest/push_notifications';
    ePaperService.registerPushNotification = function(token, platform) {
        var request = {
            token: token,
            type: platform
        }
        console.log("request", request);
        $http.post(baseUrl + registerPushNotificationUrl, request).then(function(response){
            console.log("register push notification", response);
            $cordovaPreferences.store('token', token).success(function(value) {
                console.log("store successfully", value);
            }).error(function(error) {
                console.log("failed", error);
            });
        }, function(error){
            console.log("fail to register push notification", error);
        });
    }
    
    ePaperService.getBreakingNewsCount = function() {
        if(localStorage.getItem("breakingNewsCount") == undefined) {
            localStorage.setItem("breakingNewsCount", 0);
        }
        return parseInt(localStorage.getItem("breakingNewsCount"));
    }
    
    ePaperService.setBreakingNewsCount = function(breakingNewsCount) {
        return localStorage.setItem("breakingNewsCount", breakingNewsCount);
    }
    
    ePaperService.clearCache = function() {
        var now = new Date();
        if(localStorage.getItem("lastUpdateDate") == undefined) {
            localStorage.setItem("lastUpdateDate", new Date());
        }
        var lastUpdateDate = new Date(Date.parse(localStorage.getItem("lastUpdateDate")));
        if(lastUpdateDate.getDate() != now.getDate() || lastUpdateDate.getMonth() != now.getMonth()) {
            if(window.cache != undefined) {
                window.cache.clear();
            }                
            localStorage.setItem("lastUpdateDate", now);
        }
    }
    
	return ePaperService;
});
