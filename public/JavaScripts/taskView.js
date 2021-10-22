function getTasks(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        //xhttp.open("GET", "/tasks", true);
        //xhttp.send();
        if (this.readyState == 4 && this.status == 200) {
            var table = document.getElementById("mytasks");
            var tasksList = JSON.parse(this.responseText);
            for (task in tasksList){
                var row = table.insertRow(1);
                var title= row.insertCell(0);
                var description = row.insertCell(1);
                var date = row.insertCell(2);
                var priority = row.insertCell(3);
                title.innerHTML = tasksList[task].title;
                description.innerHTML = tasksList[task].description;
                date.innerHTML = tasksList[task].date;
                priority.innerHTML = tasksList[task].priority;
            }
            
        }
    };
    xhttp.open("GET", "/tasks", true);
    xhttp.send();
    
}

window.onload = getTasks();