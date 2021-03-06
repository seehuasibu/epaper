﻿﻿angular.module('gesture-pdf', [])

// Directive to manipulate pdfs with gestures
.directive('pdfGesture', function ($window, $ionicGesture) {
    var renderTask = [];
    var pdfLoaderTask = null;
    var debug = false;

    var backingScale = function (canvas) {
        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var bsr = ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio || 1;

        return dpr / bsr;
    };

    var setCanvasDimensions = function (canvas, w, h) {
        var ratio = backingScale(canvas);
        canvas.width = Math.floor(w * ratio);
        canvas.height = Math.floor(h * ratio);
        canvas.style.width = Math.floor(w) + 'px';
        canvas.style.height = Math.floor(h) + 'px';
        canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
        return canvas;
    };

    return {
        restrict: 'E',
//        transclude: true,
//        scope: {
//            ngPdfOptions: '='
//            //ngPdfOptions.pdfUrl: Url to the pdf
//            //ngPdfOptions.onLoad: method to call after loading a pdf. (numPages) is the argument passed stating the number of pages in the pdf
//            //ngPdfOptions.onProgress: method to call to evaluate the loading progress
//            //ngPdfOptions.onError: method to call if an error occurs
//            //ngPdfOptions.onPageRender: method to call if a pages finishes to render
//            //ngPdfOptions.httpHeaders: http headers to download pdf
//        },
        link: function (scope, element, attrs) {
			
			/*var outerButtonContainer = document.createElement("div"); 
			outerButtonContainer.id = 'outer-button-container';
			outerButtonContainer.innerHTML = "<br><br><br>";
            	
			container.append(outerButtonContainer);		
			*/	
			var container = angular.element('<div class="pdf-container"></container>');		
			
            element.append(container);
            var timer = null;
            var pageFit = true;
            var pinch = 0;
            var scale = 1;
            var canvas = [];
            var ctx = [];
            var windowEl = angular.element($window);
            var pdfDoc = null;
            var options = scope.options;
            var left = 0;
            var windowWidth = $window.innerWidth;
            var canvasWidth = 0;
            container.css('width', windowWidth + 'px');
            container.css('height', $window.innerHeight * 0.8 + 'px');
            var zoomTime = 0;
            PDFJS.disableWorker = true;
            PDFJS.disableRange = true;

            scope.pdfCtrl.fitPage = function () {
                zoomTime = 0;
                if (pdfDoc) {
                    pageFit = true;
                    for (i = 1; i <= pdfDoc.numPages; i++) {
                        renderPage(i);
                    }
                }
            };
            
            scope.pdfCtrl.zoomIn = function () {
                zoomTime += 1;
                if (pdfDoc && zoomTime <= 6) {
                    pageFit = false;
                    scale += .2;
                    for (i = 1; i <= pdfDoc.numPages; i++) {
                        renderPage(i);
                    }
                }
            };

            scope.pdfCtrl.zoomOut = function () {
                zoomTime -= 1;
                if (pdfDoc) {
                    pageFit = false;
                    scale -= .2;
                    for (i = 1; i <= pdfDoc.numPages; i++) {
                        renderPage(i);
                    }
                }
            };

            var renderPage = function (num) {
                if (renderTask[num - 1] && renderTask[num - 1].internalRenderTask) {
                    renderTask[num - 1].internalRenderTask.cancel();
                }

                pdfDoc.getPage(num).then(function (page) {
                    var viewport;
                    var pageWidthScale;
                    var renderContext;

                    if (pageFit) {
                        viewport = page.getViewport(1);
                        var clientRect = element[0].getBoundingClientRect();
                        pageWidthScale = clientRect.width / viewport.width;
                        scale = pageWidthScale;
                    }
                    viewport = page.getViewport(scale);
                    canvasWidth = viewport.width;
                    setCanvasDimensions(canvas[num - 1], viewport.width, viewport.height);

                    renderContext = {
                        canvasContext: ctx[num - 1],
                        viewport: viewport
                    };

                    renderTask[num - 1] = page.render(renderContext);
                    renderTask[num - 1].promise.then(function () {
                        if (typeof options.onPageRender === 'function') {
                            options.onPageRender(num);
                        }
                    }).catch(function (reason) {
                        if (typeof options.onError === 'function') {
                            options.onError(reason);
                        }
                    });
                });
            };

            var clearCanvas = function (num) {
                if (ctx && ctx[num]) {
                    ctx[num].clearRect(0, 0, canvas[num].width, canvas[num].height);
                }
            };

            var renderPDF = function () {
                if (ctx) {
                    for (i = 0; i < ctx.length; i++) {
                        clearCanvas(i);
                    }
                }
                var params = {
                    'url': options.pdfUrl,
                    'withCredentials': (options.httpHeaders == undefined)
                };

                if (params.withCredentials) {
                    params.httpHeaders = options.httpHeaders;
                }

                if (options.pdfUrl && options.pdfUrl.length) {
                    pdfLoaderTask = PDFJS.getDocument(params);
                    pdfLoaderTask.onProgress = options.onProgress;
                    
                    pdfLoaderTask.then(
                        function (_pdfDoc) {
                            if (typeof options.onLoad === 'function') {
                                options.onLoad(_pdfDoc.numPages);
                            }
                            pdfDoc = _pdfDoc;
                            for (i = 1; i <= _pdfDoc.numPages; i++) {
                                if (!canvas[i - 1]) {
                                    var cnv = angular.element('<canvas></canvas>');
                                    canvas[i - 1] = cnv[0];
                                    container.append(cnv);
                                    ctx[i - 1] = canvas[i - 1].getContext('2d');
                                }
                                renderPage(i);
                            }
                        }, function (error) {
                            if (error) {
                                if (typeof options.onError === 'function') {
                                    options.onError(error);
                                }
                            }
                        }
                    );
                }
            };
            
            scope.$watch('pdfCtrl.options', function (newVal) {
                options = newVal;
                if (newVal !== '' && newVal !== undefined) {
                    if (debug) {
                        console.log('pdfUrl value change detected: ', newVal);
                    }
                    renderPDF();
                    
                }
            });

            var zoom = function () {
                if (pdfDoc) {
                    pageFit = false;
                    scope.$apply(function () {
                        for (i = 1; i <= pdfDoc.numPages; i++) {
                            renderPage(i);
                        }
                    });

                }
            };
        }
    }
});