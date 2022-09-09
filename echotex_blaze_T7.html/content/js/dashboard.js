/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 95.03105590062111, "KoPercent": 4.968944099378882};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6369047619047619, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5714285714285714, 500, 1500, "https://www.echotex.com/-11"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://www.echotex.com/-10"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://www.echotex.com/-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.echotex.com/api/census/button-render"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.echotex.com/-0"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://www.echotex.com/-12"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://www.echotex.com/-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://www.echotex.com/-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://www.echotex.com/-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://www.echotex.com/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.echotex.com/-5"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://www.echotex.com/-6"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://www.echotex.com/-7"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://www.echotex.com/-8"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://www.echotex.com/-9"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://www.echotex.com/api/census/RecordHit"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.echotex.com/api/1/performance/settings"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.echotex.com/"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://www.echotex.com/-14"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 161, 8, 4.968944099378882, 1010.385093167702, 0, 8234, 402.0, 2707.6, 4496.300000000001, 7863.859999999997, 12.545780409880777, 3186.5669654163094, 13.192839627327983], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.echotex.com/-11", 7, 1, 14.285714285714286, 612.1428571428571, 2, 1575, 471.0, 1575.0, 1575.0, 1575.0, 1.260806916426513, 27.861405518281703, 0.6173873153818444], "isController": false}, {"data": ["https://www.echotex.com/-10", 7, 1, 14.285714285714286, 2297.0, 53, 4508, 2462.0, 4508.0, 4508.0, 4508.0, 1.240474924685451, 881.6114821460217, 0.6022395002658161], "isController": false}, {"data": ["https://www.echotex.com/-13", 7, 1, 14.285714285714286, 622.4285714285714, 0, 1412, 406.0, 1412.0, 1412.0, 1412.0, 1.3305455236647026, 28.74204791151872, 0.7072235554077172], "isController": false}, {"data": ["https://www.echotex.com/api/census/button-render", 35, 0, 0.0, 336.65714285714296, 276, 408, 342.0, 386.4, 403.2, 408.0, 8.345255126371006, 2.567143910944206, 8.322436069384835], "isController": false}, {"data": ["https://www.echotex.com/-0", 7, 0, 0.0, 3104.4285714285716, 1626, 5909, 2886.0, 5909.0, 5909.0, 5909.0, 0.7200905256660838, 57.65184587490999, 0.3537163421973048], "isController": false}, {"data": ["https://www.echotex.com/-12", 7, 1, 14.285714285714286, 1040.857142857143, 0, 1919, 896.0, 1919.0, 1919.0, 1919.0, 1.3250047321597578, 580.5038345282036, 0.6843146649630891], "isController": false}, {"data": ["https://www.echotex.com/-1", 7, 0, 0.0, 392.85714285714283, 264, 505, 392.0, 505.0, 505.0, 505.0, 1.1358104819081618, 2.190808555086808, 0.6743874736329709], "isController": false}, {"data": ["https://www.echotex.com/-2", 7, 0, 0.0, 753.0, 345, 1953, 573.0, 1953.0, 1953.0, 1953.0, 1.1212558065032836, 21.532710385631905, 1.454128624058946], "isController": false}, {"data": ["https://www.echotex.com/-3", 7, 0, 0.0, 473.7142857142857, 225, 1183, 370.0, 1183.0, 1183.0, 1183.0, 1.1385816525699415, 49.04240327138907, 0.6015358144925179], "isController": false}, {"data": ["https://www.echotex.com/-4", 7, 0, 0.0, 411.99999999999994, 238, 571, 437.0, 571.0, 571.0, 571.0, 1.138766878151944, 91.8898128660322, 0.6016336729298845], "isController": false}, {"data": ["https://www.echotex.com/-5", 7, 0, 0.0, 366.42857142857144, 216, 493, 401.0, 493.0, 493.0, 493.0, 1.1376564277588168, 50.58682629408419, 0.6588186149032993], "isController": false}, {"data": ["https://www.echotex.com/-6", 7, 0, 0.0, 998.1428571428571, 425, 2524, 705.0, 2524.0, 2524.0, 2524.0, 1.0685391543275835, 601.5291081514273, 0.6281841512746146], "isController": false}, {"data": ["https://www.echotex.com/-7", 7, 0, 0.0, 737.5714285714286, 256, 1520, 504.0, 1520.0, 1520.0, 1520.0, 1.1560693641618498, 138.2981846098266, 0.6683526011560694], "isController": false}, {"data": ["https://www.echotex.com/-8", 7, 1, 14.285714285714286, 864.5714285714287, 62, 1856, 929.0, 1856.0, 1856.0, 1856.0, 1.2129613585167216, 250.76351585513777, 0.6041116141050078], "isController": false}, {"data": ["https://www.echotex.com/-9", 7, 1, 14.285714285714286, 1560.142857142857, 62, 3144, 1048.0, 3144.0, 3144.0, 3144.0, 1.2222804260520341, 635.9200388510563, 0.6015911471974855], "isController": false}, {"data": ["https://www.echotex.com/api/census/RecordHit", 7, 0, 0.0, 401.71428571428567, 282, 557, 354.0, 557.0, 557.0, 557.0, 2.32249502322495, 0.7144393870272064, 3.3022976111479765], "isController": false}, {"data": ["https://www.echotex.com/api/1/performance/settings", 7, 0, 0.0, 298.2857142857143, 275, 364, 294.0, 364.0, 364.0, 364.0, 2.319416832339298, 0.563998819582505, 0.9852991426441352], "isController": false}, {"data": ["Test", 7, 1, 14.285714285714286, 8427.285714285716, 5031, 10564, 9012.0, 10564.0, 10564.0, 10564.0, 0.539249672598413, 1575.6812240004622, 8.363560805215315], "isController": true}, {"data": ["https://www.echotex.com/", 7, 1, 14.285714285714286, 6043.857142857143, 2971, 8234, 6623.0, 8234.0, 8234.0, 8234.0, 0.6708193579300431, 1958.7250501617152, 5.8204435194058455], "isController": false}, {"data": ["https://www.echotex.com/-14", 7, 1, 14.285714285714286, 576.4285714285714, 0, 1336, 377.0, 1336.0, 1336.0, 1336.0, 1.440329218106996, 69.66969682355966, 0.6908275462962963], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 4, 50.0, 2.484472049689441], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 3, 37.5, 1.8633540372670807], "isController": false}, {"data": ["Assertion failed", 1, 12.5, 0.6211180124223602], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 161, 8, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 3, "Assertion failed", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://www.echotex.com/-11", 7, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.echotex.com/-10", 7, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.echotex.com/-13", 7, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.echotex.com/-12", 7, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.echotex.com/-8", 7, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.echotex.com/-9", 7, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.echotex.com/", 7, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.echotex.com/-14", 7, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
