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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6, 500, 1500, "https://www.echotex.com/-11"], "isController": false}, {"data": [0.3, 500, 1500, "https://www.echotex.com/-10"], "isController": false}, {"data": [0.8, 500, 1500, "https://www.echotex.com/-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.echotex.com/api/census/button-render"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.echotex.com/-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://www.echotex.com/-12"], "isController": false}, {"data": [0.8, 500, 1500, "https://www.echotex.com/-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://www.echotex.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.echotex.com/-3"], "isController": false}, {"data": [0.8, 500, 1500, "https://www.echotex.com/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.echotex.com/-5"], "isController": false}, {"data": [0.4, 500, 1500, "https://www.echotex.com/-6"], "isController": false}, {"data": [0.7, 500, 1500, "https://www.echotex.com/-7"], "isController": false}, {"data": [0.6, 500, 1500, "https://www.echotex.com/-8"], "isController": false}, {"data": [0.3, 500, 1500, "https://www.echotex.com/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.echotex.com/api/census/RecordHit"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.echotex.com/api/1/performance/settings"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.echotex.com/"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.echotex.com/-14"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 115, 0, 0.0, 1015.9217391304348, 164, 7928, 387.0, 2570.2000000000003, 5311.599999999998, 7818.880000000003, 9.370925684485007, 2645.542109960683, 10.32862855993318], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.echotex.com/-11", 5, 0, 0.0, 919.8, 245, 1976, 290.0, 1976.0, 1976.0, 1976.0, 0.9114108640174992, 23.26002409542472, 0.5206790580568721], "isController": false}, {"data": ["https://www.echotex.com/-10", 5, 0, 0.0, 2097.2, 703, 4816, 1028.0, 4816.0, 4816.0, 4816.0, 0.795671546785487, 659.3972539385742, 0.4506733370464672], "isController": false}, {"data": ["https://www.echotex.com/-13", 5, 0, 0.0, 484.6, 239, 1077, 288.0, 1077.0, 1077.0, 1077.0, 1.0917030567685588, 27.229675559497817, 0.6769838291484715], "isController": false}, {"data": ["https://www.echotex.com/api/census/button-render", 25, 0, 0.0, 340.67999999999995, 280, 396, 343.0, 389.8, 395.4, 396.0, 5.307855626326964, 1.6327876194267517, 5.2933419585987265], "isController": false}, {"data": ["https://www.echotex.com/-0", 5, 0, 0.0, 3368.4, 1730, 5450, 2593.0, 5450.0, 5450.0, 5450.0, 0.6110228522546743, 48.919062385433215, 0.30014110808994254], "isController": false}, {"data": ["https://www.echotex.com/-12", 5, 0, 0.0, 785.0, 433, 1986, 492.0, 1986.0, 1986.0, 1986.0, 0.9407337723424272, 480.5955285747883, 0.5668288452492944], "isController": false}, {"data": ["https://www.echotex.com/-1", 5, 0, 0.0, 353.6, 164, 624, 188.0, 624.0, 624.0, 624.0, 0.8880994671403197, 1.7111525865896982, 0.5273090586145649], "isController": false}, {"data": ["https://www.echotex.com/-2", 5, 0, 0.0, 455.8, 335, 589, 403.0, 589.0, 589.0, 589.0, 0.8552856654122477, 16.4249927835272, 1.1091985973315086], "isController": false}, {"data": ["https://www.echotex.com/-3", 5, 0, 0.0, 399.0, 304, 496, 386.0, 496.0, 496.0, 496.0, 0.8570449091532396, 36.91570293752143, 0.4527942342303737], "isController": false}, {"data": ["https://www.echotex.com/-4", 5, 0, 0.0, 442.8, 330, 580, 402.0, 580.0, 580.0, 580.0, 0.8549931600547196, 68.99243731831396, 0.45171025350547195], "isController": false}, {"data": ["https://www.echotex.com/-5", 5, 0, 0.0, 395.2, 309, 497, 352.0, 497.0, 497.0, 497.0, 0.8628127696289906, 38.36567757765315, 0.49965622303710094], "isController": false}, {"data": ["https://www.echotex.com/-6", 5, 0, 0.0, 1029.0, 605, 2135, 669.0, 2135.0, 2135.0, 2135.0, 0.8175277959450621, 460.2234405657293, 0.48061692691301505], "isController": false}, {"data": ["https://www.echotex.com/-7", 5, 0, 0.0, 773.6, 339, 1526, 365.0, 1526.0, 1526.0, 1526.0, 0.9087604507451835, 108.71330879680117, 0.5253771355870592], "isController": false}, {"data": ["https://www.echotex.com/-8", 5, 0, 0.0, 1229.2, 447, 2555, 495.0, 2555.0, 2555.0, 2555.0, 0.8671522719389525, 208.78215238033297, 0.503862892386403], "isController": false}, {"data": ["https://www.echotex.com/-9", 5, 0, 0.0, 1644.6, 600, 4638, 696.0, 4638.0, 4638.0, 4638.0, 0.848320325755005, 514.5578064026977, 0.48712143705463185], "isController": false}, {"data": ["https://www.echotex.com/api/census/RecordHit", 5, 0, 0.0, 370.6, 304, 442, 372.0, 442.0, 442.0, 442.0, 1.5827793605571383, 0.48689013532763536, 2.2505144032921813], "isController": false}, {"data": ["https://www.echotex.com/api/1/performance/settings", 5, 0, 0.0, 314.0, 283, 353, 309.0, 353.0, 353.0, 353.0, 1.4814814814814814, 0.3602430555555556, 0.6293402777777778], "isController": false}, {"data": ["Test", 5, 0, 0.0, 8663.0, 5258, 9995, 9356.0, 9995.0, 9995.0, 9995.0, 0.4049238743116294, 1315.052523055353, 6.515952735260771], "isController": true}, {"data": ["https://www.echotex.com/", 5, 0, 0.0, 6275.0, 2928, 7928, 6720.0, 7928.0, 7928.0, 7928.0, 0.5194265530853936, 1685.832559604197, 4.80926088847912], "isController": false}, {"data": ["https://www.echotex.com/-14", 5, 0, 0.0, 325.4, 234, 431, 328.0, 431.0, 431.0, 431.0, 1.1936022917164002, 67.04687873000717, 0.6679044073764622], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 115, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
