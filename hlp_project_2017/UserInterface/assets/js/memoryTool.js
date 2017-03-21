// var dataSet = [
//     ["memory Address 1", "instruction", "<b>1234</b>"],
//     ["memory Address 2", "numbers", "<b>12345</b>"]
// ];
let table
let flag = false
let tableInit = (dataSet) => {
    $(document).ready(function () {
        table = $('#memory-datatable').DataTable({
            data: dataSet,
            columns: [
                { title: "Addr" },
                { title: "Type" },
                { title: "Content" },
            ],
            "ordering": false,
            "scrollY": "300px",
            "scrollCollapse": true,
            "paging": false,
            "dom": `<tfi>`
        });
    });

}

//update the table with new result
window.displayMemoryQuery = function (newDataSet) {
    //parse the query result string to data array
    dataArray = JSON.parse(newDataSet.replace(/\\"/g, "'"))

    console.log(dataArray);
    for (var row=0; row<dataArray.length; row++){
            dataArray[row][2] = dataArray[row][2].replace(/['\[\]{}]/g,"")
    }
    if (!flag) {
        tableInit(dataArray);
        flag = true;
        return
    }
    table.clear();
    table.rows.add(dataArray);
    table.draw();
}