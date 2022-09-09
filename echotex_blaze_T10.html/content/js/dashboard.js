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

    var data = {"OkPercent": 96.08695652173913, "KoPercent": 3.9130434782608696};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6979166666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://www.echotex.com/-11"], "isController": false}, {"data": [0.35, 500, 1500, "https://www.echotex.com/-10"], "isController": false}, {"data": [0.7, 500, 1500, "https://www.echotex.com/-13"], "isController": false}, {"data": [0.97, 500, 1500, "https://www.echotex.com/api/census/button-render"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.echotex.com/-0"], "isController": false}, {"data": [0.3, 500, 1500, "https://www.echotex.com/-12"], "isController": false}, {"data": [0.95, 500, 1500, "https://www.echotex.com/-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://www.echotex.com/-2"], "isController": false}, {"data": [0.85, 500, 1500, "https://www.echotex.com/-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://www.echotex.com/-4"], "isController": false}, {"data": [0.85, 500, 1500, "https://www.echotex.com/-5"], "isController": false}, {"data": [0.35, 500, 1500, "https://www.echotex.com/-6"], "isController": false}, {"data": [0.9, 500, 1500, "https://www.echotex.com/-7"], "isController": false}, {"data": [0.8, 500, 1500, "https://www.echotex.com/-8"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.echotex.com/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.echotex.com/api/census/RecordHit"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.echotex.com/api/1/performance/settings"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.echotex.com/"], "isController": false}, {"data": [0.8, 500, 1500, "https://www.echotex.com/-14"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 230, 9, 3.9130434782608696, 846.5434782608694, 1, 9453, 366.5, 1827.2000000000003, 3217.899999999998, 8105.259999999998, 13.784010547764593, 3636.72179334472, 14.762094720124656], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.echotex.com/-11", 10, 0, 0.0, 270.2, 245, 372, 263.0, 361.80000000000007, 372.0, 372.0, 0.975609756097561, 24.898246951219512, 0.5573551829268293], "isController": false}, {"data": ["https://www.echotex.com/-10", 10, 1, 10.0, 1039.8, 597, 2088, 935.0, 2039.9, 2088.0, 2088.0, 0.943040362127499, 703.6144784692098, 0.4807295596001509], "isController": false}, {"data": ["https://www.echotex.com/-13", 10, 2, 20.0, 266.2, 1, 541, 249.5, 539.7, 541.0, 541.0, 0.9784735812133072, 20.017333506604697, 0.4854146281800391], "isController": false}, {"data": ["https://www.echotex.com/api/census/button-render", 50, 0, 0.0, 363.93999999999994, 278, 944, 336.0, 397.59999999999997, 886.9999999999998, 944.0, 6.00096015362458, 1.845998484757561, 5.9845512782045125], "isController": false}, {"data": ["https://www.echotex.com/-0", 10, 0, 0.0, 3145.0, 1730, 8339, 2386.5, 8037.500000000001, 8339.0, 8339.0, 0.7580351728320194, 60.68989491737417, 0.3723551679047908], "isController": false}, {"data": ["https://www.echotex.com/-12", 10, 2, 20.0, 1037.6, 65, 3127, 720.0, 3063.7000000000003, 3127.0, 3127.0, 0.9517464547444561, 389.5515898627106, 0.4587715332635386], "isController": false}, {"data": ["https://www.echotex.com/-1", 10, 0, 0.0, 368.70000000000005, 168, 1236, 248.5, 1156.5000000000002, 1236.0, 1236.0, 0.9480470231323473, 1.8266570084376186, 0.5629029199848312], "isController": false}, {"data": ["https://www.echotex.com/-2", 10, 0, 0.0, 494.1, 328, 1047, 353.5, 1006.0000000000002, 1047.0, 1047.0, 0.9394964299135663, 18.04218485766629, 1.2184094325441563], "isController": false}, {"data": ["https://www.echotex.com/-3", 10, 0, 0.0, 482.59999999999997, 304, 1252, 357.0, 1187.4, 1252.0, 1252.0, 0.9420631182289214, 40.577896844088556, 0.49771108101742817], "isController": false}, {"data": ["https://www.echotex.com/-4", 10, 0, 0.0, 546.1, 323, 1429, 444.0, 1351.4000000000003, 1429.0, 1429.0, 0.9404683532399135, 75.88964265141541, 0.4968685342800715], "isController": false}, {"data": ["https://www.echotex.com/-5", 10, 0, 0.0, 513.0, 295, 1396, 399.0, 1319.3000000000002, 1396.0, 1396.0, 0.942240648261566, 41.89777940379723, 0.5456530316592858], "isController": false}, {"data": ["https://www.echotex.com/-6", 10, 0, 0.0, 1045.3999999999999, 533, 1914, 822.0, 1886.4, 1914.0, 1914.0, 0.9233610341643582, 519.8019462719299, 0.5428352954755309], "isController": false}, {"data": ["https://www.echotex.com/-7", 10, 0, 0.0, 445.90000000000003, 354, 672, 405.5, 666.4, 672.0, 672.0, 0.9549274255156609, 114.23655044404126, 0.5520674178762415], "isController": false}, {"data": ["https://www.echotex.com/-8", 10, 1, 10.0, 645.6999999999999, 424, 1853, 464.5, 1762.4000000000003, 1853.0, 1853.0, 0.9562972171750981, 207.46559944893372, 0.5000948826145165], "isController": false}, {"data": ["https://www.echotex.com/-9", 10, 0, 0.0, 824.1999999999999, 573, 1370, 615.0, 1368.5, 1370.0, 1370.0, 0.9443762394938143, 572.8215527316082, 0.5422785437718387], "isController": false}, {"data": ["https://www.echotex.com/api/census/RecordHit", 10, 0, 0.0, 330.7, 289, 397, 337.0, 392.70000000000005, 397.0, 397.0, 1.4452955629426218, 0.44459775617863856, 2.0550296285590406], "isController": false}, {"data": ["https://www.echotex.com/api/1/performance/settings", 10, 0, 0.0, 305.8, 269, 364, 294.5, 362.1, 364.0, 364.0, 1.3966480446927374, 0.3396146124301676, 0.5933026361731844], "isController": false}, {"data": ["Test", 10, 3, 30.0, 7731.5, 5601, 11815, 7074.0, 11636.300000000001, 11815.0, 11815.0, 0.5953089653530182, 1806.8588080612278, 9.36570992454459], "isController": true}, {"data": ["https://www.echotex.com/", 10, 3, 30.0, 5275.299999999999, 3108, 9453, 4519.0, 9266.2, 9453.0, 9453.0, 0.6990074094785405, 2120.140191943066, 6.220824632147351], "isController": false}, {"data": ["https://www.echotex.com/-14", 10, 0, 0.0, 614.5, 329, 1618, 385.5, 1560.8000000000002, 1618.0, 1618.0, 0.9668374746205163, 54.30916818742144, 0.5410135478101131], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Socket closed", 3, 33.333333333333336, 1.3043478260869565], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 11.11111111111111, 0.43478260869565216], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, 22.22222222222222, 0.8695652173913043], "isController": false}, {"data": ["Assertion failed", 3, 33.333333333333336, 1.3043478260869565], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 230, 9, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Socket closed", 3, "Assertion failed", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://www.echotex.com/-10", 10, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.echotex.com/-13", 10, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.echotex.com/-12", 10, 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Socket closed", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.echotex.com/-8", 10, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.echotex.com/", 10, 3, "Assertion failed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
