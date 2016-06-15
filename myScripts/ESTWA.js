/* global define:true, requirejs:true, $: true*/


var configurator;
var gInterface;
var appConstructor;

define(['myScripts/AppConstructor',
        'myScripts/GlobeInterface',
        'myScripts/Globe',
        'myScripts/Configurator',
        'myScripts/HandlePicks',
        'myScripts/UserInterface',
        'myScripts/GlobeHelper'
    ],
    function (AppConstructor,
              GlobeInterface,
              Globe,
              Configurator,
              HandlePicks,
              UI,
              GlobeHelper) {

        var ESTWA;
        ESTWA = function (options) {
            var globe = new Globe({id: options.globe});
            gInterface = new GlobeInterface(globe);
            appConstructor = new AppConstructor();
            gInterface.setUI(new UI(gInterface));
            var handlePicks = new HandlePicks();
            gInterface.UI.handlePick=handlePicks;
            var compare = 0;
            var bigEnabled = 0;

        
            $("#changeValues").click(function () {
                var val = Number($("#changeHeight").val());
                var big = Number($("#changeBig").val());
                var stat = Number($("#changeStat").val());
                gInterface.updateOpt([val, big, stat]);
            });
            $("#checkCompare").change(function () {
                compare = $("#checkCompare").is(':checked') ? 1 : 0;
                gInterface.compare = compare;
                gInterface.UI.resetFilter();
            });

            $("#loadConfig").click(function () {

                configurator = new Configurator();
                var urlRef = $("input[option='re1']").val();

                var promiseDataConfig = new Promise(function (resolve) {
                    configurator.getConfig(urlRef, resolve);
                });

                promiseDataConfig.then(function (data) {
                    for (var x = 0; x < data.length; x++) {
                        $('.timeConfig, .gridConfig, .dataConfig, .latitudeConfig, .longitudeConfig')
                            .append($("<option></option>")
                                .attr("value", x)
                                .text(data[x]));
                    }
                });
                $("#configType").show();
                $("#advanced").show();


            });

            $("#loadConfigCompare").click(function () {
                $("#configSelectorCompare").show();
                configurator = new Configurator();
                var urlRef = $("input[option='co1']").val();
                var promiseConfig = new Promise(function (resolve) {
                    configurator.getConfig(urlRef, resolve);
                });

                promiseConfig.then(function (data) {
                    for (var x = 0; x < data.length; x++) {
                        $('#timeConfigCompare, #gridConfigCompare, #dataConfigCompare')
                            .append($("<option></option>")
                                .attr("value", x)
                                .text(data[x]));
                    }
                });
            });
            $('#addData').click(function () {
                try {
                    var half = 1;
                    var urlCompare = $("input[option='co1']").val();
                    var idSeparator = $("input[option='co6']").val();
                    var timeCompare = Number($("select[option='co3']").val());
                    var gridCompare = Number($("select[option='co4']").val());
                    var separatorCompare = $("input[option='co2']").val();
                    var dataCompare = $("select[option='co5']").val();
                    $(".checkCompare").show();

                    var config_1 = {
                        time: timeCompare,
                        id: gridCompare,
                        data: dataCompare,
                        half: half,
                        separator: separatorCompare,
                        idSeparator: idSeparator,
                        url: urlCompare,
                        reference: 0
                    };
                    appConstructor.newData(config_1, gInterface);
                    $("#afterType option[value=2]").attr("disabled","disabled");
                } catch (e) {
                    gInterface.UI.alert(e);
                }
            });
            $("input[option='heightExtrusion']").change(function () {
                var checked = $("input[option='heightExtrusion']").is(':checked') ? 1 : 0;
                if (checked) {
                    $("input[option='shown']").val(1);
                    $("input[option='shown']").attr("disabled", true);
                } else {
                    $("input[option='shown']").attr("disabled", false);
                }

            });
            $("#start").click(function () {
                $("#loading").show();
                $("#openButton").click();
                var gridUrl = $("input[option='gr1']").val();
                var urlRef = $("input[option='re1']").val();
                var timeRef = Number($("select[option='re3']").val());
                var gridRef = Number($("select[option='re4']").val());
                var separatorRef = $("input[option='re2']").val();
                var idSeparator = $("input[option='re6']").val();
                var dataRef = $("select[option='re5']").val();
                var latitudeRef = Number($(".latitudeConfig").val());
                var longitudeRef = Number($(".longitudeConfig").val());
                var reference = 0;

                var timeRefCSV = Number($("select[option='re8']").val());

                var quadSub = Number($("input[option='re10']").val());
                var dataRefCSV = $("select[option='re9']").val();

                var heightExtrusion = $("input[option='heightExtrusion']").is(':checked') ? 1 : 0;
                var csvImporting = $("input[option='csvImporting']").is(':checked') ? 1 : 0;

                var height = Number($("input[option='heightCube']").val());
                var shown = Number($("input[option='shown']").val());
                var maxApp = Number($("input[option='maxApp']").val());
                var subxy = Number($("input[option='subxy']").val());
                var subz = Number($("input[option='subz']").val());
                var initH = Number($("input[option='initH']").val());
                var statIndex = Number($("select[option='statIndex']").val());

                $("#alert").css("visibility", "hidden");
                $("#alert").css("visibility", "hidden");
                $("#controls").hide();
                $(".afterControls").show();
                
             
       
              

                var maxColor = $("input[name='maxcolor']").val();
                var minColor = $("input[name='mincolor']").val();
                var midColor = $("input[name='midcolor']").val();
                var colors = [GlobeHelper.getRGB(minColor), GlobeHelper.getRGB(midColor), GlobeHelper.getRGB(maxColor)];



                $("#legendScale").css("background","linear-gradient(to bottom,"+minColor+" 0%,"+midColor+" 50%,"+maxColor+" 100%)");
                $("#legendScale").css("background","-moz-linear-gradient(to bottom,"+minColor+" 0%,"+midColor+" 50%,"+maxColor+" 100%)");
                $("#legendScale").css("background","-webkit-linear-gradient(to bottom,"+minColor+" 0%,"+midColor+" 50%,"+maxColor+" 100%)");
                
                var refSystem = $("input[option='refSystem']").val();
                var csvZone = Number($("input[option='csvZone']").val());

                var half = 0;
                appConstructor.init({
                    globe: 'canvasOne',
                    gridUrl: gridUrl,
                    isCSV: csvImporting,
                    csv: {
                        csvUrl: urlRef,
                        zone: csvZone,
                        source: refSystem,
                        time: timeRefCSV,
                        data: dataRefCSV,
                        quadSub: quadSub
                    },

                    config_0: {
                        time: timeRef,
                        id: gridRef,
                        data: dataRef,
                        half: half,
                        separator: separatorRef,
                        idSeparator: idSeparator,
                        url: urlRef,
                        reference: reference,
                        heightExtrusion: heightExtrusion,
                        lat: latitudeRef,
                        lng: longitudeRef
                    },
                    heightCube: height,
                    /*  cube's height                               */
                    maxShown: shown,
                    /*  max smallVoxels in view                          */
                    maxInApp: maxApp,
                    /*  max smallVoxels in the app                       */
                    startHeight: initH,
                    /*  initial height                              */
                    sub: subxy,
                    /*  sq. root of number of cubes                 */
                    heightDim: subz,
                    /*  height subdivision                          */
                    autoTime: 0,
                    /*  automatic big cubes generation              */
                    statIndex: statIndex,
                    /*  0: wAvg, 1:aAvg, 2:var, 3:med, 4:max, 5:min */
                    maxDownload: 2000,
                    /*  max cubes downloded                         */
                    colors: colors
                    /*  colors for min and max voxels               */



                }, gInterface);
            });

            $('input[name=optradio]').change(function () {

                var val0 = Number($('input[name=optradio]:checked', '#radioButtons').val());
                
                if (globe.eventListeners.dblclick) {
                    globe.removeEventListener("dblclick", self.handlePick);
                }
                var handle;
                if (val0) {
                    gInterface.UI.resetFilter();
                    gInterface.makeBigDoxels();
                    bigEnabled = 1;
                    var rect = gInterface.rect;
                    var bigCubes = gInterface.bigVoxels.layers;
                    handle = handlePicks.getBigDoxels(rect, bigCubes, globe);
                    globe.addEventListener("dblclick", handle);
                    self.handlePick = handle;

                } else {
                    handle = handlePicks.getDoxel(gInterface);
                    self.handlePick = handle;
                    globe.addEventListener("dblclick", handle);
                }

            });
        };

        return ESTWA;

    }
)
;

